import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { filter } from 'rxjs';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { RouterService } from './shared/services/router.service';
import { SpinnerService } from './shared/services/spinner.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, ToastModule, SpinnerComponent],
    providers: [],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    private readonly spinnerSrv = inject(SpinnerService);
    private readonly routerSrv = inject(RouterService);
    mostrarSpinner: boolean = false;

    async ngOnInit(): Promise<void> {
        this.spinnerSrv.mostrar();

        this.routerSrv.events.pipe(
            filter(event => event instanceof NavigationEnd))
            .subscribe((event) => {
                this.spinnerSrv.ocultar();
            });

        await this.spinnerSrv.estado().subscribe((mostrar) => {
            this.mostrarSpinner = mostrar;
        });

    }
}
