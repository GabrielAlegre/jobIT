import { TErroresValidos } from "../types/errores-validos.type";

export interface IValidadorOpciones {
    key?: TErroresValidos;
    campo?: string;
    mensaje: string;
}
