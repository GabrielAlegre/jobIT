import { TValidadorAsincronico } from "../types/validador-asincronico.type";
import { TValidadorSincronico } from "../types/validador-sincronico.type";

type FormHooks = 'change' | 'blur' | 'submit';

export interface IEstructuraForm {
    updateOn?: FormHooks;
    validators?: TValidadorSincronico;
    asyncValidators?: TValidadorAsincronico;
}
