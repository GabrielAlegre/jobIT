import { Component, Input, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';

@Component({
    selector: 'empresas-ver-informacion-empresa',
    standalone: true,
    imports: [],
    templateUrl: './ver-informacion-empresa.page.html',
    styleUrl: './ver-informacion-empresa.page.scss'
})
export default class VerInformacionEmpresaPage {
    //TODO: traer todo la info de la empresa
    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly authSrv = inject(AuthService);
    private readonly validadorSrv = inject(ValidadorService);
    @Input() id?: string;
    usuario!: IEmpleado;
    empresaQuePublico?: IEmpresa;

    async ngOnInit(): Promise<void> {

        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }

        this.usuario = usuario as IEmpleado;

        if (!this.id) { return; }

        this.empresaQuePublico = await this.usuarioSrv.getPorId(this.id) as IEmpresa;

        if (!this.empresaQuePublico.nombre) {
            this.toastSrv.error('No se pudo recuperar los datos de la empresa');
            await this.routerSrv.navigateByUrl('/publicaciones/ver-todas');
            return;
        }
    }
}
