import { Injectable, inject } from '@angular/core';
import { collection, Firestore, getDocs, query, where, setDoc, updateDoc, doc, DocumentData, writeBatch, getDoc } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { IFirebaseFiltro } from '../../shared/interfaces/firebase-filtro.interface';
import { CrudService } from '../../shared/services/crud.service';
import { TFirebaseColeccion } from '../../shared/types/firebase-coleccion.type';
import { IRegistro } from '../interfaces/registro.interface';
import { Subject } from 'rxjs';
import { EEstadoRegistro } from "../enums/estado-registro.enum";
import { NotificacionregistroService } from './notificacionregistro.service';

@Injectable({
    providedIn: 'root'
})
export class RegistroService {

    private readonly firebase = inject(Firestore);
    private readonly coleccion: TFirebaseColeccion = collection(this.firebase, environment.colecciones.registro);
    private readonly crud = inject(CrudService<IRegistro>);

    private registroGuardadoSubject = new Subject<IRegistro>();
    registroGuardado$ = this.registroGuardadoSubject.asObservable();

    private registroAceptadoSubject = new Subject<IRegistro>();
    registroAceptado$ = this.registroAceptadoSubject.asObservable();

    constructor(private notificacionregistroSrv: NotificacionregistroService) { }

    async getPorId(id: string): Promise<IRegistro> {
        return await this.crud.getPorId(this.coleccion, id);
    }

    async getUno(filtros: IFirebaseFiltro<IRegistro>[] = [],
        ordenarPor: keyof IRegistro | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IRegistro> {
        return await this.crud.getUno(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async getTodos(filtros: IFirebaseFiltro<IRegistro>[],
        ordenarPor: keyof IRegistro | 'SIN_ORDENAR' = 'SIN_ORDENAR',
        ordenamiento: 'asc' | 'desc' = 'asc')
        : Promise<IRegistro[]> {
        return await this.crud.getTodos(this.coleccion, filtros, ordenarPor, ordenamiento);
    }

    async actualizar(usuario: IRegistro): Promise<true> {
        const docRef = doc(this.coleccion, usuario.id);
        await this.crud.actualizar(this.coleccion, usuario);

        if (usuario.estado === EEstadoRegistro.aceptadoEmpresa) {
            this.registroAceptadoSubject.next(usuario);
            await this.notificacionregistroSrv.handleRegistroAceptado(usuario);
        }

        return true;
    }

    async eliminarPorId(id: string): Promise<boolean> {
        return await this.crud.eliminarPorId(this.coleccion, id);
    }

    async guardar(usuario: IRegistro): Promise<IRegistro> {
        console.log('Guardando registro:', usuario);

        const q = query(this.coleccion, where('idPublicacion', '==', usuario.idPublicacion), where('idEmpleado', '==', usuario.idEmpleado));
        const existingDocs = await getDocs(q);

        let registroGuardado: IRegistro;

        if (!existingDocs.empty) {
            const existingDocRef = existingDocs.docs[0].ref;
            await updateDoc(existingDocRef, {
                ...usuario,
                avisadoEmpleado: usuario.estado === EEstadoRegistro.aceptadoEmpresa ? false : usuario.avisadoEmpleado,
                avisadoEmpresa: usuario.estado === EEstadoRegistro.aplicado ? true : usuario.avisadoEmpresa
            });
            const updatedDoc = await getDoc(existingDocRef);
            registroGuardado = updatedDoc.data() as IRegistro;
        } else {
            const docRef = doc(this.coleccion);
            await setDoc(docRef, usuario);
            const registroGuardadoSnapshot = await getDoc(docRef);
            registroGuardado = registroGuardadoSnapshot.data() as IRegistro;
        }

        console.log('Registro guardado:', registroGuardado);

        if (registroGuardado?.estado === EEstadoRegistro.aplicado) {
            console.log('Emitir evento registro guardado');
            this.registroGuardadoSubject.next(registroGuardado);
            await this.notificacionregistroSrv.handleRegistroGuardado(registroGuardado);
        } else if (registroGuardado?.estado === EEstadoRegistro.aceptadoEmpresa) {
            console.log('Emitir evento registro aceptado');
            this.registroAceptadoSubject.next(registroGuardado);
            await this.notificacionregistroSrv.handleRegistroAceptado(registroGuardado);
        }

        return registroGuardado;
    }

    async contarPostulantesPorPublicacion(idPublicacion: string): Promise<number> {
        const q = query(
            this.coleccion,
            where('idPublicacion', '==', idPublicacion),
            where('estado', 'in', [EEstadoRegistro.aplicado, EEstadoRegistro.aceptadoEmpleado]),
            where('avisadoEmpresa', '==', false)
        );
        const snapshot = await getDocs(q);
        console.log('Snapshot size:', snapshot.size);
        return snapshot.size;
    }

    async marcarRegistrosComoAvisados(idPublicacion: string): Promise<void> {
        const q = query(
            this.coleccion,
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
            this.coleccion,
            where('idEmpleado', '==', idEmpleado),
            where('estado', '==', EEstadoRegistro.aceptadoEmpresa),
            where('avisadoEmpleado', '==', false)
        );
        const snapshot = await getDocs(q);
        const batch = writeBatch(this.firebase);

        snapshot.forEach(doc => {
            const docRef = doc.ref;
            batch.update(docRef, { avisadoEmpleado: true });
        });

        await batch.commit();
        console.log(`Registros del empleado ${idEmpleado} marcados como avisados.`);
    }
}
