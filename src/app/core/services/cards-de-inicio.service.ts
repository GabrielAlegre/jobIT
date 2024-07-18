import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { ICardsDeInicio } from '../interfaces/cards-de-inicio.interface';

@Injectable({ providedIn: 'root' })
export class CardsDeInicioService {

    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.cardsInicio);
    private readonly crud = inject(CrudService<ICardsDeInicio>);

    async getPorId(id: string): Promise<ICardsDeInicio> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<ICardsDeInicio>[] = [],
        ordenarPor: keyof ICardsDeInicio | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<ICardsDeInicio> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<ICardsDeInicio>[] = [],
        ordenarPor: keyof ICardsDeInicio | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<ICardsDeInicio[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async actualizar(usuario: ICardsDeInicio): Promise<true> {
        return await this.crud.actualizar(this.coleccion, usuario);
    }

    async guardar(usuario: ICardsDeInicio): Promise<ICardsDeInicio> {
        return await this.crud.guardar(this.coleccion, usuario);
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }
}
