import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ETipoDeUsuario } from '../../../core/enums/tipo-de-usuario.enum';
import { IUsuario } from '../../../core/interfaces/usuario.interface';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';
import { dosCamposIgualesValidator } from '../../../shared/validators/dos-campos-iguales.validator';
import { IRegistrarse } from '../../interfaces/registrarse.interface';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'auth-registrarse',
    standalone: true,
    imports: [RouterModule, RutaValidaPipe, ReactiveFormsModule],
    providers: [AuthService],
    templateUrl: './registrarse.page.html',
    styleUrl: './registrarse.page.scss'
})
export default class RegistrarsePage {

    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly toastSrv = inject(ToastService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly validadorSrv = inject(ValidadorService);
    private readonly usuarioSrv = inject(UsuariosService);
    readonly tipos: ETipoDeUsuario[] = Object.values(ETipoDeUsuario);

    form: FormGroup = this.formBuilder.group<IRegistrarse>({
        correo: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.pattern(environment.validacion.correo)
            ],
            asyncValidators: []
        }],
        clave: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(6)
            ],
            asyncValidators: []
        }],
        repiteClave: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        tipo: [ETipoDeUsuario.empleado, {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
    },
        {
            validators: [dosCamposIgualesValidator<IRegistrarse>('clave', 'repiteClave')]
        });

    getForm(campo: keyof IRegistrarse) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IRegistrarse): keyof IRegistrarse {
        return campo;
    }

    messageError(field: keyof IRegistrarse, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.spinnerSrv.mostrar();
        const usuario = await this.authSrv
            .registrarse(this.getForm('correo')?.value, this.getForm('clave')?.value)
            .then((credential) => credential.user)
            .catch((error: any) => {
                console.error(error);
                this.toastSrv.error(error?.message || error?.code);
            })
            .finally(() => { this.spinnerSrv.ocultar(); });

        if (!usuario) {
            this.toastSrv.error('No se pudo registrar el usuario');
            return;
        }

        const registro = { ...this.form.value } as IRegistrarse;
        const { repiteClave, ...registroReal } = registro;
        const _usuario = { ...registroReal, id: usuario.uid } as IUsuario;

        await this.usuarioSrv.guardar(_usuario)
            .then(async () => {
                this.toastSrv.success('Se registro al usuario');
                this.toastSrv.info('Ha iniciado sessión');
                await this.routerSrv.navigateByUrl('/');
            })
            .catch((error: any) => {
                this.toastSrv.error(error?.message || error?.code);
            })
            .finally(() => { this.spinnerSrv.ocultar(); });

    }
}
