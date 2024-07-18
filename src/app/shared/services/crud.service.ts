import { inject, Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, doc, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';
import { IFirebaseFiltro } from '../interfaces/firebase-filtro.interface';
import { TFirebaseColeccion } from '../types/firebase-coleccion.type';
import { SpinnerService } from './spinner.service';

@Injectable({ providedIn: 'root' })
export class CrudService<T extends Object> {

    private readonly spinnerSrv = inject(SpinnerService);

    private readonly msgInvalidData = 'Datos inválidos';

    async getPorId(coleccion: TFirebaseColeccion, id: string): Promise<T> {

        if (!id || !coleccion) { throw new Error(this.msgInvalidData); }
        this.spinnerSrv.mostrar();

        const documento = doc(coleccion, id);
        const _getDoc = await getDoc(documento);
        const elemento = await _getDoc.data() as Promise<T>;

        return { id, ...elemento };
    }

    async getUno
        (coleccion: TFirebaseColeccion,
            filtros: IFirebaseFiltro<T>[],
            ordenarPor: keyof T | 'SIN_ORDENAR' = 'SIN_ORDENAR',
            ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<T> {

        const data = await this.getTodos(coleccion, filtros);

        if (data?.length == 1) {
            return data[0] as T;
        }
        if (data?.length > 1) {
            console.warn('Hay mas de un elemento en la colección');
            return data[0] as T;
        }

        throw new Error('No se encontró el registro');
    };

    async getTodos
        (coleccion: TFirebaseColeccion,
            filtros: IFirebaseFiltro<T>[] = [],
            ordenarPor: keyof T | 'SIN_ORDENAR' = 'SIN_ORDENAR',
            ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<T[]> {

        if (!coleccion) { throw new Error(this.msgInvalidData); }
        this.spinnerSrv.mostrar();

        const donde = filtros.map(({ campo: field, opcion: option, valor: value }) =>
            where(field as string, option, value)
        );

        let consulta;

        if (ordenarPor == 'SIN_ORDENAR') {
            consulta = query(coleccion, ...donde);
        } else {
            const _orderBy = orderBy((ordenarPor as string), ordenamiento);
            consulta = query(coleccion, ...donde, _orderBy);
        }

        const response = collectionData(consulta, { idField: 'id' });
        return firstValueFrom(response) as Promise<T[]>;
    }

    private async guardarConId(coleccion: TFirebaseColeccion, elemento: T): Promise<T> {

        this.spinnerSrv.mostrar();

        elemento = { ...elemento };
        const documento = await doc(coleccion, (elemento as any)?.id);
        delete (elemento as any)?.id;
        const data = await setDoc(documento, elemento);
        return data as any;
    };

    private async guardarSinId(coleccion: TFirebaseColeccion, elemento: T): Promise<T> {

        this.spinnerSrv.mostrar();

        elemento = { ...elemento };
        delete (elemento as any)?.id;
        const documento = await addDoc(coleccion, { ...(elemento as any) });
        return (documento as any) as T;
    };

    async guardar(coleccion: TFirebaseColeccion, elemento: T): Promise<T> {

        if (!elemento || !coleccion) { throw new Error(this.msgInvalidData); }
        this.spinnerSrv.mostrar();

        if ((elemento as any)?.id) {
            return await this.guardarConId(coleccion, elemento);
        }
        return await this.guardarSinId(coleccion, elemento);
    };

    async actualizar(coleccion: TFirebaseColeccion, elemento: T): Promise<true> {

        if (!elemento || !coleccion) { throw new Error(this.msgInvalidData); }
        this.spinnerSrv.mostrar();

        const data = { ...(elemento as any) };
        const id = ((elemento as any)?.id as string);
        const documento = doc(coleccion, id);
        await updateDoc(documento, data);
        return true;

        // README: si no actualiza se genera un error por eso siempre es "true"
    }

    async eliminarPorId(coleccion: TFirebaseColeccion, id: string): Promise<boolean> {

        if (!id || !coleccion) { throw new Error(this.msgInvalidData); }
        this.spinnerSrv.mostrar();

        const elemento = await this.getPorId(coleccion, id);

        if (!elemento) { return false; }

        const documento = doc(coleccion, id);
        await deleteDoc(documento);
        return true;
    }
}
