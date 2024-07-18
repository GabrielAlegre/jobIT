import { Pipe, PipeTransform } from '@angular/core';
import { IPublicacion } from '../interfaces/publicacion.interface';

@Pipe({
    name: 'filtroTituloDescripcion',
    standalone: true
})
export class FiltroTituloDescripcionPipe implements PipeTransform {

    //README: ya viene toLowerCase el filtro : string
    transform(publicaciones: IPublicacion[], tituloODescripcion: string): IPublicacion[] {
        if (!publicaciones || !tituloODescripcion) { return publicaciones; }

        return publicaciones?.filter(publicacion => {
            return (String(publicacion?.title))?.toLowerCase()?.includes(tituloODescripcion)
                || (String(publicacion?.description))?.toLowerCase()?.includes(tituloODescripcion);
        });
    }

}
