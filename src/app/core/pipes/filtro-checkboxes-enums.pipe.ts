import { Pipe, PipeTransform } from '@angular/core';
import { IPublicacion } from '../interfaces/publicacion.interface';
import { TCheckboxesEnums } from '../types/checkboxes-enums.type';

@Pipe({
    name: 'filtroCheckboxesEnums',
    standalone: true
})
export class FiltroCheckboxesEnums implements PipeTransform {

    transform(
        publicaciones: IPublicacion[],
        campo: keyof IPublicacion,
        enums?: TCheckboxesEnums<any>
    ): IPublicacion[] {

        if (!publicaciones || !enums) { return publicaciones; }

        const arrayAreas = Object.entries(enums)
            .filter(([key, value]) => value)
            .map(([key, value]) => key);

        return publicaciones?.filter(publicacion => {
            return arrayAreas.includes(String(publicacion[campo]));
        });
    }

}
