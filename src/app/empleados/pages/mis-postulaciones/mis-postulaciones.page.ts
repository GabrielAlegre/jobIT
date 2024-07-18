import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CardPublicacionComponent } from '../../../core/components/card-publicacion/card-publicacion.component';
import { EEstadoRegistro } from '../../../core/enums/estado-registro.enum';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
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
    selector: 'empleados-mis-postulaciones',
    standalone: true,
    imports: [CommonModule, RutaValidaPipe, RouterModule, CardPublicacionComponent, FormsModule],
    providers: [TitleCasePipe],
    templateUrl: './mis-postulaciones.page.html',
    styleUrl: './mis-postulaciones.page.scss'
})
export default class MisPostulacionesPage {

    private readonly toastSrv = inject(ToastService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly publicacionSrv = inject(PublicacionesService);
    private readonly registroSrv = inject(RegistroService);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly spinnerSrv = inject(SpinnerService);
    publicaciones: IPublicacion[] = [];
    empleado?: IEmpleado;
    experienciaRender: IExperiencia[] = [];
    registros?: IRegistro[] | null;
    estadoSolicitud: string = "Todas";
    EEstadoRegistro = EEstadoRegistro;

    async ngOnInit(): Promise<void> {
        /// TODO solo las activas
        await this.getUsuarioLogeado();
        await this.getRegistros();
        await this.getPublicaciones();
    }

    async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }
        this.empleado = usuario as IEmpleado;
    }

    async getRegistros(): Promise<void> {
        const registro = await this.registroSrv.getTodos([
            { campo: 'idEmpleado', opcion: '==', valor: this.empleado?.id }
        ]);

        if (!registro) {
            this.registros = null;
            return;
        }
        this.registros = registro;
    }

    async getPublicaciones(): Promise<void> {
        if (!this.registros) { return; }

        const idPublicaciones = this.registros.map(reg => reg.idPublicacion);

        const publicacionPromises = idPublicaciones.map(id => this.publicacionSrv.getPorId(id));

        Promise.all(publicacionPromises)
            .then((publicaciones) => {
                this.publicaciones = publicaciones.filter(publicacion => publicacion !== null && publicacion.estado === 'activa') as IPublicacion[];
            })
            .catch((error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar recuperar las publicaciones');
            })
            .finally(async () => {
                this.spinnerSrv.ocultar();
            });
    }

    cumpleFiltro(publicacion: IPublicacion): boolean {
        if (this.estadoSolicitud === "Todas") {
            return true; // Si se selecciona "Todas", mostrar todas las publicaciones activas
        }

        const registroCorrespondiente = this.registros?.find(registro => registro.idPublicacion === publicacion.id);

        if (!registroCorrespondiente) { return false; }

        return registroCorrespondiente.estado === this.estadoSolicitud;
    }

    obtenerEstadoPostulacion(idPublicacion: string): EEstadoRegistro | undefined {
        const registro = this.registros?.find(reg => reg.idPublicacion === idPublicacion);
        return registro ? registro.estado : undefined;
    }

}
