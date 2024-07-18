import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";

export interface IPack {
    id?: TEstructuraFormValida<string>;
    precio: TEstructuraFormValida<number>;
    nombre: TEstructuraFormValida<string>;
    descripcion: TEstructuraFormValida<string>;
    cantidadDePublicaciones: TEstructuraFormValida<number>;
    fecha?: Date;
    cantidadDePublicacionesRestantes?: TEstructuraFormValida<number>;
}

