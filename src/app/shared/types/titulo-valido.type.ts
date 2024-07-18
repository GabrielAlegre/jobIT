import { TRoutesValidos } from "./routes-validos.type";

export type TTituloValido = TRoutesValidos extends `${string}___${infer R}` ? R : '';
