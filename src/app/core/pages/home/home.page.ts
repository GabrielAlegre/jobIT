import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ICardsDeInicio } from '../../interfaces/cards-de-inicio.interface';
import { IEstadistica } from '../../interfaces/estadistica.interface';
import { CardsDeInicioService } from '../../services/cards-de-inicio.service';
import { EstadisticasService } from '../../services/estadisticas.service';

@Component({
    selector: 'core-home',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe, ReactiveFormsModule],
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss'
})
export default class HomePage implements OnInit {

    private readonly cardsDeInicioSrv = inject(CardsDeInicioService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly estadisticasSrv = inject(EstadisticasService);
    estadistica: IEstadistica | undefined;
    private readonly toastSrv = inject(ToastService);

    cards: ICardsDeInicio[] = [];

    async ngOnInit(): Promise<void> {
        await this.obtenerEstadisticas();
    }

    async obtenerEstadisticas() {
        await this.estadisticasSrv.getUno().then((estadistica) => {
            this.estadistica = estadistica;
        }).catch(async (error) => {
            await this.estadisticasSrv.guardar({
                visitas: 0,
                usuarios: []
            });
        })
            .finally(async () => {
                this.spinnerSrv.ocultar();
            });
    }
}
