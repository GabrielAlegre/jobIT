import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { IEstadistica } from '../../../core/interfaces/estadistica.interface';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { TTodosLosUsuarios } from '../../../core/types/todos-los-usuarios.type';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';
import { IIniciarSesion } from '../../interfaces/iniciar-sesion.interface';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'auth-iniciar-sesion',
    standalone: true,
    imports: [RouterModule, RutaValidaPipe, ReactiveFormsModule],
    providers: [AuthService],
    templateUrl: './iniciar-sesion.page.html',
    styleUrl: './iniciar-sesion.page.scss'
})
export default class IniciarSesionPage {

    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly toastSrv = inject(ToastService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly validadorSrv = inject(ValidadorService);
    private readonly estadisticasSrv = inject(EstadisticasService);
    userLog!: TTodosLosUsuarios;
    estadistica!: IEstadistica;

    form: FormGroup = this.formBuilder.group<IIniciarSesion>({
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
    });


    async ngOnInit(): Promise<void> {
        await this.obtenerEstadisticas();
    }

    async obtenerEstadisticas() {
        await this.estadisticasSrv.getUno().then((estadistica) => {
            this.estadistica = estadistica;
            console.log(this.estadistica);
        }).catch(async (error) => {
            console.log(error);
        })
            .finally(async () => {
                this.spinnerSrv.ocultar();
            });
    }

    getForm(campo: keyof IIniciarSesion) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IIniciarSesion): keyof IIniciarSesion {
        return campo;
    }

    messageError(field: keyof IIniciarSesion, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // this.spinnerSrv.mostrar();
        await this.authSrv
            .iniciarSesion(this.getForm('correo')?.value, this.getForm('clave')?.value)
            .then(async (user: any) => {
                this.toastSrv.info('Ha ingresado');
                await this.getUsuarioLogeado().then(async (user: any) => {
                    // Buscar si el usuario ya está en el array
                    const usuarioExistente = this.estadistica.usuarios.find(u => u.idUser === this.userLog?.id);

                    if (usuarioExistente) {
                        // Si el usuario ya está, actualizar el valor de vecesQueIngreso
                        usuarioExistente.vecesQueIngreso += 1;
                        usuarioExistente.fechaInicio = new Date();
                        usuarioExistente.fechaFin = new Date();
                    }

                    this.estadistica.visitas += 1;
                    await this.routerSrv.navigateByUrl('/').then(async () => {
                        await this.estadisticasSrv.guardar(this.estadistica);
                    });
                });
            })
            .catch((e: any) => {
                this.toastSrv.error(e?.message || e?.code);
            })
            .finally(() => {
                this.spinnerSrv.ocultar();
            });
    }

    acceder(usuario: 1 | 2 | 3): void {
        if (usuario == 1) {
            this.getForm('correo')?.setValue('cacciatoriagustin@gmail.com');
            this.getForm('clave')?.setValue('123123');
        }
        else if (usuario == 2) {
            this.getForm('correo')?.setValue('celes@gmail.com');
            this.getForm('clave')?.setValue('123456');
        }
        else if (usuario == 3) {
            this.getForm('correo')?.setValue('gabrielalegre68@gmail.com');
            this.getForm('clave')?.setValue('123456');
        }
    }

    async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            return;
        }
        this.userLog = usuario;
    }
}
