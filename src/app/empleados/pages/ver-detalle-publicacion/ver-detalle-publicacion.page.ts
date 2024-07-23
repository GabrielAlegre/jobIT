import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { EEstadoPublicacion } from '../../../core/enums/estado-publicacion.enum';
import { EEstadoRegistro } from '../../../core/enums/estado-registro.enum';
import { ETipoDeUsuario } from '../../../core/enums/tipo-de-usuario.enum';
import { IAreaDeTrabajo } from '../../../core/interfaces/area-de-trabajo.interface';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IEstadistica } from '../../../core/interfaces/estadistica.interface';
import { IPublicacion } from '../../../core/interfaces/publicacion.interface';
import { IRegistro } from '../../../core/interfaces/registro.interface';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { NotificacionregistroService } from '../../../core/services/notificacionregistro.service';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { RegistroService } from '../../../core/services/registro.service';
import { TTodosLosUsuarios } from '../../../core/types/todos-los-usuarios.type';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { ModalService } from '../../../shared/services/modal.service';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TEstructuraFormValida } from '../../../shared/types/estructura-form-valida.type';

@Component({
    selector: 'empleados-ver-detalle-publicacion',
    standalone: true,
    imports: [CommonModule, RutaValidaPipe, RouterModule],
    providers: [TitleCasePipe],
    templateUrl: './ver-detalle-publicacion.page.html',
    styleUrl: './ver-detalle-publicacion.page.scss'
})
export default class VerDetallePublicacionPage {

    private readonly toastSrv = inject(ToastService);
    private readonly publicacionSrv = inject(PublicacionesService);
    private readonly registroSrv = inject(RegistroService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly modalSrv = inject(ModalService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly notificacionregistroSrv = inject(NotificacionregistroService);
    private readonly estadisticasSrv = inject(EstadisticasService);
    publicacion?: IPublicacion;
    usuario?: TTodosLosUsuarios;
    registro?: IRegistro | null;
    tipoDeUsuario = ETipoDeUsuario;
    estadoRegistro = EEstadoRegistro;
    nombreAreaDeTrabajo?: TEstructuraFormValida<string>;
    estadistica!: IEstadistica;
    @Input() id?: string;

    async ngOnInit(): Promise<void> {
        if (!this.id) { return; }
        await this.getPublicacion();
        await this.getUsuarioLogeado();
        await this.getRegistro();
        if (this.registro?.estado === EEstadoRegistro.aceptadoEmpresa) {
            await this.notificacionregistroSrv.marcarNotificacionComoVista(this.id, 'empleado');
        }
    }


    async obtenerEstadisticas() {
        await this.estadisticasSrv.getUno().then((estadistica) => {
            this.estadistica = estadistica;
            console.log(this.estadistica);
        }).catch(async (error) => {
            console.log(error);
        });
    }

    async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }
        this.usuario = usuario;
    }

    async getPublicacion(): Promise<void> {
        this.publicacion = await this.publicacionSrv.getPorId(this.id!)
            .then(publicacion => {
                if (!publicacion?.idEmpresa) {
                    throw new Error('No se pudo recuperar dentro del then...');
                }
                const area = publicacion.areaDeTrabajo as IAreaDeTrabajo;
                this.nombreAreaDeTrabajo = area.nombre;
                return publicacion;
            })
            .catch(async (error: Error) => {
                this.toastSrv.error('No se pudo recuperar la información del publicacion');
                console.error(error);
                await this.routerSrv.navigateByUrl('/publicaciones/ver-todas');
                return undefined;
            });
    }

    async getRegistro(): Promise<void> {
        const registro = await this.registroSrv.getUno([
            { campo: 'idEmpleado', opcion: '==', valor: this.usuario?.id },
            { campo: 'idPublicacion', opcion: '==', valor: this.publicacion?.id },
        ]);

        if (!registro) {
            this.registro = null;
            return;
        }
        this.registro = registro;
    }

    private verificarDatosFaltantes(empleado: IEmpleado): string[] {
        const faltantes = [];

        if (!empleado.nombre) {
            faltantes.push('informacion basica');
        }
        if (!empleado.pathFoto) {
            faltantes.push('foto');
        }
        if (!empleado.pathCV) {
            faltantes.push('CV');
        }

        return faltantes;
    }

