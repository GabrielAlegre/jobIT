import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EEstadoPublicacion } from '../../../core/enums/estado-publicacion.enum';
import { ETipoDeUsuario } from '../../../core/enums/tipo-de-usuario.enum';
import { IAdmin } from '../../../core/interfaces/admin.interface';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { IEstadistica } from '../../../core/interfaces/estadistica.interface';
import { IPago } from '../../../core/interfaces/pago.interface';
import { IPublicacion } from '../../../core/interfaces/publicacion.interface';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { PagosService } from '../../../core/services/pagos.service';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { TTodosLosUsuarios } from '../../../core/types/todos-los-usuarios.type';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
@Component({
    selector: 'admins-panel-de-control',
    standalone: true,
    imports: [],
    templateUrl: './panel-de-control.page.html',
    styleUrl: './panel-de-control.page.scss'
})
export default class PanelDeControlPage {
    private readonly toastSrv = inject(ToastService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly pagosSrv = inject(PagosService);
    private readonly estadisticasSrv = inject(EstadisticasService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly publicacionSrv = inject(PublicacionesService);
    private readonly modalService = inject(NgbModal);
    @ViewChild('userDetailModal') userDetailModal!: TemplateRef<any>;
    estadisticasDelUserSeleccionado?: IEstadistica['usuarios'][0];
    pagos: IPago[] = [];
    visitasPagina: number = 3432;
    publicacionesActivas: IPublicacion[] = [];
    publicacionesPausadas: IPublicacion[] = [];
    publicacionesFinalizadas: IPublicacion[] = [];
    publicaciones: IPublicacion[] = [];
    countPublicacionesActivas: number = 0;
    countPublicacionesPausadas: number = 0;
    countPublicacionesFinalizadas: number = 0;
    countPublicaciones: number = 0;
    dineroGanado?: number;
    usuarios: (any)[] = [];
    ETipoDeUsuario = ETipoDeUsuario;
    estadistica!: IEstadistica;
    usuarioSeleccionado!: any;
    fotoDefault: string = "./assets/images/sin_foto_de_perfil.png";

    async ngOnInit(): Promise<void> {
        await this.traerUsers();
        await this.obtenerDineroGanado();
        await this.getPublicaciones();
        await this.estadisticasSrv.getUno().then((estadistica) => {
            this.estadistica = estadistica;
            this.visitasPagina = estadistica.visitas;
        });

    }

    openModal(user: any): void {
        console.log(user);
        this.usuarioSeleccionado = user;
        console.log(this.estadistica.usuarios.find((usuario) => usuario.idUser == user.id));
        this.estadisticasDelUserSeleccionado = this.estadistica.usuarios.find((usuario) => usuario.idUser == user.id);
        if (this.estadisticasDelUserSeleccionado != undefined) {
            this.estadisticasDelUserSeleccionado.fechaFin = this.convertTimestampToDate(this.estadisticasDelUserSeleccionado.fechaFin);
            this.estadisticasDelUserSeleccionado.fechaInicio = this.convertTimestampToDate(this.estadisticasDelUserSeleccionado.fechaInicio);
            this.estadisticasDelUserSeleccionado.minutosActivo = this.calculateMinutosActivo(this.estadisticasDelUserSeleccionado.fechaInicio, this.estadisticasDelUserSeleccionado.fechaFin);
        }
        this.modalService.open(this.userDetailModal);
    }

    private calculateMinutosActivo(fechaInicio: Date, fechaFin: Date): number {
        const diffInMs = fechaFin.getTime() - fechaInicio.getTime();
        return Math.floor(diffInMs / 60000); // Convertir milisegundos a minutos
    }

    async traerUsers(): Promise<void> {
        this.usuarios = await this.usuarioSrv.getTodos([])
            .then((usuarios: TTodosLosUsuarios[]) => {
                return this.casteoUsers(usuarios); // Castear usuarios después de obtenerlos
            })
            .catch((error: Error) => {
                this.toastSrv.error('No se pudo traer los usuarios');
                console.error(error);
                return [];
            })
            .finally(() => {
                this.spinnerSrv.ocultar(); // Ocultar spinner después de la operación
            });
        console.log({ area: this.usuarios });
    }

    private casteoUsers(usuarios: TTodosLosUsuarios[]): (IEmpleado | IEmpresa | IAdmin)[] {
        return usuarios.map(user => {
            if (user.tipo == ETipoDeUsuario.empleado) {
                return user as IEmpleado;
            } else if (user.tipo == ETipoDeUsuario.empresa) {
                return user as IEmpresa;
            } else {
                return user as IAdmin;
            }
        });
    }

    async obtenerDineroGanado(): Promise<void> {
        const pagos = await this.pagosSrv.getTodos([])
            .then((pagos: IPago[]) => {
                this.pagos = pagos.map(pago => ({
                    ...pago,
                    fecha: this.convertTimestampToDate(pago.fecha),
                }));
                this.pagos.reverse();
                this.dineroGanado = pagos.reduce((total, pago) => total + pago.precio, 0);
            })
            .catch((error: Error) => {
                this.toastSrv.error('No se pudo traer los pagos');
                console.error(error);
                return [];
            })
            .finally(() => {
                this.spinnerSrv.ocultar();
            });
        console.log(this.dineroGanado);
    }
    convertTimestampToDate(timestamp: any): Date {
        if (timestamp instanceof Timestamp) {
            return timestamp.toDate();
        }
        return new Date(timestamp);
    }

    private async getPublicaciones(): Promise<void> {
        try {
            // Obtener todas las publicaciones
            const todasPublicaciones = await this.publicacionSrv.getTodos([]);

            // Filtrar publicaciones activas
            this.publicacionesActivas = todasPublicaciones.filter(publicacion => publicacion.estado === EEstadoPublicacion.activa);

            // Filtrar publicaciones pausadas 
            this.publicacionesPausadas = todasPublicaciones.filter(publicacion => publicacion.estado === EEstadoPublicacion.pausada);

            // Filtrar publicaciones finalizadas
            this.publicacionesFinalizadas = todasPublicaciones.filter(publicacion => publicacion.estado === EEstadoPublicacion.finalizada);

            // Actualizar las propiedades de las publicaciones con el área de trabajo
            this.publicaciones = todasPublicaciones.map((publicacion) => ({
                ...publicacion,
                areaDeTrabajo: (publicacion.areaDeTrabajo as any).nombre
            }));

            this.countPublicacionesActivas = this.publicacionesActivas.length;
            this.countPublicacionesPausadas = this.publicacionesPausadas.length;
            this.countPublicacionesFinalizadas = this.publicacionesFinalizadas.length;
            this.countPublicaciones = this.publicaciones.length;
        } catch (error) {
            console.error(error);
            this.toastSrv.error('Error al traer las publicaciones');
        }
    }


}
