import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IAdmin } from '../../../core/interfaces/admin.interface';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';

@Component({
    selector: 'admins-mis-datos-admin',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './mis-datos-admin.page.html',
    styleUrl: './mis-datos-admin.page.scss'
})
export class MisDatosAdminPage implements OnInit {

    @Input() admin?: IAdmin;
    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly validadorSrv = inject(ValidadorService);

    form: FormGroup = this.formBuilder.group<IAdmin>({
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
    });

    ngOnInit(): void {
        if (!this.admin) { throw new Error("No se recupero el usuario"); }
        this.form.reset({ ...this.admin });
    }

    getForm(campo: keyof IAdmin) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IAdmin): keyof IAdmin {
        return campo;
    }

    messageError(field: keyof IAdmin, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        if (!this.admin) { return; }

        this.spinnerSrv.mostrar();
        const usuarioActualizado = { ...this.admin, ...this.form.value };
        await this.usuariosSrv.actualizar(usuarioActualizado)
            .then(() => { this.toastSrv.info('Los datos se actualizarón'); })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar actualizar el usuario');
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

}
