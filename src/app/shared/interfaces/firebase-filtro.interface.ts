import { WhereFilterOp } from "@angular/fire/firestore";

export interface IFirebaseFiltro<T> {
    campo: keyof T;
    opcion: WhereFilterOp;
    valor: any;
}
