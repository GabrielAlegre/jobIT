import { Injectable, inject } from '@angular/core';
import { collection, Firestore, getDocs, query, where, setDoc, updateDoc, doc, DocumentData, writeBatch } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { INotificacion } from '../interfaces/notificacion.interface';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {
  private readonly firebase = inject(Firestore);
  private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.notificaciones);
  
  private notificacionesSubject = new BehaviorSubject<number>(0);
  notificaciones$ = this.notificacionesSubject.asObservable();

  private aceptacionesSubject = new BehaviorSubject<number>(0);
  aceptaciones$ = this.aceptacionesSubject.asObservable();

  constructor() {
    this.actualizarContadorNotificaciones();
    this.actualizarContadorAceptaciones();
  }

  private async contarPostulantesActivos(): Promise<number> {
    const q = query(this.coleccion, where('notificacionEmpresa', '==', true));
    const querySnapshot = await getDocs(q);
    let totalPostulantes = 0;
    querySnapshot.forEach((doc: DocumentData) => {
      const data = doc['data']() as INotificacion;
      totalPostulantes += data.cantidad;
    });
    return totalPostulantes;
  }

  private async contarAceptacionesActivas(): Promise<number> {
    const q = query(this.coleccion, where('tipo', '==', 'empleado'), where('notificacionEmpleado', '==', true));
    const querySnapshot = await getDocs(q);
    let totalAceptaciones = 0;
    querySnapshot.forEach((doc: DocumentData) => {
      const data = doc['data']() as INotificacion;
      totalAceptaciones += data.cantidad;
    });
    return totalAceptaciones;
  }

  async actualizarContadorNotificaciones(): Promise<void> {
    const totalPostulantes = await this.contarPostulantesActivos();
    this.notificacionesSubject.next(totalPostulantes);
  }

  async actualizarContadorAceptaciones(): Promise<void> {
    const totalAceptaciones = await this.contarAceptacionesActivas();
    this.aceptacionesSubject.next(totalAceptaciones);
  }

  async obtenerNotificacion(idPublicacion: string, tipo: 'empresa' | 'empleado'): Promise<INotificacion | undefined> {
    const q = query(this.coleccion, where('idPublicacion', '==', idPublicacion), where('tipo', '==', tipo));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as INotificacion;
    }
    return undefined;
  }

  async crearNotificacion(idPublicacion: string, cantidadPostulantes: number, tipo: 'empresa' | 'empleado', id: string): Promise<void> {
    const notificacion: INotificacion = {
      idPublicacion,
      cantidad: cantidadPostulantes,
      tipo: tipo,
      notificacionEmpresa: tipo === 'empresa',
      notificacionEmpleado: tipo === 'empleado',
      fechaPostulacion: new Date()
    };
    if (tipo === 'empleado') {
      notificacion.idEmpleado = id;
    } else {
      notificacion.idEmpresa = id;
    }
    await setDoc(doc(this.coleccion, `${idPublicacion}-${tipo}`), notificacion);
    if (tipo === 'empresa') {
      await this.actualizarContadorNotificaciones();
    } else if (tipo === 'empleado') {
      await this.actualizarContadorAceptaciones();
    }
  }

  async actualizarNotificacion(idPublicacion: string, cantidadPostulantes: number, tipo: 'empresa' | 'empleado'): Promise<void> {
    const updates: Partial<INotificacion> = {
      cantidad: cantidadPostulantes,
      fechaPostulacion: new Date()
    };
    await updateDoc(doc(this.coleccion, `${idPublicacion}-${tipo}`), updates);
    if (tipo === 'empresa') {
      await this.actualizarContadorNotificaciones();
    } else if (tipo === 'empleado') {
      await this.actualizarContadorAceptaciones();
    }
  }

  async manejarNotificacion(idPublicacion: string, cantidadPostulantes: number, tipo: 'empresa' | 'empleado'): Promise<void> {
    const notificacionExistente = await this.obtenerNotificacion(idPublicacion, tipo);
    const id = tipo === 'empresa' ? idPublicacion : notificacionExistente?.idEmpleado || '';

    if (notificacionExistente) {
      await this.actualizarNotificacion(idPublicacion, cantidadPostulantes, tipo);
    } else if (cantidadPostulantes > 0) {
      await this.crearNotificacion(idPublicacion, cantidadPostulantes, tipo, id);
    }
  }

  async manejarNotificacionEmpleado(): Promise<void> {
    await this.actualizarContadorAceptaciones();
  }

  async marcarNotificacionComoVista(idPublicacion: string, tipo: 'empresa' | 'empleado'): Promise<void> {
    const notificacionExistente = await this.obtenerNotificacion(idPublicacion, tipo);

    if (notificacionExistente) {
      await this.actualizarNotificacion(idPublicacion, 0, tipo);
      const updates: Partial<INotificacion> = {
        fechaVista: new Date()
      };
      await updateDoc(doc(this.coleccion, `${idPublicacion}-${tipo}`), updates);
      await this.marcarRegistrosComoAvisados(idPublicacion);
      console.log(`Notificación para la publicación ${idPublicacion} marcada como vista.`);
    } else {
      console.log(`No se encontró la notificación para la publicación ${idPublicacion}.`);
    }
    if (tipo === 'empresa') {
      await this.actualizarContadorNotificaciones();
    } else if (tipo === 'empleado') {
      await this.actualizarContadorAceptaciones();
    }
  }

  async contarPostulantesPorPublicacion(idPublicacion: string): Promise<number> {
    const q = query(
      collection(this.firebase, environment.colecciones.registro),
      where('idPublicacion', '==', idPublicacion),
      where('estado', 'in', ['aplicado', 'aceptadoEmpleado']),
      where('avisadoEmpresa', '==', false) // Solo contar los que no han sido avisados a la empresa
    );
    const snapshot = await getDocs(q);
    console.log('Snapshot size:', snapshot.size);
    return snapshot.size;
  }

  async marcarRegistrosComoAvisados(idPublicacion: string): Promise<void> {
    const q = query(
      collection(this.firebase, environment.colecciones.registro),
      where('idPublicacion', '==', idPublicacion),
      where('avisadoEmpresa', '==', false)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(this.firebase);

    snapshot.forEach(doc => {
      const docRef = doc.ref;
      batch.update(docRef, { avisadoEmpresa: true });
    });

    await batch.commit();
    console.log(`Registros de la publicación ${idPublicacion} marcados como avisados.`);
  }

  async marcarAceptacionesComoAvisadas(idEmpleado: string): Promise<void> {
    const q = query(
      collection(this.firebase, environment.colecciones.registro),
      where('idEmpleado', '==', idEmpleado),
      where('estado', '==', 'aceptadoEmpresa'),
      where('avisadoEmpleado', '==', true)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(this.firebase);

    snapshot.forEach(doc => {
      const docRef = doc.ref;
      batch.update(docRef, { avisadoEmpleado: false });
    });

    await batch.commit();
    console.log(`Registros del empleado ${idEmpleado} marcados como avisados.`);
  }
}
