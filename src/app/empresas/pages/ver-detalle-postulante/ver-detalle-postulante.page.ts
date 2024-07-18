import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { EEstadoRegistro } from '../../../core/enums/estado-registro.enum';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { IExperiencia } from '../../../core/interfaces/experiencia.interface';
import { IPublicacion } from '../../../core/interfaces/publicacion.interface';
import { IRegistro } from '../../../core/interfaces/registro.interface';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { RegistroService } from '../../../core/services/registro.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'empresas-ver-detalle-postulante',
    standalone: true,
    imports: [CommonModule, RutaValidaPipe],
    providers: [TitleCasePipe],
    templateUrl: './ver-detalle-postulante.page.html',
    styleUrl: './ver-detalle-postulante.page.scss'
})
export default class VerDetallePostulantePage {
    private readonly toastSrv = inject(ToastService);
    private readonly routerSrv = inject(RouterService);
    private readonly publicacionSrv = inject(PublicacionesService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly registroSrv = inject(RegistroService);
    private readonly authSrv = inject(AuthService);
    private readonly spinnerSrv = inject(SpinnerService);
    empleado: IEmpleado | undefined;
    experienciasDeTrabajo: IExperiencia[] = [];
    experienciasAcademica: IExperiencia[] = [];
    registro?: IRegistro | null;
    empresa?: IEmpresa;
    publicacion?: IPublicacion;
    @Input() id?: string;
    @Input() idPublicacion?: string;
    EEstadosRegistro = EEstadoRegistro;

    async ngOnInit(): Promise<void> {
        if (!this.id || !this.idPublicacion) { return; }
        await this.getUsuarioLogeado();
        await this.getRegistro();
        await this.getEmpleado();
        await this.getPublicacion();
        console.log(this.publicacion);
        if (this.registro?.estado === "aplicado") {
            this.actualizarRegistro(EEstadoRegistro.visto);
        }
    }

    async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();
        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }
        this.empresa = usuario as IEmpresa;
    }

    async getRegistro(): Promise<void> {
        const registro = await this.registroSrv.getUno([
            { campo: 'idEmpleado', opcion: '==', valor: this.id },
            { campo: 'idPublicacion', opcion: '==', valor: this.idPublicacion },
        ]);

        if (!registro) {
            this.registro = null;
            return;
        }
        this.registro = registro;
    }

    async getPublicacion(): Promise<void> {
        this.publicacion = await this.publicacionSrv.getPorId(this.idPublicacion!)
            .then(publicacion => {
                if (!publicacion?.idEmpresa) {
                    throw new Error('No se pudo recuperar dentro del then...');
                }
                return publicacion;
            })
            .catch(async (error: Error) => {
                this.toastSrv.error('No se pudo recuperar la información del publicacion');
                console.error(error);
                return undefined;
            })
            .finally(() => {
                this.spinnerSrv.ocultar();
            });
    }

    async getEmpleado(): Promise<void> {
        if (!this.registro) { return; }
        await this.usuarioSrv.getPorId(this.registro.idEmpleado)
            .then((empleado) => {
                this.empleado = empleado as IEmpleado;
            })
            .catch((error: any) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar recuperar los datos del empleado');
            })
            .finally(() => {
                this.spinnerSrv.ocultar();
            });
    }

    async actualizarRegistro(estadoNuevo: EEstadoRegistro): Promise<void> {
        if (this.registro) {
            this.registro.estado = estadoNuevo;
            await this.registroSrv.guardar(this.registro)
                .then(async () => {
                    this.toastSrv.success(estadoNuevo === EEstadoRegistro.visto
                        ? 'Postulacion del empleado ' + this.empleado?.nombre + ' vista'
                        : 'Aceptaste al postulante ' + this.empleado?.nombre + ' para el empleo');
                })
                .catch((error: Error) => {
                    console.error(error);
                    this.toastSrv.error('Ha ocurrido un error');
                })
                .finally(async () => {
                    this.spinnerSrv.ocultar();
                });
        }
    }

}
