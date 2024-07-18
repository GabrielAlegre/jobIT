import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";

export interface ISuscripcion {
    id?: TEstructuraFormValida<string>;
    precio: TEstructuraFormValida<number>;
    nombre: TEstructuraFormValida<string>;
    descripcion: TEstructuraFormValida<string>;
    inicio?: Date;
    fin?: Date;
}

