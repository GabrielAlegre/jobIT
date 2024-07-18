import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RouterService } from '../../shared/services/router.service';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../services/auth.service';

export const logeadoGuard: CanActivateFn = async (route, state) => {

    const authSrv = inject(AuthService);
    const routerSrv = inject(RouterService);
    const toastSrv = inject(ToastService);

    const usuarioAuth = await authSrv.usuarioLogeadoAuth();

    if (!!!usuarioAuth) {
        toastSrv.warning('Usted no está logeado');
        await routerSrv.navigateByUrl('/auth/iniciar-sesion');
        return false;
    }

    return true;
};
