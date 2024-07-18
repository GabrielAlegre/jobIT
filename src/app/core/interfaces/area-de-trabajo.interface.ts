import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";
import { EEstadoAreaDeTRabajo } from "../enums/estado-area-de-trabajo.enum";

export interface IAreaDeTrabajo {
    id?: string;
    fecha?: Date;
    nombre: TEstructuraFormValida<string>;
    estado?: EEstadoAreaDeTRabajo;
}

