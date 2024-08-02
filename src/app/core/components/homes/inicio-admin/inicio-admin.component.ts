import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RutaValidaPipe } from '../../../../shared/pipes/ruta-valida.pipe';

@Component({
    selector: 'admin-inicio-admin',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe, ReactiveFormsModule],
    templateUrl: './inicio-admin.component.html',
    styleUrl: './inicio-admin.component.scss'
})
export class InicioAdminComponent {

}
