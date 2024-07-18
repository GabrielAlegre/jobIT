import { EEstadoRegistro } from "../enums/estado-registro.enum";

export interface IRegistro {
    id?: string;
    idPublicacion: string;
    idEmpleado: string;
    idEmpresa: string;
    estado: EEstadoRegistro;
    fecha: Date;
    avisadoEmpresa: boolean;
    avisadoEmpleado: boolean;
}
