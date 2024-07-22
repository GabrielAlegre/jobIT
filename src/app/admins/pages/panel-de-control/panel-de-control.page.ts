import { Component, inject } from '@angular/core';
import { ETipoDeUsuario } from '../../../core/enums/tipo-de-usuario.enum';
import { IAdmin } from '../../../core/interfaces/admin.interface';
import { ICardsDeInicio } from '../../../core/interfaces/cards-de-inicio.interface';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { IEstadistica } from '../../../core/interfaces/estadistica.interface';
import { IPago } from '../../../core/interfaces/pago.interface';
import { EstadisticasService } from '../../../core/services/estadisticas.service';
import { PagosService } from '../../../core/services/pagos.service';
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
    cards: ICardsDeInicio[] = [];
    visitasPagina: number = 3432;
    publicacionesActivas: number = 3234;
    publicacionesPausadas: number = 3242;
    dineroGanado?: number;
    usuarios: (any)[] = []; // Actualizado para reflejar los tipos casteados
    ETipoDeUsuario = ETipoDeUsuario;
    estadistica!: IEstadistica;

    async ngOnInit(): Promise<void> {
        await this.traerUsers();
        await this.obtenerDineroGanado();
        await this.estadisticasSrv.getUno().then((estadistica) => {
            this.estadistica = estadistica;
            this.visitasPagina = estadistica.visitas;
        });

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


}
