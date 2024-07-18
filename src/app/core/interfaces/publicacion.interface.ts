import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";
import { EEstadoPublicacion } from "../enums/estado-publicacion.enum";
import { EEstadoRegistro } from "../enums/estado-registro.enum";
import { EFormasDeTrabajo } from "../enums/formas-de-trabajo.enum";
import { ENivel } from "../enums/nivel.enum";
import { ETiempoDeTrabajo } from "../enums/tiempo-de-trabajo.enum";
import { IAreaDeTrabajo } from "./area-de-trabajo.interface";

export interface IPublicacion {
    id?: string;
    idEmpleado?: string;
    idEmpresa?: string;
    inicio?: Date;
    fin?: Date;
    estado?: EEstadoPublicacion;
    empresaQuePublica?: string;
    estadoRegistro?: EEstadoRegistro;
    title: TEstructuraFormValida<string>;
    description: TEstructuraFormValida<string>;
    formasDeTrabajo: TEstructuraFormValida<EFormasDeTrabajo>;
    areaDeTrabajo: TEstructuraFormValida<IAreaDeTrabajo>;
    provincia: TEstructuraFormValida<string>;
    localidad: TEstructuraFormValida<string>;
    domicilio: TEstructuraFormValida<string>;
    tiempoDeTrabajo: TEstructuraFormValida<ETiempoDeTrabajo>;
    salario: TEstructuraFormValida<number>;
    nivel: TEstructuraFormValida<ENivel>;
}
