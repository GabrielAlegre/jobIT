import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { GeoRefService } from '../../../core/services/geo-ref.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';

@Component({
    selector: 'empresas-mis-datos-empresa',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './mis-datos-empresa.page.html',
    styleUrl: './mis-datos-empresa.page.scss'
})
export class MisDatosEmpresaPage implements OnInit {
    @Input() empresa?: IEmpresa;
    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly validadorSrv = inject(ValidadorService);
    private readonly geoRefSrv = inject(GeoRefService);

    provincias?: string[];
    localidades?: string[];
    form: FormGroup = this.formBuilder.group<IEmpresa>({
        nombre: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(40),
            ],
            asyncValidators: []
        }],
        cuit: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)
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
        }]
    });

    async ngOnInit(): Promise<void> {
        if (!this.empresa) { throw new Error('No se recupero el usuario'); }

        await this.traerProvincias();
        await this.traerLocalidades(String(this.empresa?.provincia));
        this.form.reset({ ...this.empresa });
    }

    getForm(campo: keyof IEmpresa) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IEmpresa): keyof IEmpresa {
        return campo;
    }

    messageError(field: keyof IEmpresa, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (!this.empresa) { return; }

        this.spinnerSrv.mostrar();
        const empresaActualizada = { ...this.empresa, ...this.form.value };
        await this.usuariosSrv.actualizar(empresaActualizada)
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
