
export interface IEstadistica {
    id?: string;
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
