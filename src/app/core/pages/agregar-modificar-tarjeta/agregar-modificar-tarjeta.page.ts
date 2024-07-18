import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { v4 } from 'uuid';
import { AuthService } from '../../../auth/services/auth.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';
import { ETipoDeTarjeta } from '../../enums/tipo-de-tarjeta.enum';
import { ETipoDeUsuario } from '../../enums/tipo-de-usuario.enum';
import { IEmpleado } from '../../interfaces/empleado.interface';
import { ITarjeta } from '../../interfaces/tarjeta.interface';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
    selector: 'app-agregar-modificar-tarjeta',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule, RutaValidaPipe],
    templateUrl: './agregar-modificar-tarjeta.page.html',
    styleUrl: './agregar-modificar-tarjeta.page.scss'
})
export default class AgregarModificarTarjetaPage implements OnInit {

    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly authSrv = inject(AuthService);
    private readonly validadorSrv = inject(ValidadorService);
    readonly tipos: ETipoDeTarjeta[] = Object.values(ETipoDeTarjeta);
    @Input() id?: string;
    titulo: 'Agregar' | 'Actualizar' = 'Agregar';
    //README podría castear a empleado o empresa
    usuario!: IEmpleado;
    indexTarjeta: number = -1;

    form: FormGroup = this.formBuilder.group<ITarjeta>({
        tipo: [ETipoDeTarjeta.credito, {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        nombre: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(40),
            ],
            asyncValidators: []
        }],
        numero: [0, {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.min(1111111111111111),
                Validators.max(9999999999999999),
            ],
            asyncValidators: []
        }],
        codigoDeSeguridad: ['0', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.min(1),
                Validators.max(999),
            ],
            asyncValidators: []
        }],
        mesDeVencimiento: [0, {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.min(1),
                Validators.max(12),
            ],
            asyncValidators: []
        }],
        anioDeVencimiento: [0, {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.min(new Date().getFullYear()),
                Validators.max(2030),
            ],
            asyncValidators: []
        }],
    });

    async ngOnInit(): Promise<void> {

        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario || usuario.tipo == ETipoDeUsuario.admin) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }

        this.usuario = usuario as IEmpleado;

        if (!this.id) { return; }

        this.titulo = 'Actualizar';

        this.indexTarjeta = this.usuario.tarjetas?.
            findIndex(({ id }) => id === this.id) ?? -1;

        if (this.indexTarjeta > -1) {
            const tarjeta = this.usuario.tarjetas?.[this.indexTarjeta];
            this.form.reset(tarjeta);
            return;
        }

        this.toastSrv.error('No se pudo recuperar la información de la tarjeta');
        await this.routerSrv.navigateByUrl('/mis-tarjetas/listar-tarjetas');
    }

    getForm(campo: keyof ITarjeta) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof ITarjeta): keyof ITarjeta {
        return campo;
    }

    messageError(field: keyof ITarjeta, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const codigo = this.getForm('codigoDeSeguridad')?.value as string;
        const tarjeta = { ... this.form.value as ITarjeta, codigoDeSeguridad: codigo.toString() };

        if (this.titulo == 'Actualizar') {
            if (this.usuario.tarjetas) {
                tarjeta.id = this.usuario.tarjetas![this.indexTarjeta].id;
                this.usuario.tarjetas![this.indexTarjeta] = tarjeta;
            }
        } else if (this.titulo == 'Agregar') {

            const tarjetaRepetida = this.usuario.tarjetas?.
                some(({ numero }) => this.getForm('numero')?.value == numero as number);

            if (tarjetaRepetida) {
                this.toastSrv.warning('El número de tarjeta ya está registrado en su cuenta');
                return;
            }

            tarjeta.id = v4();
            tarjeta.fecha = new Date();

            if (!this.usuario.tarjetas) {
                this.usuario.tarjetas = [];
            }

            this.usuario.tarjetas?.push(tarjeta);
        } else {
            this.toastSrv.error('Instancia no contemplada...');
            return;
        }

        this.usuarioSrv.actualizar(this.usuario)
            .then(() => {
                this.toastSrv.info('Se guardaron los datos de la tarjeta');
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar guardar los cambios');
            })
            .finally(async () => {
                await this.routerSrv.navigateByUrl('/mis-tarjetas/listar-tarjetas');
                this.spinnerSrv.ocultar();
            });
    }

}
