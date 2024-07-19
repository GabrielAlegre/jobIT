import { Component, inject } from '@angular/core';
import { ICardsDeInicio } from '../../../core/interfaces/cards-de-inicio.interface';
import { CardsDeInicioService } from '../../../core/services/cards-de-inicio.service';
import { SpinnerService } from '../../../shared/services/spinner.service';

@Component({
    selector: 'admins-panel-de-control',
    standalone: true,
    imports: [],
    templateUrl: './panel-de-control.page.html',
    styleUrl: './panel-de-control.page.scss'
})
export default class PanelDeControlPage {
    private readonly cardsDeInicioSrv = inject(CardsDeInicioService);
    private readonly spinnerSrv = inject(SpinnerService);
    cards: ICardsDeInicio[] = [];
    visitasPagina: number = 3432;
    publicacionesActivas: number = 3234;
    publicacionesPausadas: number = 3242;
    dineroGanado: number = 456;

    ngOnInit(): void {
        //README: ver este BUG!!!
        setTimeout(async () => {
            this.cards = await this.cardsDeInicioSrv.getTodos()
                .then(cards => cards)
                .finally(() => { this.spinnerSrv.ocultar(); });
        }, 0);
    }
}
