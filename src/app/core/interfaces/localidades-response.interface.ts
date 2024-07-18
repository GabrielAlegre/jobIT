export interface ILocalidadesResponse {
    cantidad: number;
    inicio: number;
    localidades: Localidad[];
    parametros: Parametros;
    total: number;
}

export interface Localidad {
    categoria: Categoria;
    centroide: Centroide;
    departamento: Departamento;
    id: string;
    localidad_censal: Departamento;
    municipio: Departamento;
    nombre: string;
    provincia: Departamento;
}

export enum Categoria {
    ComponenteDeLocalidadCompuesta = "Componente de localidad compuesta",
    Entidad = "Entidad",
    LocalidadSimple = "Localidad simple",
}

export interface Centroide {
    lat: number;
    lon: number;
}

export interface Departamento {
    id: string;
    nombre: string;
}

export interface Parametros {
    max: number;
    provincia: string;
}
