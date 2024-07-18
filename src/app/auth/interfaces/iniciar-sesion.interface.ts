import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";

export interface IIniciarSesion {
    correo: TEstructuraFormValida<string>;
    clave: TEstructuraFormValida<string>;
}
