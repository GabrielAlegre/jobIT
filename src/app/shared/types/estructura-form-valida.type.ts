import { IEstructuraForm } from "../interfaces/estructura-form.interface";
import { TValidadorAsincronico } from "./validador-asincronico.type";
import { TValidadorSincronico } from "./validador-sincronico.type";

export type TEstructuraFormValida<T> =
    | T
    | [T, IEstructuraForm]
    | [T, TValidadorSincronico]
    | [T, TValidadorSincronico, TValidadorAsincronico];
