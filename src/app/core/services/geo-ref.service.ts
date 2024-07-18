import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ILocalidadesResponse } from '../interfaces/localidades-response.interface';
import { IProvinciasResponse } from '../interfaces/provincias-response.interface';

@Injectable({ providedIn: 'root' })
export class GeoRefService {

    private readonly http = inject(HttpClient);
    private readonly urlBase = 'https://apis.datos.gob.ar/georef/api';

    async getProvincias(): Promise<string[]> {
        const url = `${this.urlBase}/provincias`;
        const resp = this.http.get<IProvinciasResponse>(url);
        const promise = await firstValueFrom(resp);
        const provincias = promise.provincias
            .map(({ nombre }) => nombre)
            .sort();
        return provincias;
    }

    async getLocalidades(provincia: string): Promise<string[]> {
        const url = `${this.urlBase}/localidades?provincia=${provincia}&max=1000`;
        const resp = this.http.get<ILocalidadesResponse>(url);
        const promise = await firstValueFrom(resp);
        const localidades = promise.localidades
            .map(({ nombre }) => nombre)
            .sort();
        return [...new Set(localidades)];
    }

}
