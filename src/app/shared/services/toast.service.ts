import { Injectable } from '@angular/core';
import Notify from 'simple-notify';

@Injectable({ providedIn: 'root' })
export class ToastService {

    private readonly mensajePorDefecto = "No podemos mostrar este mensaje.";

    success(mensaje: string, titulo: string = 'Éxito') {
        this.notify(mensaje || this.mensajePorDefecto, titulo, 'success');
    }

    error(mensaje: string, titulo: string = 'Error') {
        this.notify(mensaje || this.mensajePorDefecto, titulo, 'error');
    }

    warning(mensaje: string, titulo: string = 'Advertencia') {
        this.notify(mensaje || this.mensajePorDefecto, titulo, 'warning');
    }

    info(mensaje: string, titulo: string = 'Información') {
        this.notify(mensaje || this.mensajePorDefecto, titulo, 'info');
    }

    private notify(text: string, title: string, status: "error" | "warning" | "success" | "info") {
        new Notify({
            status,
            title,
            text,
            effect: 'fade',
            speed: 300,
            customClass: undefined,
            customIcon: undefined,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            // gap: 20,
            // distance: 20,
            type: 'outline',
            position: 'right top'
        });
    }
}
