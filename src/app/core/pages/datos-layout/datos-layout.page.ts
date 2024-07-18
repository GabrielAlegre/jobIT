import { Component, inject, OnInit } from '@angular/core';
import { MisDatosAdminPage } from '../../../admins/pages/mis-datos-admin/mis-datos-admin.page';
import { AuthService } from '../../../auth/services/auth.service';
import { MisDatosEmpleadoPage } from '../../../empleados/pages/mis-datos-empleado/mis-datos-empleado.page';
import { MisDatosEmpresaPage } from '../../../empresas/pages/mis-datos-empresa/mis-datos-empresa.page';
import { RouterService } from '../../../shared/services/router.service';
import { ToastService } from '../../../shared/services/toast.service';
import { IAdmin } from '../../interfaces/admin.interface';
import { IEmpleado } from '../../interfaces/empleado.interface';
import { IEmpresa } from '../../interfaces/empresa.interface';
import { TTodosLosUsuarios } from '../../types/todos-los-usuarios.type';

@Component({
    selector: 'app-datos-layout',
    standalone: true,
    imports: [MisDatosAdminPage, MisDatosEmpleadoPage, MisDatosEmpresaPage],
    templateUrl: './datos-layout.page.html',
    styleUrl: './datos-layout.page.scss'
})
export default class DatosLayoutPage implements OnInit {

    private readonly authSrv = inject(AuthService);
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);

    usuario?: TTodosLosUsuarios;
    usuarioAdmin!: IAdmin;
    usuarioEmpleado!: IEmpleado;
    usuarioEmpresa!: IEmpresa;

    async ngOnInit(): Promise<void> {
        this.usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!this.usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }

        this.usuarioAdmin = this.usuario as IAdmin;
        this.usuarioEmpleado = this.usuario as IEmpleado;
        this.usuarioEmpresa = this.usuario as IEmpresa;
    }
}
