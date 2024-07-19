import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { IEstadistica } from '../interfaces/estadistica.interface';

@Injectable({
    providedIn: 'root'
})
export class EstadisticasService {
    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.estadisticas);
    private readonly crud = inject(CrudService<IEstadistica>);

    async getPorId(id: string): Promise<IEstadistica> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<IEstadistica>[] = [],
        ordenarPor: keyof IEstadistica | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IEstadistica> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<IEstadistica>[],
        ordenarPor: keyof IEstadistica | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IEstadistica[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async guardar(stats: IEstadistica): Promise<IEstadistica> {
        return await this.crud.guardar(this.coleccion, stats);
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }

    async getPublicacionesPorUser(userId: string): Promise<IEstadistica[]> {
        try {
            const q = query(this.coleccion, where('id', '==', userId));
            const querySnapshot = await getDocs(q);
            const publicaciones: IEstadistica[] = [];
            querySnapshot.forEach((doc) => {
                publicaciones.push({ id: doc.id, ...doc.data() } as IEstadistica);
            });
            return publicaciones;
        } catch (error) {
            console.error('Error al obtener los publicaciones: ', error);
            throw error;
        }
    }
}
