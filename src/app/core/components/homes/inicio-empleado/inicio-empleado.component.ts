import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RutaValidaPipe } from '../../../../shared/pipes/ruta-valida.pipe';

@Component({
    selector: 'empleado-inicio-empleado',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe, ReactiveFormsModule],
    templateUrl: './inicio-empleado.component.html',
    styleUrl: './inicio-empleado.component.scss'
})
export class InicioEmpleadoComponent {

}
