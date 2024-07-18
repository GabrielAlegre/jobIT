import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RouterService } from '../../shared/services/router.service';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../services/auth.service';

export const noLogeadoGuard: CanActivateFn = async (route, state) => {

    const authSrv = inject(AuthService);
    const routerSrv = inject(RouterService);
    const toastSrv = inject(ToastService);

    const usuarioAuth = await authSrv.usuarioLogeadoAuth();

    if (!usuarioAuth) { return true; }

    toastSrv.warning('Usted ya está logeado');
    await routerSrv.navigateByUrl('/');
    return false;
};
