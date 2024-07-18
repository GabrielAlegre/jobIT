import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { GeoRefService } from '../../../core/services/geo-ref.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';

@Component({
    selector: 'empleados-mis-datos-empleado',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './mis-datos-empleado.page.html',
    styleUrl: './mis-datos-empleado.page.scss'
})
export class MisDatosEmpleadoPage implements OnInit {

    @Input() empleado?: IEmpleado;
    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly validadorSrv = inject(ValidadorService);
    private readonly geoRefSrv = inject(GeoRefService);

    provincias?: string[];
    localidades?: string[];
    form: FormGroup = this.formBuilder.group<IEmpleado>({
        nombre: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(25),
            ],
            asyncValidators: []
        }],
        apellido: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(25),
            ],
            asyncValidators: []
        }],
        dni: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(7),
                Validators.maxLength(13),
            ],
            asyncValidators: []
        }],
        telefono: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(15),
            ],
            asyncValidators: []
        }],
        provincia: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        localidad: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        domicilio: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(30),
            ],
            asyncValidators: []
        }],
    });


    async ngOnInit(): Promise<void> {
        if (!this.empleado) { throw new Error('No se recupero el usuario'); }

        await this.traerProvincias();
        await this.traerLocalidades(String(this.empleado?.provincia));
        this.form.reset({ ...this.empleado });
    }

    getForm(campo: keyof IEmpleado) {
        return this.form.get(campo);
    }

    getFormArray(campo: 'experienciaDeTrabajo' | 'experienciaDeEstudio') {
        return this.getForm(campo) as FormArray;
    }

    agregarExperiencia() {
        const experiencia = this.formBuilder.group({
            duracion: this.formBuilder.group({
                inicio: '',
                fin: ''
            }),
            nombre: '',
            description: ''
        });
    }

    formControlName(campo: keyof IEmpleado): keyof IEmpleado {
        return campo;
    }

    messageError(field: keyof IEmpleado, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (!this.empleado) { return; }

        this.spinnerSrv.mostrar();
        const empleadoActualizado = { ...this.empleado, ...this.form.value };
        await this.usuariosSrv.actualizar(empleadoActualizado)
            .then(() => { this.toastSrv.info('Los datos se actualizarón'); })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar actualizar el usuario');
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

    async traerProvincias(): Promise<void> {
        this.spinnerSrv.mostrar();
        this.provincias = await this.geoRefSrv.getProvincias()
            .catch((error) => {
                console.error(error);
                this.toastSrv.error(error.toString());
                return [];
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

    async traerLocalidades(provincia: string): Promise<void> {
        this.spinnerSrv.mostrar();
        this.localidades = await this.geoRefSrv.getLocalidades(provincia)
            .catch((error) => {
                console.error(error);
                this.toastSrv.error(error.toString());
                return [];
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

}
