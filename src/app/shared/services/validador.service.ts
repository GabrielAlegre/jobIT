import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { IValidadorOpciones } from '../interfaces/validador-opciones.interface';
import { TErroresValidos } from '../types/errores-validos.type';

@Injectable({ providedIn: 'root' })
export class ValidadorService {

    mensajeError(
        form: FormGroup | undefined,
        field: string, options?: IValidadorOpciones
    ): string | null {

        if (!form) {
            return null;
        }

        if (!this.esUnCampoValido(form, field)) { return null; }

        if (options) {
            options.campo = field;
            if (!options.key) options.key = 'pattern';
        }

        return this.getCampoError(form, field, options);
    }


    esUnCampoValido(form: FormGroup, field: string): boolean | null {
        return form.controls[field]?.errors
            && (form.controls[field]?.touched || !form.controls[field]?.pristine);
    }


    getCampoError(form: FormGroup, field: string, options?: IValidadorOpciones): string | null {

        const errors = form.controls[field].errors || {};

        for (const key of Object.keys(errors)) {
            if (options
                && options.key === key
                && options.campo === field) {
                return options.mensaje;
            }
            return this.getMensajeError(key as TErroresValidos, errors);
        }

        return null;
    }


    private getMensajeError(key: TErroresValidos, errors: ValidationErrors): string | null {
        switch (key) {
            case 'required':
                return 'Campo requerido.';
            case 'minlength':
                return `Mínimo ${errors['minlength']?.requiredLength} carácteres.`;
            case 'maxlength':
                return `Máximo ${errors['maxlength']?.requiredLength} carácteres.`;
            case 'min':
                return `Mínimo ${errors['min']?.min}.`;
            case 'max':
                return `Máximo ${errors['max']?.max}.`;
            case 'pattern':
                return "Patrón inválido.";
            case 'emailTomado':
                return `${errors['emailTaken']}`;
            case 'fechaMenorQueOtra':
                return `La fecha de inicio tiene que ser menor que la fecha de fin`;
            default:
                return null;
        }
    }
}
