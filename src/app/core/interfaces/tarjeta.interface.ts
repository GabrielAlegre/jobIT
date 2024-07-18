import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";
import { ETipoDeTarjeta } from "../enums/tipo-de-tarjeta.enum";

export interface ITarjeta {
    id?: TEstructuraFormValida<string>;
    tipo: TEstructuraFormValida<ETipoDeTarjeta>;
    nombre: TEstructuraFormValida<string>;
    numero: TEstructuraFormValida<number>;
    codigoDeSeguridad: TEstructuraFormValida<string>;
    mesDeVencimiento: TEstructuraFormValida<number>;
    anioDeVencimiento: TEstructuraFormValida<number>;
    fecha?: Date;
}
