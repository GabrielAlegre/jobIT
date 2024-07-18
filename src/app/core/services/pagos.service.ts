import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { IPago } from '../interfaces/pago.interface';

@Injectable({
    providedIn: 'root'
})
export class PagosService {
    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.pagos);
    private readonly crud = inject(CrudService<IPago>);

    async getPorId(id: string): Promise<IPago> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<IPago>[] = [],
        ordenarPor: keyof IPago | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IPago> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<IPago>[],
        ordenarPor: keyof IPago | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IPago[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async actualizar(usuario: IPago): Promise<true> {
        return await this.crud.actualizar(this.coleccion, usuario);
    }

    async guardar(usuario: IPago): Promise<IPago> {
        return await this.crud.guardar(this.coleccion, usuario);
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }

    async getPagosPorUsuario(userId: string): Promise<IPago[]> {
        try {
            const q = query(this.coleccion, where('idUsuario', '==', userId));
            const querySnapshot = await getDocs(q);
            const pagos: IPago[] = [];
            querySnapshot.forEach((doc) => {
                pagos.push({ id: doc.id, ...doc.data() } as IPago);
            });
            return pagos;
        } catch (error) {
            console.error('Error al obtener los pagos: ', error);
            throw error;
        }
    }

}
