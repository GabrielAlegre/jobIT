import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { ToastService } from '../../../shared/services/toast.service';
import { IPago } from '../../../core/interfaces/pago.interface';
import { PagosService } from '../../../core/services/pagos.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterService } from '../../../shared/services/router.service';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { Timestamp } from '@angular/fire/firestore';

@Component({
    selector: 'app-listar-pagos',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './listar-pagos.page.html',
    styleUrl: './listar-pagos.page.scss'
})
export default class ListarPagosPage implements OnInit {
    private readonly pagosSrv = inject(PagosService);
    private readonly authSrv = inject(AuthService);
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);

    empleado?: IEmpleado;
    pagos: IPago[] = [];

    async ngOnInit(): Promise<void> {
        await this.getUsuarioLogeado();
        if (this.empleado?.id) {
            try {
                const pagos = await this.pagosSrv.getPagosPorUsuario(this.empleado.id.toString());
                this.pagos = pagos.map(pago => ({
                    ...pago,
                    fecha: this.convertTimestampToDate(pago.fecha),
                    fechaFin: pago.fechaFin ? this.convertTimestampToDate(pago.fechaFin) : null
                }));
                console.log('Pagos del usuario:', this.pagos);
            } catch (error) {
                console.error('Error al obtener los pagos del usuario:', error);
            }
        }
    }

    convertTimestampToDate(timestamp: any): Date {
        if (timestamp instanceof Timestamp) {
            return timestamp.toDate();
        }
        return new Date(timestamp);
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
}
