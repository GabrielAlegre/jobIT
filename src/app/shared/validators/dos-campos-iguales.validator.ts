import { ValidatorFn } from "@angular/forms";
import { TErroresValidos } from "../types/errores-validos.type";

export const dosCamposIgualesValidator =
    <T>(campo1: keyof T, campo2: keyof T) => {

        const response: ValidatorFn = (control) => {

            const control1 = control.get(campo1 as string);
            const control2 = control.get(campo2 as string);

            if (control1?.value === control2?.value) {
                control2?.setErrors(null);
                return null;
            }

            const error: any = {};
            const nombreDeError: TErroresValidos = 'noIguales';
            error[nombreDeError] = true;

            control2?.setErrors(error);
            return error;

        };
        return response;
    };
