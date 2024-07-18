import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { EExperiencia } from '../../../core/enums/experiencia.enum';
import { ETipoDeUsuario } from '../../../core/enums/tipo-de-usuario.enum';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IExperiencia } from '../../../core/interfaces/experiencia.interface';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { ModalService } from '../../../shared/services/modal.service';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TExperiencia } from '../../types/experiencia.type';

@Component({
    selector: 'empleado-listar-experiencias',
    standalone: true,
    imports: [CommonModule, RutaValidaPipe, RouterModule],
    providers: [TitleCasePipe],
    templateUrl: './listar-experiencias.page.html',
    styleUrl: './listar-experiencias.page.scss'
})
export default class ListarExperienciasPage implements OnInit {

    @Input() experiencia?: EExperiencia;
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly routeSrv = inject(ActivatedRoute);
    private readonly title = inject(Title);
    private readonly capitalice = inject(TitleCasePipe);
    private readonly authSrv = inject(AuthService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly modalSrv = inject(ModalService);
    experienciaRender: IExperiencia[] = [];
    usuario!: IEmpleado;
    indexExperiencia: number = -1;
    experienciaNombre?: TExperiencia;

    async ngOnInit(): Promise<void> {

        this.routeSrv.params.subscribe(async ({ experiencia }) => {
            this.experiencia = experiencia;
            await this.cambioDePagina();
        });
    }

    async cambioDePagina(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario || usuario.tipo != ETipoDeUsuario.empleado) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }

        this.usuario = usuario as IEmpleado;

        const title = `${this.title.getTitle()} ${this.capitalice.transform(this.experiencia)}`;

        if (this.experiencia == EExperiencia.estudio) {
            this.title.setTitle(title);
        } else if (this.experiencia == EExperiencia.trabajo) {
            this.title.setTitle(title);
        } else {
            this.toastSrv.error('No es una experiencia válida');
            await this.routerSrv.navigateByUrl('/mi-informacion');
            return;
        }

        const largoExperiencia = this.experiencia.length;
        this.experienciaNombre = `experienciaDe${this.experiencia[0].toUpperCase()}${this.experiencia.substring(1, largoExperiencia)}` as TExperiencia;
    }


    async eliminarExperiencia(experiencia: IExperiencia): Promise<void> {
        if (!this.usuario) { return; }
        if (!this.experienciaNombre) { return; }
        if (!(await this.modalSrv.confirm('¿Realmente quiere eliminar?'))) { return; }

        const experiencias = this.usuario[this.experienciaNombre]?.filter(({ id }) => id != experiencia.id);
        this.usuario[this.experienciaNombre] = experiencias;

        this.usuarioSrv.actualizar(this.usuario)
            .then(async () => {
                await this.cambioDePagina();
                this.toastSrv.info(`Se eliminó la experiencia de ${this.experiencia}`);
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error(`Ha ocurrido un error al eliminar la experiencia de ${this.experiencia}`);
            })
            .finally(async () => {
                this.spinnerSrv.ocultar();
                await this.routerSrv.navigateByUrl(`/mi-informacion/listar/${this.experiencia}` as any);
            });
    }

}
