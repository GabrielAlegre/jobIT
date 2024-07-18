import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ETipoDeUsuario } from '../../core/enums/tipo-de-usuario.enum';
import { RouterService } from '../../shared/services/router.service';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../services/auth.service';

export const empresaAdminGuard: CanActivateFn = async (route, state) => {

    const authSrv = inject(AuthService);
    const routerSrv = inject(RouterService);
    const toastSrv = inject(ToastService);

    const usuario = await authSrv.usuarioLogeadoBBDD();

    if (usuario && (usuario?.tipo === ETipoDeUsuario.empresa || usuario?.tipo === ETipoDeUsuario.admin)) {
        return true;
    }

    toastSrv.error('Usted no es empresa ni administrador');
    await routerSrv.navigateByUrl('/');
    return false;
};
