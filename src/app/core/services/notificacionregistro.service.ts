import { Injectable } from '@angular/core';
import { NotificacionService } from './notificacion.service';
import { IRegistro } from '../interfaces/registro.interface';
import { EEstadoRegistro } from '../enums/estado-registro.enum';
import { INotificacion } from '../interfaces/notificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificacionregistroService {
  constructor(
    private notificacionService: NotificacionService
  ) {}

  async handleRegistroGuardado(registro: IRegistro): Promise<void> {
    const cantidadPostulantes = await this.notificacionService.contarPostulantesPorPublicacion(registro.idPublicacion);
    console.log('Cantidad de postulantes:', cantidadPostulantes); // Agrega un log para verificar la cantidad
    await this.notificacionService.manejarNotificacion(registro.idPublicacion, cantidadPostulantes, 'empresa');

    if (registro.estado === EEstadoRegistro.aplicado) {
      await this.crearNotificacionParaEmpresa(registro.idPublicacion, registro.idEmpresa, cantidadPostulantes);
    }
  }

  async handleRegistroAceptado(registro: IRegistro): Promise<void> {
    await this.notificacionService.manejarNotificacion(registro.idPublicacion, 1, 'empleado');
  }

  private async crearNotificacionParaEmpresa(idPublicacion: string, idEmpresa: string, cantidadPostulantes: number): Promise<void> {
    await this.notificacionService.crearNotificacion(idPublicacion, cantidadPostulantes, 'empresa', idEmpresa);
  }

  async marcarNotificacionComoVista(idPublicacion: string, tipo: 'empresa' | 'empleado'): Promise<void> {
    await this.notificacionService.marcarNotificacionComoVista(idPublicacion, tipo);
  }

  async obtenerNotificacion(idPublicacion: string, tipo: 'empresa' | 'empleado'): Promise<INotificacion | undefined> {
    return this.notificacionService.obtenerNotificacion(idPublicacion, tipo);
  }
}
