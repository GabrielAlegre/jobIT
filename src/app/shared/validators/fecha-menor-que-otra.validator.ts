import { ValidatorFn } from '@angular/forms';


export const fechaMenorQueOtra =
    <T>(campo1: keyof T, campo2: keyof T) => {

        const response: ValidatorFn = (control) => {

            const controlField1 = control.get(campo1 as string);
            const controlField2 = control.get(campo2 as string);
            const fecha1 = new Date(controlField1?.value);
            const fecha2 = new Date(controlField2?.value);

            if (fecha2 > fecha1) {
                controlField1?.setErrors(null);
                return null;
            }

            const error = { fechaMenorQueOtra: true };
            controlField1?.setErrors(error);
            return error;

        };
        return response;
    };
