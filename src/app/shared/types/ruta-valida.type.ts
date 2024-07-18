import { TRoutesValidos } from "./routes-validos.type";

export type TRutaValida = TRoutesValidos extends `${infer R}___${string}`
    ? R | `/${R}` | `./${R}`
    : '';
