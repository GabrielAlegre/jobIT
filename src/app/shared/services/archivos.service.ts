import { inject, Injectable } from '@angular/core';
import { EExtensionIArchivoValido } from '../enum/extension-archivo-valido.enum';
import { EExtensionImagenValida } from '../enum/extension-imagen-valida.enum';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ArchivosService {

    private readonly toastSrv = inject(ToastService);

    private validar(file: File, extensionesValidas: string[]): boolean {
        const [, extension] = file.type.split('/');

        if (!extensionesValidas.includes(extension)) {
            this.toastSrv.error(`Formato inválido. Los válidos son: ${extensionesValidas}`);
            return false;
        }
        return true;
    }

    get imagenesValidas(): string {
        return `.${Object.values(EExtensionImagenValida).join(',.')}`;
    }
    get archivosValidos(): string {
        return `.${Object.values(EExtensionIArchivoValido).join(',.')}`;
    }

    validarImagen(file: File): boolean {
        return this.validar(file, Object.values(EExtensionImagenValida));
    }

    validarArchivo(file: File): boolean {
        return this.validar(file, Object.values(EExtensionIArchivoValido));
    }
}