    private mostrarMensajeFaltantes(faltantes: string[]): void {
        let mensaje = 'Debe ';
        if (faltantes.length === 1) {
            mensaje += `cargar ${faltantes[0]}`;
        } else if (faltantes.length === 2) {
            mensaje += `cargar ${faltantes[0]} y ${faltantes[1]}`;
        } else {
            mensaje += `cargar ${faltantes.slice(0, -1).join(', ')} y ${faltantes.slice(-1)[0]}`;
        }
        mensaje += ' antes de postularse.';
        this.toastSrv.error(mensaje);

        // Redirecciona según los datos que falten
        if (faltantes.includes('informacion basica')) {
            this.routerSrv.navigateByUrl('/mi-informacion');
        } else if (faltantes.includes('CV')) {
            this.routerSrv.navigateByUrl('/mi-cv');
        } else {
            this.routerSrv.navigateByUrl('/mi-foto');
        }
    }

    async postularsePublicacion(): Promise<void> {

        if (this.usuario?.tipo !== this.tipoDeUsuario.empleado) {
            this.toastSrv.error('Solo los empleados pueden postularse.');
            return;
        }

        const faltantes = this.verificarDatosFaltantes(this.usuario as IEmpleado);
        if (faltantes.length > 0) {
            this.mostrarMensajeFaltantes(faltantes);
            return;
        }

        const registro: IRegistro = {
            estado: EEstadoRegistro.aplicado,
            idEmpleado: String(this.usuario?.id),
            idEmpresa: String(this.publicacion?.idEmpresa),
            idPublicacion: String(this.publicacion?.id),
            fecha: new Date(),
            avisadoEmpresa: false,
            avisadoEmpleado: true
        };

        this.spinnerSrv.mostrar();
        await this.registroSrv.guardar(registro)
            .then(async () => {
                this.toastSrv.success('Te postulaste exitosamente');
                await this.obtenerEstadisticas().then(async () => {
                    const usuarioExistente = this.estadistica.usuarios.find(u => u.idUser === this.usuario?.id);
                    if (usuarioExistente) {
                        usuarioExistente.cantidadDePostulaciones = usuarioExistente.cantidadDePostulaciones ? usuarioExistente.cantidadDePostulaciones += 1 : 1;
                        await this.estadisticasSrv.guardar(this.estadistica).then(async () => {
                            await this.routerSrv.navigateByUrl('/publicaciones/ver-todas');
                        });
                    }
                });
            })
            .catch(async (error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al postularte');
                await this.routerSrv.navigateByUrl('/publicaciones/ver-todas');
            })
            .finally(async () => {
                this.spinnerSrv.ocultar();
            });
    }

    async aceptarRechazarEmpresa(estado: EEstadoRegistro): Promise<void> {

        if (!this.registro) { return; }
        this.registro.estado = estado;

        await this.registroSrv.guardar(this.registro)
            .then(async () => {
                this.toastSrv.success('Se guardo tu respuesta');
                if (estado === EEstadoRegistro.aceptadoEmpleado && this.publicacion != undefined) {
                    this.publicacion.estado = EEstadoPublicacion.finalizada;
                    await this.publicacionSrv.guardar(this.publicacion)
                        .then(async () => {
                            this.toastSrv.success(" Felicitaciones, has conseguido el empleo!");
                        })
                        .catch((error: Error) => {
                            console.error(error);
                            this.toastSrv.error('Ha ocurrido un error al finalizar la publicacion');
                        });

                }
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al postularte');
            })
            .finally(async () => {
                await this.routerSrv.navigateByUrl('/publicaciones/ver-todas');
                this.spinnerSrv.ocultar();
            });
    }

    async finalizarPublicacion(): Promise<void> {
        if (!this.publicacion?.id) { return; }
        if (!(await this.modalSrv.confirm('¿Realmente quiere eliminar?'))) { return; }
        this.publicacionSrv.eliminarPorId(String(this.publicacion.id))
            .then(async () => {
                this.toastSrv.success('Se eliminó la publicacion exitosamente!');
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al eliminar la publicacion');
            })
            .finally(async () => {
                await this.routerSrv.navigateByUrl('/publicaciones/ver-todas');
                this.spinnerSrv.ocultar();
            });
    }

}
