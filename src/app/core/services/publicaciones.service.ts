import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { IPublicacion } from '../interfaces/publicacion.interface';

@Injectable({
    providedIn: 'root'
})
export class PublicacionesService {
    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.publicaciones);
    private readonly crud = inject(CrudService<IPublicacion>);

    async getPorId(id: string): Promise<IPublicacion> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<IPublicacion>[] = [],
        ordenarPor: keyof IPublicacion | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IPublicacion> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<IPublicacion>[],
        ordenarPor: keyof IPublicacion | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IPublicacion[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async guardar(publicacion: IPublicacion): Promise<IPublicacion> {
        return await this.crud.guardar(this.coleccion, publicacion);
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }

    async getPublicacionesPorEmpresa(userEmpresaId: string): Promise<IPublicacion[]> {
        try {
            const q = query(this.coleccion, where('idEmpresa', '==', userEmpresaId));
            const querySnapshot = await getDocs(q);
            const publicaciones: IPublicacion[] = [];
            querySnapshot.forEach((doc) => {
                publicaciones.push({ id: doc.id, ...doc.data() } as IPublicacion);
            });
            return publicaciones;
        } catch (error) {
            console.error('Error al obtener los publicaciones: ', error);
            throw error;
        }
    }
}
