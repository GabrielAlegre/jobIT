import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { v4 } from 'uuid';
import { AuthService } from '../../../auth/services/auth.service';
import { EExperiencia } from '../../../core/enums/experiencia.enum';
import { ETipoDeUsuario } from '../../../core/enums/tipo-de-usuario.enum';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IExperiencia } from '../../../core/interfaces/experiencia.interface';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';
import { fechaMenorQueOtra } from '../../../shared/validators/fecha-menor-que-otra.validator';
import { TExperiencia } from '../../types/experiencia.type';

@Component({
    selector: 'empleados-agregar-modificar-experiencia',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RutaValidaPipe, RouterModule],
    providers: [TitleCasePipe],
    templateUrl: './agregar-modificar-experiencia.page.html',
    styleUrl: './agregar-modificar-experiencia.page.scss'
})
export default class AgregarModificarExperienciaPage implements OnInit {

    @Input() experiencia?: EExperiencia;
    private readonly routerSrv = inject(RouterService);
    private readonly routeSrv = inject(ActivatedRoute);
    private readonly toastSrv = inject(ToastService);
    private readonly title = inject(Title);
    private readonly capitalice = inject(TitleCasePipe);
    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly authSrv = inject(AuthService);
    private readonly usuarioSrv = inject(UsuariosService);

    private readonly validadorSrv = inject(ValidadorService);

    @Input() id?: string;
    titulo: 'Agregar' | 'Actualizar' = 'Agregar';
    usuario!: IEmpleado;
    indexExperiencia: number = -1;
    experienciaNombre!: TExperiencia;

    form: FormGroup = this.formBuilder.group<IExperiencia>({
        inicio: [new Date(), {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        fin: [new Date(), {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        institucion: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(25),
            ],
            asyncValidators: []
        }],
        titulo: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(25),
            ],
            asyncValidators: []
        }],
        descripcion: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(500),
            ],
            asyncValidators: []
        }],
    },
        {
            validators: [fechaMenorQueOtra<IExperiencia>('inicio', 'fin'),]
        });

    async ngOnInit(): Promise<void> {

        this.routeSrv.params.subscribe(async ({ experiencia }) => {
            this.experiencia = experiencia;
            await this.cambioDePagina();
        });

    }

    async cambioDePagina(): Promise<void> {

        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario || usuario.tipo != ETipoDeUsuario.empleado) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }

        this.usuario = usuario as IEmpleado;

        const title = `${this.title.getTitle()} ${this.capitalice.transform(this.experiencia)}`;

        if (this.experiencia == EExperiencia.estudio) {
            this.title.setTitle(title);
        } else if (this.experiencia == EExperiencia.trabajo) {
            this.title.setTitle(title);
        } else {
            this.toastSrv.error('No es una experiencia válida');
            await this.routerSrv.navigateByUrl('/mi-informacion');
            return;
        }

        const largoExperiencia = this.experiencia.length;
        this.experienciaNombre = `experienciaDe${this.experiencia[0].toUpperCase()}${this.experiencia.substring(1, largoExperiencia)}` as TExperiencia;

        if (!this.id) {
            // README: son muy importantes los reset, le sacan el new Date a los inputs
            this.getForm('inicio')?.reset();
            this.getForm('fin')?.reset();
            return;
        }

        this.indexExperiencia = (this.usuario)[this.experienciaNombre]?.
            findIndex(({ id }: any) => id === this.id) ?? -1;

        if (this.indexExperiencia > -1) {
            const experiencia = this.usuario[this.experienciaNombre]?.[this.indexExperiencia];
            this.titulo = 'Actualizar';
            this.form.reset(experiencia);
            return;
        }

        this.toastSrv.error(`No se pudo recuperar la experiencia de ${this.experiencia}`);
        await this.routerSrv.navigateByUrl(`/mi-informacion/listar/${this.experiencia}`);
    }


    getForm(campo: keyof IExperiencia) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IExperiencia): keyof IExperiencia {
        return campo;
    }

    messageError(field: keyof IExperiencia, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const experiencia = this.form.value as IExperiencia;
        if (this.titulo == 'Actualizar') {
            if (this.usuario[this.experienciaNombre]) {
                experiencia.id = this.usuario[this.experienciaNombre]![this.indexExperiencia].id;
                this.usuario[this.experienciaNombre]![this.indexExperiencia] = experiencia;
            }
        } else if (this.titulo == 'Agregar') {

            experiencia.id = v4();
            // experiencia.fecha = new Date();

            if (!this.usuario[this.experienciaNombre]) {
                this.usuario[this.experienciaNombre] = [];
            }

            this.usuario[this.experienciaNombre]?.push(experiencia);
        } else {
            this.toastSrv.error('Instancia no contemplada...');
            return;
        }

        this.usuarioSrv.actualizar(this.usuario)
            .then(() => {
                this.toastSrv.info('Se guardaron los datos de la experiencia');
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar guardar los cambios');
            })
            .finally(async () => {
                await this.routerSrv.navigateByUrl(`/mi-informacion/listar/${this.experiencia!}`);
                this.spinnerSrv.ocultar();
            });
    }

}
