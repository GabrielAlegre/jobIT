import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { InicioAdminComponent } from "../../components/homes/inicio-admin/inicio-admin.component";
import { InicioDefaultComponent } from "../../components/homes/inicio-default/inicio-default.component";
import { InicioEmpleadoComponent } from "../../components/homes/inicio-empleado/inicio-empleado.component";
import { InicioEmpresaComponent } from "../../components/homes/inicio-empresa/inicio-empresa.component";
import { ETipoDeUsuario } from '../../enums/tipo-de-usuario.enum';
import { ICardsDeInicio } from '../../interfaces/cards-de-inicio.interface';
import { IEstadistica } from '../../interfaces/estadistica.interface';
import { CardsDeInicioService } from '../../services/cards-de-inicio.service';
import { EstadisticasService } from '../../services/estadisticas.service';
import { TTodosLosUsuarios } from '../../types/todos-los-usuarios.type';

@Component({
    selector: 'core-home',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe, ReactiveFormsModule, InicioDefaultComponent, InicioEmpresaComponent, InicioEmpleadoComponent, InicioAdminComponent],
    templateUrl: './home.page.html',
    styleUrl: './home.page.scss'
})
export default class HomePage implements OnInit {

    private readonly cardsDeInicioSrv = inject(CardsDeInicioService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly estadisticasSrv = inject(EstadisticasService);
    private readonly toastSrv = inject(ToastService);
    private readonly authSrv = inject(AuthService);
    usuario?: TTodosLosUsuarios;
    estadistica: IEstadistica | undefined;
    ETipoDeUsuario = ETipoDeUsuario;
    cards: ICardsDeInicio[] = [];

    async ngOnInit(): Promise<void> {
        await this.obtenerEstadisticas();
        await this.getUsuarioLogeado();
    }

    async getUsuarioLogeado(): Promise<void> {
        this.usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!this.usuario) {
            console.log("Sin sesión activa");
            return;
        }
    }

    async obtenerEstadisticas() {
        await this.estadisticasSrv.getUno().then((estadistica) => {
            this.estadistica = estadistica;
        }).catch(async (error) => {
            await this.estadisticasSrv.guardar({
                visitas: 0,
                usuarios: []
            });
        })
            .finally(async () => {
                this.spinnerSrv.ocultar();
            });
    }
}
