import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { IRegistro } from '../../../core/interfaces/registro.interface';
import { NotificacionregistroService } from '../../../core/services/notificacionregistro.service';
import { RegistroService } from '../../../core/services/registro.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'empresas-ver-postulantes',
    standalone: true,
    imports: [CommonModule, RutaValidaPipe, RouterModule, FormsModule],
    templateUrl: './ver-postulantes.page.html',
    styleUrl: './ver-postulantes.page.scss'
})
export default class VerPostulantesPage {
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly registroSrv = inject(RegistroService);
    private readonly authSrv = inject(AuthService);
    private readonly notificacionregistroSrv = inject(NotificacionregistroService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly cdr = inject(ChangeDetectorRef);
    registros?: IRegistro[] | null;
    empleados?: IEmpleado[];
    empresa?: IEmpresa;
    @Input() id?: string;
    // Variables para filtros
    estadoSolicitud: string = ""; // Variable para el estado de solicitud seleccionado
    registroConEmpleadoContratado?: IRegistro | null;
    empleadoContratado?: IEmpleado | null;

    async ngOnInit(): Promise<void> {
        if (!this.id) { return; }
        await this.notificacionVista(this.id);
        await this.getUsuarioLogeado();
        await this.getRegistros();
        await this.getEmpleados();
        await this.hayEmpleadoContratado();
        this.cdr.detectChanges();
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

    async getRegistros(): Promise<void> {
        const registro = await this.registroSrv.getTodos([
            { campo: 'idEmpresa', opcion: '==', valor: this.empresa?.id },
            { campo: 'idPublicacion', opcion: '==', valor: this.id },
        ]);

        if (!registro) {
            this.registros = null;
            return;
        }
        this.registros = registro;
    }

    async hayEmpleadoContratado(): Promise<void> {
        const registro = await this.registroSrv.getUno([
            { campo: 'idEmpresa', opcion: '==', valor: this.empresa?.id },
            { campo: 'idPublicacion', opcion: '==', valor: this.id },
            { campo: 'estado', opcion: '==', valor: "aceptadoEmpleado" },
        ]);

        if (!registro) {
            this.registroConEmpleadoContratado = null;
            this.empleadoContratado = null;
            return;
        }
        this.registroConEmpleadoContratado = registro;
        this.empleadoContratado = this.empleados?.find(empleado => empleado.id === registro.idEmpleado) || null;
    }

    async getEmpleados(): Promise<void> {
        if (!this.registros) { return; }

        const idEmpleados = this.registros.map(reg => reg.idEmpleado);

        const empleadoPromises = idEmpleados.map(id => this.usuariosSrv.getPorId(id));

        Promise.all(empleadoPromises)
            .then((empleados) => {

                this.empleados = empleados.filter(empleado => empleado !== null) as IEmpleado[];
                this.empleados.forEach(empleado => {
                    empleado.esPremium = this.esPremium(empleado);
                });

                // Ordenar empleados: los premium primero
                this.empleados.sort((a, b) => (b.esPremium ? 1 : 0) - (a.esPremium ? 1 : 0));

            })
            .catch((error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar recuperar los datos de los empleados');
            })
            .finally(async () => {
                this.spinnerSrv.ocultar();
            });
    }

    async notificacionVista(publicacionId: String): Promise<void> {
        await this.notificacionregistroSrv.marcarNotificacionComoVista(String(publicacionId), 'empresa');
    }

    esPremium(empleado: IEmpleado): boolean {
        return !!empleado.suscripcion; // Asume que un empleado es premium si tiene definido el campo suscripcion
    }

    cumpleFiltro(empleado: IEmpleado): boolean {
        if (!this.registros) { return false; }

        if (this.estadoSolicitud === "Todas") {
            return true; // Si se selecciona "Todas", mostrar todos los empleados
        }

        return this.registros.some(registro =>
            registro.idEmpleado === empleado.id &&
            (
                (!this.estadoSolicitud || registro.estado === this.estadoSolicitud)
            )
        );
    }

    obtenerEstado(empleado: IEmpleado): string | null {
        if (!this.registros) {
            return null;
        }

        const registro = this.registros.find(reg => reg.idEmpleado === empleado.id);
        return registro ? registro.estado : null;
    }

    obtenerEstadoMensaje(empleado: IEmpleado): string {
        const estado = this.obtenerEstado(empleado);
        if (estado) {
            switch (estado) {
                case 'aplicado':
                    return 'Aplicada (sin ver)'; //amarillo
                case 'visto':
                    return 'Vista'; //blanco
                case 'aceptadoEmpresa':
                    return 'Aceptada, esperando confirmación'; //azul o celeste
                case 'aceptadoEmpleado':
                    return 'Empleado Contratado'; //verde
                case 'rechazadoEmpleado':
                    return 'Empleado Rechazo'; //rojo
                default:
                    return '';
            }
        }
        return '';
    }
}
