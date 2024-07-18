import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from '../components/menu/menu.component';

@Component({
    selector: 'core-layout',
    standalone: true,
    imports: [RouterModule, MenuComponent],
    templateUrl: './layout.page.html',
    styleUrl: './layout.page.scss'
})
export default class LayoutPage {

}
