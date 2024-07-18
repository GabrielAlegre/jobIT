import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom } from 'rxjs';
import { UsuariosService } from '../../core/services/usuarios.service';
import { TTodosLosUsuarios } from '../../core/types/todos-los-usuarios.type';
import { SpinnerService } from '../../shared/services/spinner.service';
import { ToastService } from '../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly auth = inject(AngularFireAuth);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly toastSrv = inject(ToastService);
    private readonly spinnerSrv = inject(SpinnerService);

    async iniciarSesion(email: string, pass: string) {
        return await this.auth.signInWithEmailAndPassword(email, pass);
    }

    async cerrarSession() {
        return await this.auth.signOut();
    }

    async registrarse(email: string, pass: string) {
        return await this.auth.createUserWithEmailAndPassword(email, pass);
    }

    async recuperarCuenta(email: string) {
        return await this.auth.sendPasswordResetEmail(email);
    }

    usuarioLogeadoAuthObservable() {
        return this.auth.authState;
    }

    async usuarioLogeadoAuth() {

        return await firstValueFrom(this.usuarioLogeadoAuthObservable());
    }

    async usuarioLogeadoBBDD(): Promise<TTodosLosUsuarios | undefined> {
        const usuarioAuth = await this.usuarioLogeadoAuth();

        if (!usuarioAuth) { return undefined; }

        const usuario = await this.usuariosSrv.getPorId(usuarioAuth.uid)
            .then((usuario) => usuario)
            .catch((error: unknown) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al traer los datos del usuario');
                return undefined;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });

        return usuario;
    }
}
