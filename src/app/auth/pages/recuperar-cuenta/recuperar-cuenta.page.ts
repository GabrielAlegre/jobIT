import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';
import { IRecuperarCuenta } from '../../interfaces/recuperar-cuenta.interface';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'auth-recuperar-cuenta',
    standalone: true,
    imports: [RouterModule, RutaValidaPipe, ReactiveFormsModule],
    providers: [AuthService],
    templateUrl: './recuperar-cuenta.page.html',
    styleUrl: './recuperar-cuenta.page.scss'
})
export default class RecuperarCuentaPage {

    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly toastSrv = inject(ToastService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly validadorSrv = inject(ValidadorService);

    form: FormGroup = this.formBuilder.group<IRecuperarCuenta>({
        correo: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.pattern(environment.validacion.correo)
            ],
            asyncValidators: []
        }],
    });

    getForm(campo: keyof IRecuperarCuenta) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IRecuperarCuenta): keyof IRecuperarCuenta {
        return campo;
    }

    messageError(field: keyof IRecuperarCuenta, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.spinnerSrv.mostrar();
        await this.authSrv
            .recuperarCuenta(this.getForm('correo')?.value)
            .then(async (user: any) => {
                this.toastSrv.info('Se ha enviado un mail para recuperar la cuenta');
                await this.routerSrv.navigateByUrl('/inicio');
            })
            .catch((e: any) => {
                this.toastSrv.error(e?.message || e?.code);
            })
            .finally(() => {
                this.spinnerSrv.ocultar();
            });
    }
}
