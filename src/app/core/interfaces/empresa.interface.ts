import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";
import { ETipoDeUsuario } from "../enums/tipo-de-usuario.enum";
import { IPack } from "./pack.interface";
import { ITarjeta } from "./tarjeta.interface";

export interface IEmpresa {
    id?: TEstructuraFormValida<string>;
    correo?: TEstructuraFormValida<string>;
    clave?: TEstructuraFormValida<string>;
    tipo?: TEstructuraFormValida<ETipoDeUsuario>;
    nombre: TEstructuraFormValida<string>;
    cuit: TEstructuraFormValida<string>;
    telefono: TEstructuraFormValida<string>;
    provincia: TEstructuraFormValida<string>;
    localidad: TEstructuraFormValida<string>;
    domicilio: TEstructuraFormValida<string>;
    pathFoto?: string;
    fecha?: Date;
    tarjetas?: ITarjeta[];
    //se supone que el ultimo pack del array es el que va a estar activo, es decir, el que tiene publicaciones restantes
    packs?: IPack[];

}
