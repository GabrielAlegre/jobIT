import { TEstructuraFormValida } from "../../shared/types/estructura-form-valida.type";
import { ETipoDeUsuario } from "../enums/tipo-de-usuario.enum";
import { IExperiencia } from "./experiencia.interface";
import { ISuscripcion } from "./suscripcion.interface";
import { ITarjeta } from "./tarjeta.interface";

export interface IEmpleado {
    id?: TEstructuraFormValida<string>;
    correo?: TEstructuraFormValida<string>;
    clave?: TEstructuraFormValida<string>;
    tipo?: TEstructuraFormValida<ETipoDeUsuario>;
    nombre: TEstructuraFormValida<string>;
    apellido: TEstructuraFormValida<string>;
    dni: TEstructuraFormValida<string>;
    telefono: TEstructuraFormValida<string>;
    provincia: TEstructuraFormValida<string>;
    localidad: TEstructuraFormValida<string>;
    domicilio: TEstructuraFormValida<string>;
    experienciaDeTrabajo?: IExperiencia[];
    experienciaDeEstudio?: IExperiencia[];
    pathFoto?: string;
    pathCV?: string;
    fecha?: Date;
    tarjetas?: ITarjeta[];
    suscripcion?: ISuscripcion;
    esPremium?: boolean;
}
