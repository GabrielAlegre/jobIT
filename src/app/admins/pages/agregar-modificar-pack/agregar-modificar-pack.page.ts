import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IPack } from '../../../core/interfaces/pack.interface';
import { PacksService } from '../../../core/services/packs.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';

@Component({
    selector: 'admins-agregar-modificar-pack',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule, RutaValidaPipe],
    templateUrl: './agregar-modificar-pack.page.html',
    styleUrl: './agregar-modificar-pack.page.scss'
})
export default class AgregarModificarPackPage implements OnInit {

    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly packsSrv = inject(PacksService);
    private readonly validadorSrv = inject(ValidadorService);
    @Input() id?: string;
    pack?: IPack;
    titulo: 'Agregar' | 'Actualizar' = 'Agregar';

    form: FormGroup = this.formBuilder.group<IPack>({
        precio: [0, {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.min(10),
                Validators.max(1000000),
            ],
            asyncValidators: []
        }],
        nombre: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20),
            ],
            asyncValidators: []
        }],
        descripcion: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(1000),
            ],
            asyncValidators: []
        }],
        cantidadDePublicaciones: [0, {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.min(1),
                Validators.max(10),
            ],
            asyncValidators: []
        }],
    });

    async ngOnInit(): Promise<void> {

        if (!this.id) { return; }
        this.pack = await this.packsSrv.getPorId(this.id)
            .then(pack => {
                if (!pack.nombre) {
                    throw new Error('No se pudo recuperar dentro del then...');
                }
                this.titulo = 'Actualizar';
                return pack;
            })
            .catch(async (error: Error) => {
                this.toastSrv.error('No se pudo recuperar la información del pack');
                console.error(error);
                await this.routerSrv.navigateByUrl('/mis-ingresos/listar-packs');
                return undefined;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });

        this.form.reset({ ...this.pack });
    }

    getForm(campo: keyof IPack) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IPack): keyof IPack {
        return campo;
    }

    messageError(field: keyof IPack, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.spinnerSrv.mostrar();
        const packActualizado = { ...this.pack, ...this.form.value, fecha: new Date() };
        await this.packsSrv.guardar(packActualizado)
            .then(() => {
                this.toastSrv.info('Los datos se agregaron');
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar guardar los cambios');
            })
            .finally(async () => {
                await this.routerSrv.navigateByUrl('/mis-ingresos/listar-packs');
                this.spinnerSrv.ocultar();
            });
    }

}
