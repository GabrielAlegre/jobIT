import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ISuscripcion } from '../../../core/interfaces/suscripcion.interface';
import { SuscripcionesService } from '../../../core/services/suscripciones.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';


@Component({
    selector: 'admins-suscripcion',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './suscripcion.page.html',
    styleUrl: './suscripcion.page.scss'
})
export default class SubscripcionPage implements OnInit {

    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly toastSrv = inject(ToastService);
    private readonly suscripcionSrv = inject(SuscripcionesService);
    private readonly validadorSrv = inject(ValidadorService);
    private subscripcion?: ISuscripcion;

    form: FormGroup = this.formBuilder.group<ISuscripcion>({
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
    });

    async ngOnInit(): Promise<void> {

        this.subscripcion = await this.suscripcionSrv.getPorId(environment.ids.suscripcion)
            .catch((error: Error) => {
                this.toastSrv.error(error.message);
                console.error(error);
                return undefined;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
        this.form.reset({ ...this.subscripcion });
    }

    getForm(campo: keyof ISuscripcion) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof ISuscripcion): keyof ISuscripcion {
        return campo;
    }

    messageError(field: keyof ISuscripcion, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (!this.subscripcion) { return; }

        this.spinnerSrv.mostrar();
        const subscripcionActualizada = { ...this.subscripcion, ...this.form.value };
        await this.suscripcionSrv.actualizar(subscripcionActualizada)
            .then(() => { this.toastSrv.info('Los datos se actualizarón'); })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar actualizar la subscripción');
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

}
