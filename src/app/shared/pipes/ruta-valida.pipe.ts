import { Pipe, PipeTransform } from '@angular/core';
import { TRutaValida } from '../types/ruta-valida.type';

@Pipe({
    name: 'rutaValida',
    standalone: true
})
export class RutaValidaPipe implements PipeTransform {

    transform(value: TRutaValida): TRutaValida {
        return value;
    }

}
