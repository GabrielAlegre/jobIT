import { inject, Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ModalService {

    private readonly toastSrv = inject(ToastService);

    async confirm(msg: string, title: string = '¿Esta seguro?')
        : Promise<true | undefined> {
        const { value: resp, } = await Swal.fire({
            title: title,
            text: msg,
            icon: 'warning',
            showCancelButton: true,
            customClass: 'swal-custom',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            cancelButtonText: 'Cancelar',
        });

        if (!resp) { this.toastSrv.info('¡ Cancelado !'); }

        return resp;
    }
}
