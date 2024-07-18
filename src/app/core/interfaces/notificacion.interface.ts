export interface INotificacion {
    idPublicacion: string;
    cantidad: number;
    notificacionEmpresa?: boolean;
    notificacionEmpleado?: boolean;
    fechaPostulacion?: Date;
    fechaVista?: Date;
    tipo: 'empresa' | 'empleado';
    idEmpleado?: string;
    idEmpresa?: string;
  }
  