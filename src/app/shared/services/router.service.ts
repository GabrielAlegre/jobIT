import { inject, Injectable } from '@angular/core';
import { NavigationBehaviorOptions, NavigationExtras, Router } from '@angular/router';
import { TRutaValida } from '../types/ruta-valida.type';
import { SpinnerService } from './spinner.service';

@Injectable({
    providedIn: 'root'
})
export class RouterService extends Router {

    constructor() { super(); }

    private readonly spinnerSrv = inject(SpinnerService);

    override navigate(commands: [TRutaValida, ...string[]], extras?: NavigationExtras)
        : Promise<boolean> {
        this.spinnerSrv.mostrar();
        return super
            .navigate(commands, extras)
            .then((result) => {
                // ...
                return result;
            })
            .catch((error: Error) => {
                console.error('Error navigate', error);
                throw error;
            });
    }

    override navigateByUrl(url: TRutaValida, extras?: NavigationBehaviorOptions)
        : Promise<boolean> {
        this.spinnerSrv.mostrar();
        return super
            .navigateByUrl(url, extras)
            .then((result) => {
                // ...
                return result;
            })
            .catch((error: Error) => {
                console.error('Error navigate', error);
                throw error;
            });
    }

}
