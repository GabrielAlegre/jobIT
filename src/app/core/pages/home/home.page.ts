import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ICardsDeInicio } from '../../interfaces/cards-de-inicio.interface';
import { CardsDeInicioService } from '../../services/cards-de-inicio.service';

@Component({
    selector: 'core-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss'
})
export default class HomePage implements OnInit {

    private readonly cardsDeInicioSrv = inject(CardsDeInicioService);
    private readonly spinnerSrv = inject(SpinnerService);
    cards: ICardsDeInicio[] = [];

    ngOnInit(): void {
        //README: ver este BUG!!!
        setTimeout(async () => {
            this.cards = await this.cardsDeInicioSrv.getTodos()
                .then(cards => cards)
                .finally(() => { this.spinnerSrv.ocultar(); });
        }, 0);
    }


}
