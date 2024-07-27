import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { EEstadoPago } from '../../../core/enums/estado-pago.enum';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IEstadistica } from '../../../core/interfaces/estadistica.interface';
import { IPago } from '../../../core/interfaces/pago.interface';
import { ISuscripcion } from '../../../core/interfaces/suscripcion.interface';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { PagosService } from '../../../core/services/pagos.service';
import { SuscripcionesService } from '../../../core/services/suscripciones.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'empleados-comprar-suscripcion',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './comprar-suscripcion.page.html',
    styleUrls: ['./comprar-suscripcion.page.scss']
})
export default class ComprarSuscripcionPage implements OnInit {

    private readonly spinnerSrv = inject(SpinnerService);
    private readonly toastSrv = inject(ToastService);
    private readonly suscripcionSrv = inject(SuscripcionesService);
    private readonly authSrv = inject(AuthService);
    private readonly routerSrv = inject(RouterService);
    private readonly formBuilder: FormBuilder = inject(FormBuilder);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly pagosSrv = inject(PagosService);
    private readonly estadisticasSrv = inject(EstadisticasService);
    estadistica!: IEstadistica;
    suscripcion?: ISuscripcion;
    valida: boolean = false;
    empleado?: IEmpleado;
    formulario: FormGroup;
    fechaFin?: Date;

    constructor() {
        this.formulario = this.formBuilder.group({
            tarjetaSeleccionada: [null, Validators.required]
        });
    }

    async ngOnInit(): Promise<void> {
        await this.getUsuarioLogeado();

        this.suscripcion = await this.suscripcionSrv.getPorId(environment.ids.suscripcion)
            .catch((error: Error) => {
                this.toastSrv.error(error.message);
                console.error(error);
                return undefined;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });

        const fechaActual = new Date();

        if (this.empleado?.suscripcion?.fin) {
            const fin = this.empleado.suscripcion.fin;
            if (fin instanceof Timestamp) {
                this.fechaFin = fin.toDate();
            } else if (typeof fin === 'string' || typeof fin === 'number') {
                this.fechaFin = new Date(fin);
            } else {
                console.error("Formato de fecha no reconocido:", fin);
                this.toastSrv.error('La fecha de fin de la suscripción es inválida.');
                this.valida = false;
                return;
            }

            console.log("Fecha actual:", fechaActual);
            console.log("Fecha fin:", this.fechaFin);

            if (isNaN(this.fechaFin.getTime())) {
                console.error("Fecha fin inválida:", this.empleado.suscripcion.fin);
                this.toastSrv.error('La fecha de fin de la suscripción es inválida.');
                this.valida = false;
            } else {
                this.valida = this.fechaFin > fechaActual;
            }
        } else {
            this.valida = false;
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

        this.empleado = usuario as IEmpleado;

        if (!this.empleado?.tarjetas || this.empleado.tarjetas?.length == 0) {
            this.toastSrv.warning('Usted aun no tiene tarjetas cargadas');
            await this.routerSrv.navigateByUrl('mis-tarjetas/agregar-tarjeta');
            return;
        }
    }

    async comprarSuscripcion(): Promise<void> {
        if (!this.formulario.valid) {
            this.toastSrv.error('Seleccione una tarjeta para proceder con la compra');
            return;
        }

        try {
            if (this.empleado && this.suscripcion) {
                const inicio = new Date();
                const fin = new Date();
                fin.setMonth(inicio.getMonth() + 1);

                this.suscripcion.inicio = inicio;
                this.suscripcion.fin = fin;

                this.empleado.suscripcion = this.suscripcion;

                await this.usuarioSrv.actualizar(this.empleado).then(
                    async () => {
                        await this.guardarPago().then(async () => {
                            await this.obtenerEstadisticas().then(async () => {
                                const usuarioExistente = this.estadistica.usuarios.find(u => u.idUser === this.empleado?.id);
                                if (usuarioExistente) {
                                    usuarioExistente.dineroGastado = usuarioExistente.dineroGastado ? usuarioExistente.dineroGastado += Number(this.suscripcion?.precio) : Number(this.suscripcion?.precio);
                                    await this.estadisticasSrv.guardar(this.estadistica).then(async () => {
                                        this.toastSrv.success('Compra realizada con éxito');
                                    });
                                }
                            });
                        });;
                        this.valida = true;
                        this.routerSrv.navigateByUrl('/mis-suscripciones/listar-suscripciones');
                    }

                );

            }
        } catch (error) {
            console.error(error);
            this.toastSrv.error('Ha ocurrido un error al intentar guardar los cambios');
        } finally {
            this.spinnerSrv.ocultar();
        }
    }

    async guardarPago(): Promise<void> {
        if (!this.empleado || !this.suscripcion) {
            console.error('Falta información del empleado o suscripción');
            return;
        }

        const tarjetaSeleccionada = this.empleado.tarjetas?.[this.formulario.get('tarjetaSeleccionada')?.value];
        if (!tarjetaSeleccionada) {
            console.error('Tarjeta seleccionada no encontrada');
            return;
        }

        const pago: IPago = {
            idTarjeta: tarjetaSeleccionada.id?.toString(),
            idUsuario: this.empleado.id?.toString(),
            precio: Number(this.suscripcion.precio),
            numeroDeTarjeta: tarjetaSeleccionada.numero.toString(),
            estado: EEstadoPago.aceptado,
            fecha: new Date(),
            descripcion: this.suscripcion.nombre.toString(),
            fechaFin: this.suscripcion.fin
        };

        try {
            await this.pagosSrv.guardar(pago);
            console.log('Pago guardado correctamente');
        } catch (error) {
            console.error('Error al guardar el pago', error);
            this.toastSrv.error('Ha ocurrido un error al guardar el pago');
        }
    }
}
