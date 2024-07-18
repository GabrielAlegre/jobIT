import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { TTodosLosUsuarios } from '../types/todos-los-usuarios.type';


@Injectable({ providedIn: 'root' })
export class UsuariosService {

    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.usuarios);
    private readonly crud = inject(CrudService<TTodosLosUsuarios>);

    async getPorId(id: string): Promise<TTodosLosUsuarios> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<TTodosLosUsuarios>[] = [],
        ordenarPor: keyof TTodosLosUsuarios | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<TTodosLosUsuarios> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<TTodosLosUsuarios>[],
        ordenarPor: keyof TTodosLosUsuarios | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<TTodosLosUsuarios[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async actualizar(usuario: TTodosLosUsuarios): Promise<true> {
        return await this.crud.actualizar(this.coleccion, usuario);
    }

    async guardar(usuario: TTodosLosUsuarios): Promise<TTodosLosUsuarios> {
        return await this.crud.guardar(this.coleccion, usuario);
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }
}
