import { IAdmin } from "../interfaces/admin.interface";
import { IEmpleado } from "../interfaces/empleado.interface";
import { IEmpresa } from "../interfaces/empresa.interface";
import { IUsuario } from "../interfaces/usuario.interface";

export type TTodosLosUsuarios = IUsuario | IEmpresa | IEmpleado | IAdmin;
