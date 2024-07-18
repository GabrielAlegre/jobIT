import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { IPack } from '../../../core/interfaces/pack.interface';
import { PacksService } from '../../../core/services/packs.service';
import { PagosService } from '../../../core/services/pagos.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'empresas-listar-packs',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule, RutaValidaPipe],
    templateUrl: './listar-packs.page.html',
    styleUrl: './listar-packs.page.scss'
})
export default class ListarPacksPage {

    private readonly packsSrv = inject(PacksService);
    private readonly toastSrv = inject(ToastService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly pagosSrv = inject(PagosService);
    packs?: IPack[];
    empresa?: IEmpresa;

    async ngOnInit(): Promise<void> {
        await this.getUsuarioLogeado();
        this.packs = this.empresa?.packs;
    }

    async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }

        this.empresa = usuario as IEmpresa;

        if (!this.empresa?.packs) {
            this.toastSrv.warning('Usted aun no tiene packs');
            await this.routerSrv.navigateByUrl('mis-packs/comprar-pack');
            return;
        }
    }
}
