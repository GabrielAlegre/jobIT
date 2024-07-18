import { ETipoDeUsuario } from "../enums/tipo-de-usuario.enum";

export interface IUsuario {
    id?: string;
    correo: string;
    clave: string;
    tipo: ETipoDeUsuario;
    pathFoto: string;
    fecha: Date;
}
