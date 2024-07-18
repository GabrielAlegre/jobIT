import { inject, Injectable } from '@angular/core';
import { collection, Firestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { IAreaDeTrabajo } from '../interfaces/area-de-trabajo.interface';
import { PublicacionesService } from './publicaciones.service';

@Injectable({ providedIn: 'root' })
export class AreasDeTrabajoService {


    // TODO: hacer una normalización de texto (ej: capitalize, trim(), etc)
    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.areasDeTrabajo);
    private readonly crud = inject(CrudService<IAreaDeTrabajo>);
    private readonly publicacionesSrv = inject(PublicacionesService);

    async getPorId(id: string): Promise<IAreaDeTrabajo> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<IAreaDeTrabajo>[] = [],
        ordenarPor: keyof IAreaDeTrabajo | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IAreaDeTrabajo> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<IAreaDeTrabajo>[],
        ordenarPor: keyof IAreaDeTrabajo | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IAreaDeTrabajo[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async guardar(area: IAreaDeTrabajo, areaVieja?: IAreaDeTrabajo): Promise<IAreaDeTrabajo> {
        return await this.crud.guardar(this.coleccion, area)
            .then(async () => {
                if (areaVieja) {
                    const publicaciones = await this.publicacionesSrv.getTodos([{ campo: 'areaDeTrabajo', opcion: '==', 'valor': areaVieja }]);
                    publicaciones.forEach(async (publicacion) => {
                        (publicacion.areaDeTrabajo as IAreaDeTrabajo).nombre = area.nombre;
                        //TODO: promise all
                        await this.publicacionesSrv.guardar(publicacion);
                    });
                }
                return area;
            });
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }
}
