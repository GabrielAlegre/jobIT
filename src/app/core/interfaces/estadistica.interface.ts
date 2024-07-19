
export interface IEstadistica {
    id?: string;
    cantidadDePublicaciones: number;
    cantidadDePublicacionesActivas: number;
    cantidadDePublicacionesPausadas: number;
    dineroGanado: number;
    visitas: number;
    usuarios: {
        idUser?: any;
        fechaInicio: Date;
        fechaFin: Date;
        minutosActivo: number;
        cantidadDePostulaciones?: number;
        cantidadDePublicaciones?: number;
        dineroGastado: number;
        vecesQueIngreso: number;
    }[];
}
