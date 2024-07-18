import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { ISuscripcion } from '../interfaces/suscripcion.interface';

@Injectable({ providedIn: 'root' })
export class SuscripcionesService {

    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.suscripcion);
    private readonly crud = inject(CrudService<ISuscripcion>);

    async getPorId(id: string): Promise<ISuscripcion> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<ISuscripcion>[] = [],
        ordenarPor: keyof ISuscripcion | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<ISuscripcion> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<ISuscripcion>[],
        ordenarPor: keyof ISuscripcion | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<ISuscripcion[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async actualizar(usuario: ISuscripcion): Promise<true> {
        return await this.crud.actualizar(this.coleccion, usuario);
    }

    async guardar(usuario: ISuscripcion): Promise<ISuscripcion> {
        return await this.crud.guardar(this.coleccion, usuario);
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }
}
