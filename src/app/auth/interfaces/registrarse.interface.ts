import { ETipoDeUsuario } from "../../core/enums/tipo-de-usuario.enum";
import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";

export interface IRegistrarse {
    correo: TEstructuraFormValida<string>;
    clave: TEstructuraFormValida<string>;
    repiteClave: TEstructuraFormValida<string>;
    tipo: TEstructuraFormValida<ETipoDeUsuario>;
}
