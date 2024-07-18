import { Pipe, PipeTransform } from '@angular/core';
import { TTituloValido } from '../types/titulo-valido.type';

@Pipe({
    name: 'tituloValido',
    standalone: true
})
export class TituloValidoPipe implements PipeTransform {

    transform(value: TTituloValido): TTituloValido {
        return value;
    }

}
