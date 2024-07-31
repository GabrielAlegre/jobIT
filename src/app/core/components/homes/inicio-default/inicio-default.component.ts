import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RutaValidaPipe } from '../../../../shared/pipes/ruta-valida.pipe';

@Component({
    selector: 'app-inicio-default',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe, ReactiveFormsModule],
    templateUrl: './inicio-default.component.html',
    styleUrl: './inicio-default.component.scss'
})
export class InicioDefaultComponent {

}
