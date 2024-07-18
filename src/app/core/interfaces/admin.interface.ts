import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";
import { ETipoDeUsuario } from "../enums/tipo-de-usuario.enum";

export interface IAdmin {
    id?: TEstructuraFormValida<string>;
    correo?: TEstructuraFormValida<string>;
    clave?: TEstructuraFormValida<string>;
    tipo?: TEstructuraFormValida<ETipoDeUsuario>;
    nombre: TEstructuraFormValida<string>;
    apellido: TEstructuraFormValida<string>;
    pathFoto?: TEstructuraFormValida<string>;
    fecha?: Date;
}

