import { Pipe, PipeTransform } from '@angular/core';
import { EEstadoRegistro } from '../enums/estado-registro.enum';

@Pipe({
    name: 'estadoRegistro',
    standalone: true
})
export class EstadoRegistroPipe implements PipeTransform {

    private readonly parse: { [key in EEstadoRegistro]: string } = {
        aceptadoEmpresa: 'Aceptado',
        aceptadoEmpleado: 'Has Aceptado',
        sinAplicar: 'Sin Aplicar',
        rechazadoEmpleado: 'Has rechazado',
        aplicado: 'Aplicado',
        visto: 'Visto'
    };

    transform(estado: EEstadoRegistro): string {
        return this.parse[estado] ?? 'ERROR';
    }

}
