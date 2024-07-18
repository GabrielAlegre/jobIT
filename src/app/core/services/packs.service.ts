import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { IPack } from '../interfaces/pack.interface';

@Injectable({ providedIn: 'root' })
export class PacksService {

    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.packs);
    private readonly crud = inject(CrudService<IPack>);

    async getPorId(id: string): Promise<IPack> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<IPack>[] = [],
        ordenarPor: keyof IPack | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IPack> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<IPack>[],
        ordenarPor: keyof IPack | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IPack[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async actualizar(usuario: IPack): Promise<true> {
        return await this.crud.actualizar(this.coleccion, usuario);
    }

    async guardar(usuario: IPack): Promise<IPack> {
        return await this.crud.guardar(this.coleccion, usuario);
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }
}
