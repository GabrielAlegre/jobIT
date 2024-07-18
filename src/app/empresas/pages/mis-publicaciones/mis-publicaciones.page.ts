import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { EEstadoPublicacion } from '../../../core/enums/estado-publicacion.enum';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { IPublicacion } from '../../../core/interfaces/publicacion.interface';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { ModalService } from '../../../shared/services/modal.service';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { NotificacionService } from '../../../core/services/notificacion.service';
import { RegistroService } from '../../../core/services/registro.service';
import { INotificacion } from '../../../core/interfaces/notificacion.interface';

@Component({
    selector: 'empresas-mis-publicaciones',
    standalone: true,
    imports: [RouterModule, CommonModule, RutaValidaPipe],
    templateUrl: './mis-publicaciones.page.html',
    styleUrl: './mis-publicaciones.page.scss'
})
export default class MisPublicacionesPage {

    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly publicacionSrv = inject(PublicacionesService);
    private readonly authSrv = inject(AuthService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly modalSrv = inject(ModalService);
    private readonly notificacionSrv = inject(NotificacionService);
    private readonly registroSrv = inject(RegistroService);

    publicaciones?: IPublicacion[];
    publicacionesFiltradas?: IPublicacion[];
    empresa?: IEmpresa;
    estadosSeleccionados: EEstadoPublicacion[] = [EEstadoPublicacion.activa];
    estadoDisponiblesParaFiltrar = EEstadoPublicacion;
    public notificaciones: Map<string, INotificacion | undefined> = new Map();

    async ngOnInit(): Promise<void> {
        await this.getUsuarioLogeado();
        await this.obtenerPublicacionesDeLaEmpresa();
        await this.cargarNotificaciones();
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

    async obtenerPublicacionesDeLaEmpresa(): Promise<void> {
        if (!this.empresa?.id) { return; }
        const publicaciones = await this.publicacionSrv
            .getPublicacionesPorEmpresa(String(this.empresa?.id));
        this.publicaciones = publicaciones ? publicaciones : [];
        this.filtrarPublicaciones();
    }

    async cargarNotificaciones(): Promise<void> {
        if (!this.publicaciones) { return; }
        for (let publicacion of this.publicaciones) {
            const numeroPostulantes = await this.registroSrv.contarPostulantesPorPublicacion(String(publicacion.id));
            console.log(numeroPostulantes);
            if (numeroPostulantes > 0) {
                await this.notificacionSrv.manejarNotificacion(String(publicacion.id), numeroPostulantes, 'empresa');
                this.notificacionSrv.obtenerNotificacion(String(publicacion.id), 'empresa').then(notificacion => {
                    this.notificaciones.set(String(publicacion.id), notificacion);
                });
            } else {
                this.notificaciones.set(String(publicacion.id), undefined);
            }
        }
    }

    async marcarComoVista(publicacionId: string): Promise<void> {
        await this.notificacionSrv.marcarNotificacionComoVista(publicacionId, 'empresa');
    }

    async redirectToPostulantes(publicacion: IPublicacion) {
        // Reemplaza 'ruta-detalles-publicacion' con la ruta real de detalles de la publicación
        await this.routerSrv.navigateByUrl('publicacion/ver-postulantes', { state: { publicacion } });
    }

    async eliminarPublicacion(publicacion: IPublicacion): Promise<void> {
        if (!this.empresa) { return; }
        if (!publicacion.id) { return; }
        if (!(await this.modalSrv.confirm('¿Realmente quiere eliminar?'))) { return; }

        await this.publicacionSrv.eliminarPorId(publicacion.id.toString())
            .then(async () => {
                await this.obtenerPublicacionesDeLaEmpresa();
                this.toastSrv.success('Se eliminó la publicacion exitosamente!');
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al eliminar la publicacion');
            })
            .finally(async () => {
                await this.routerSrv.navigateByUrl('/mis-publicaciones/listar-publicaciones');
                this.spinnerSrv.ocultar();
            });
    }

    async pausarPublicacion(publicacion: IPublicacion): Promise<void> {
        if (!this.empresa) { return; }

        if (!publicacion?.id) { return; }

        publicacion.estado = publicacion.estado === EEstadoPublicacion.pausada
            ? EEstadoPublicacion.activa
            : EEstadoPublicacion.pausada;

        await this.publicacionSrv.guardar(publicacion)
            .then(async () => {
                await this.obtenerPublicacionesDeLaEmpresa();
                const mensaje = publicacion.estado === EEstadoPublicacion.pausada
                    ? 'Se pausó la publicación exitosamente!'
                    : 'Se reactivó la publicación exitosamente!';
                this.toastSrv.success(mensaje);
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al pausar la publicacion');
            })
            .finally(async () => {
                this.spinnerSrv.ocultar();
                await this.routerSrv.navigateByUrl('/mis-publicaciones/listar-publicaciones');
            });
    }

    filtrarPublicaciones(): void {
        this.publicacionesFiltradas = this.publicaciones?.filter(publicacion => this.estadosSeleccionados.includes(publicacion.estado as EEstadoPublicacion)) || [];
    }


    actualizarFiltroEstado(estado: EEstadoPublicacion, event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.checked) {
            this.estadosSeleccionados.push(estado);
        } else {
            this.estadosSeleccionados = this.estadosSeleccionados.filter(e => e !== estado);
        }
        this.filtrarPublicaciones();
    }


}
