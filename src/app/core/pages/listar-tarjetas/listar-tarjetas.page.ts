import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { ModalService } from '../../../shared/services/modal.service';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ETipoDeUsuario } from '../../enums/tipo-de-usuario.enum';
import { IEmpleado } from '../../interfaces/empleado.interface';
import { ITarjeta } from '../../interfaces/tarjeta.interface';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
    selector: 'app-listar-tarjetas',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe],
    templateUrl: './listar-tarjetas.page.html',
    styleUrl: './listar-tarjetas.page.scss'
})
export default class ListarTarjetasPage implements OnInit {

    tarjetas?: ITarjeta[];
    private readonly toastSrv = inject(ToastService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly modalSrv = inject(ModalService);
    empleado?: IEmpleado;

    async ngOnInit(): Promise<void> {
        await this.getUsuarioLogeado();
    }

    async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario || usuario.tipo == ETipoDeUsuario.admin) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }

        this.empleado = usuario as IEmpleado;

        this.tarjetas = this.empleado.tarjetas ?? [];
    }

    async eliminarTarjeta(tarjeta: ITarjeta): Promise<void> {

        if (!this.empleado) { return; }

        if (!(await this.modalSrv.confirm('¿Realmente quiere eliminar?'))) { return; }

        const tarjetas = this.empleado.tarjetas?.filter(({ id }) => id != tarjeta.id);
        this.empleado.tarjetas = tarjetas;

        this.usuarioSrv.actualizar(this.empleado)
            .then(async () => {
                await this.getUsuarioLogeado();
                this.toastSrv.info('Se eliminó la tarjeta');
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al eliminar la tarjeta');
            })
            .finally(async () => {
                this.spinnerSrv.ocultar();
                await this.routerSrv.navigateByUrl('/mis-tarjetas/listar-tarjetas');
            });
    }
}
