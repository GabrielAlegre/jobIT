import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RutaValidaPipe } from '../../../../shared/pipes/ruta-valida.pipe';

@Component({
    selector: 'empresa-inicio-empresa',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe, ReactiveFormsModule],
    templateUrl: './inicio-empresa.component.html',
    styleUrl: './inicio-empresa.component.scss'
})
export class InicioEmpresaComponent {

}
