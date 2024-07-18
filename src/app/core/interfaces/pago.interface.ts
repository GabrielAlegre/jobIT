import { EEstadoPago } from "../enums/estado-pago.enum";

export interface IPago {
    id?: string;
    idTarjeta?: string;
    idUsuario?: string;
    precio: number;
    numeroDeTarjeta: string | undefined;
    estado: EEstadoPago;
    fecha: Date;
    descripcion?: String;
    fechaFin?: Date | null;
}
