import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterService } from '../../../shared/services/router.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TTituloValido } from '../../../shared/types/titulo-valido.type';
import { ETipoDeUsuario } from '../../enums/tipo-de-usuario.enum';
import { IEstadistica } from '../../interfaces/estadistica.interface';
import { EstadisticasService } from '../../services/estadisticas.service';
import { NotificacionService } from '../../services/notificacion.service';
import { UsuariosService } from '../../services/usuarios.service';
import { TTodosLosUsuarios } from '../../types/todos-los-usuarios.type';

@Component({
    selector: 'core-menu',
    standalone: true,
    imports: [MenubarModule, CommonModule],
    templateUrl: './menu.component.html',
    styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

    private readonly authSrv = inject(AuthService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly routerSrv = inject(RouterService);
    private readonly notificacionSrv = inject(NotificacionService);
    private readonly estadisticasSrv = inject(EstadisticasService);

    menu: MenuItem[] | undefined;
    logeado: boolean | undefined = undefined;
    usuario?: TTodosLosUsuarios;
    fotoDefault: string = "./assets/images/sin_foto_de_perfil.png";
    cantidadPostulantesActivos: number = 0;
    cantidadAceptacionesActivas: number = 0;
    notificacionSubscription?: Subscription;
    aceptacionSubscription?: Subscription;
    estadistica!: IEstadistica;

    async ngOnInit(): Promise<void> {
        this.actualizarMenu();

        this.authSrv.usuarioLogeadoAuthObservable()
            .subscribe(async (usuarioAuth) => {

                if (!usuarioAuth) {
                    this.logeado = false;
                    this.actualizarMenu();
                    this.usuario = undefined;
                    return;
                }

                this.usuario = await this.usuariosSrv.getPorId(usuarioAuth.uid);
                this.logeado = true;

                this.notificacionSubscription = this.notificacionSrv.notificaciones$.subscribe(cantidad => {
                    this.cantidadPostulantesActivos = cantidad;
                    this.actualizarMenu();
                });

                if (this.siEsEmpleado) {
                    this.aceptacionSubscription = this.notificacionSrv.aceptaciones$.subscribe(cantidad => {
                        this.cantidadAceptacionesActivas = cantidad;
                        this.actualizarMenu();
                    });

                    // Actualizar contador de aceptaciones para el empleado
                    await this.notificacionSrv.actualizarContadorAceptaciones();
                }

                this.actualizarMenu();
            });
    }

    ngOnDestroy(): void {
        this.notificacionSubscription?.unsubscribe();
        this.aceptacionSubscription?.unsubscribe();
    }

    private get siEsAdmin(): boolean {
        return this.usuario?.tipo == ETipoDeUsuario.admin;
    }

    private get siEsEmpleado(): boolean {
        return this.usuario?.tipo == ETipoDeUsuario.empleado;
    }

    private get siEsEmpresa(): boolean {
        return this.usuario?.tipo == ETipoDeUsuario.empresa;
    }

    private async cerrarSesion(): Promise<void> {
        await this.obtenerEstadisticas().then(async () => {
            // Buscar si el usuario ya está en el array
            const usuarioExistente = this.estadistica.usuarios.find(u => u.idUser === this.usuario?.id);

            if (usuarioExistente) {
                usuarioExistente.fechaFin = new Date();
                await this.estadisticasSrv.guardar(this.estadistica);
            }
        });
        return this.authSrv.cerrarSession()
            .then(async () => {
                this.usuario = undefined;
                this.actualizarMenu();
                this.toastSrv.info('Se cerró sesión');
                await this.routerSrv.navigateByUrl('/');
            })
            .catch((error: Error) => {
                this.toastSrv.error(error.message);
            });
    }

    async obtenerEstadisticas() {
        await this.estadisticasSrv.getUno().then((estadistica) => {
            this.estadistica = estadistica;
            console.log(this.estadistica);
        }).catch(async (error) => {
            console.log(error);
        });
    }

    private get misPublicacionesLabel(): TTituloValido {
        return this.cantidadPostulantesActivos > 0
            ? `Mis publicaciones <span class="badge bg-danger ms-2 rounded-pill">${this.cantidadPostulantesActivos}</span>` as TTituloValido
            : 'Mis publicaciones' as TTituloValido;
    }

    private get publicacionesLabel(): TTituloValido {
        return this.cantidadAceptacionesActivas > 0
            ? `Publicaciones <span class="badge bg-danger ms-2 rounded-pill">${this.cantidadAceptacionesActivas}</span>` as TTituloValido
            : 'Publicaciones' as TTituloValido;
    }

    actualizarMenu(): void {
        this.menu = [
            {
                label: 'Inicio',
                routerLink: '/inicio'
            },
            {
                label: 'Mis Datos',
                visible: this.logeado == true,
                items: [
                    {
                        label: 'Mi Información',
                        routerLink: '/mi-informacion',
                        visible: this.siEsAdmin || this.siEsEmpresa
                    },
                    {
                        label: 'Mi Información',
                        visible: this.siEsEmpleado,
                        items: [
                            {
                                label: 'Básica',
                                routerLink: '/mi-informacion',
                            },
                            {
                                label: 'Laboral',
                                items: [
                                    {
                                        label: 'Listar trabajos',
                                        routerLink: '/mi-informacion/listar/trabajo',
                                    },
                                    {
                                        label: 'Agregar trabajo',
                                        routerLink: '/mi-informacion/agregar/trabajo',
                                    }
                                ]
                            },
                            {
                                label: 'Académica',
                                items: [
                                    {
                                        label: 'Listar estudios',
                                        routerLink: '/mi-informacion/listar/estudio',
                                    },
                                    {
                                        label: 'Agregar estudio',
                                        routerLink: '/mi-informacion/agregar/estudio',
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        label: 'Mi Foto',
                        routerLink: '/mi-foto',
                    },
                    {
                        label: 'Mi CV',
                        routerLink: '/mi-cv',
                        visible: this.siEsEmpleado
                    },
                    {
                        label: 'Mis Pagos',
                        routerLink: 'mis-pagos',
                        visible: this.siEsEmpleado || this.siEsEmpresa
                    },
                    {
                        label: 'Tarjetas',
                        items: [
                            {
                                label: 'Listar tarjetas',
                                routerLink: 'mis-tarjetas/listar-tarjetas'
                            },
                            {
                                label: 'Agregar tarjeta',
                                routerLink: 'mis-tarjetas/agregar-tarjeta'
                            }
                        ],
                        visible: this.siEsEmpleado || this.siEsEmpresa
                    }
                ]
            },
            {
                label: 'Suscripción',
                visible: this.siEsEmpleado,
                items: [
                    {
                        label: 'Comprar subscripción',
                        routerLink: '/mis-suscripciones/comprar-suscripcion'
                    },
                    {
                        label: 'Mis suscripciones',
                        routerLink: '/mis-suscripciones/listar-suscripciones'
                    }
                ]
            },
            {
                label: 'Packs',
                visible: this.siEsEmpresa,
                items: [
                    {
                        label: 'Comprar pack',
                        routerLink: '/mis-packs/comprar-pack'
                    },
                    {
                        label: 'Mis packs',
                        routerLink: '/mis-packs/listar-packs'
                    }
                ]
            },
            {
                label: this.misPublicacionesLabel,
                escape: false,
                items: [
                    {
                        label: 'Agregar publicación',
                        routerLink: 'mis-publicaciones/agregar-publicacion'
                    },
                    {
                        label: 'Listar publicaciones',
                        routerLink: 'mis-publicaciones/listar-publicaciones'
                    },
                ],
                visible: this.siEsEmpresa
            },
            {
                label: 'Mis Ingresos',
                visible: this.siEsAdmin,
                items: [
                    {
                        label: 'Suscripción',
                        routerLink: 'mis-ingresos/suscripcion'
                    },
                    {
                        label: 'Packs',
                        items: [
                            {
                                label: 'Listar packs',
                                routerLink: 'mis-ingresos/listar-packs'
                            },
                            {
                                label: 'Agregar pack',
                                routerLink: 'mis-ingresos/agregar-pack'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Datos dinámicos',
                visible: this.siEsAdmin,
                items: [
                    {
                        label: 'Area de trabajo',
                        items: [
                            {
                                label: 'Listar areas de trabajo',
                                routerLink: 'datos-dinamicos/listar-areas-de-trabajo'
                            },
                            {
                                label: 'Agregar area de trabajo',
                                routerLink: 'datos-dinamicos/agregar-area-de-trabajo'
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Panel de control',
                visible: this.siEsAdmin,
                escape: false,
                routerLink: '/panel-de-control',
            },
            {
                label: this.publicacionesLabel,
                escape: false,
                routerLink: '/publicaciones/ver-todas',
                visible: this.logeado
            },
            {
                label: 'Sesión',
                items: [
                    {
                        label: 'Iniciar Sesión',
                        routerLink: '/auth/iniciar-sesion',
                        visible: this.logeado == false
                    },
                    {
                        label: 'Registrarse',
                        routerLink: '/auth/registrarse',
                        visible: this.logeado == false
                    },
                    {
                        label: 'Recuperar cuenta',
                        routerLink: '/auth/recuperar-cuenta',
                        visible: this.logeado == false
                    },
                    {
                        label: 'Cerrar Sesión',
                        visible: this.logeado == true,
                        command: async () => { await this.cerrarSesion(); },
                    }
                ]
            }
        ];
    }

}
