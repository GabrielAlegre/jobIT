import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RutaValidaPipe } from '../../pipes/ruta-valida.pipe';

@Component({
    selector: 'shared-error404',
    standalone: true,
    imports: [RouterModule, RutaValidaPipe],
    templateUrl: './error404.page.html',
    styleUrl: './error404.page.scss'
})
export default class Error404Page {

}
