import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { ToastService } from '../../../shared/services/toast.service';
import { EEstadoRegistro } from '../../enums/estado-registro.enum';
import { IPublicacion } from '../../interfaces/publicacion.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { TTodosLosUsuarios } from '../../types/todos-los-usuarios.type';
import { ETipoDeUsuario } from '../../enums/tipo-de-usuario.enum';

@Component({
    selector: 'core-card-publicacion',
    standalone: true,
    imports: [RouterModule, RutaValidaPipe, CommonModule],
    templateUrl: './card-publicacion.component.html',
    styleUrl: './card-publicacion.component.scss'
})
export class CardPublicacionComponent implements OnInit {

    private readonly toastSrv = inject(ToastService);
    private readonly authSrv = inject(AuthService);
    @Input() publicacion?: IPublicacion;
    @Input() estado?: EEstadoRegistro;
    usuario?: TTodosLosUsuarios;
    EEstadoRegistro = EEstadoRegistro;

    async ngOnInit(): Promise<void> {
        if (!this.publicacion) {
            const msg = 'Problemas con la publicación';
            this.toastSrv.error(msg);
            throw new Error(msg);
        }
        await this.getUsuarioLogeado();
    }

    async getUsuarioLogeado(): Promise<void> {
        this.usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!this.usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            return;
        }
    }

    obtenerMensajeEstado(): string | null {
        if (this.usuario?.tipo === ETipoDeUsuario.empresa || this.usuario?.tipo === ETipoDeUsuario.admin) {
            return null;
        } else {
            switch (this.estado) {
                case EEstadoRegistro.aplicado:
                    return '¡Ya has aplicado!';
                case EEstadoRegistro.visto:
                    return 'Tu postulación fue vista';
                case EEstadoRegistro.aceptadoEmpresa:
                    return '¡Fuiste aceptado!';
                case EEstadoRegistro.aceptadoEmpleado:
                    return '¡Has aceptado el empleo!';
                case EEstadoRegistro.rechazadoEmpleado:
                    return 'Has rechazado el empleo';
                default:
                    return null;
            }
        }
    }
}
