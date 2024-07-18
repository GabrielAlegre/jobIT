import { Validators } from "@angular/forms";

export type TErroresValidos =
    | Lowercase<keyof typeof Validators>
    | 'emailTomado'
    | 'noEsValorPosible'
    | 'noIguales'
    | 'fechaMenorQueOtra'
    | 'fechaInvalida'


