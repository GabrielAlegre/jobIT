import { TEstructuraFormValida } from '../../shared/types/estructura-form-valida.type';

export interface IExperiencia {
    id?: TEstructuraFormValida<string>;
    inicio: TEstructuraFormValida<Date>;
    fin: TEstructuraFormValida<Date>;
    institucion: TEstructuraFormValida<string>;
    titulo: TEstructuraFormValida<string>;
    descripcion: TEstructuraFormValida<string>;
}
