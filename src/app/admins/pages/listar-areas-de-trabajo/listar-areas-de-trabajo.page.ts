import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EEstadoAreaDeTRabajo } from '../../../core/enums/estado-area-de-trabajo.enum';
import { IAreaDeTrabajo } from '../../../core/interfaces/area-de-trabajo.interface';
import { AreasDeTrabajoService } from '../../../core/services/areas-de-trabajo.service';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { ModalService } from '../../../shared/services/modal.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'admins-listar-areas-de-trabajo',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe],
    templateUrl: './listar-areas-de-trabajo.page.html',
    styleUrl: './listar-areas-de-trabajo.page.scss'
})
export default class ListarAreasDeTrabajoPage implements OnInit {

    private readonly areasSrv = inject(AreasDeTrabajoService);
    private readonly publicacionesSrv = inject(PublicacionesService);
    private readonly toastSrv = inject(ToastService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly modalSrv = inject(ModalService);
    areas?: IAreaDeTrabajo[];
    estadoArea = EEstadoAreaDeTRabajo;

    async ngOnInit(): Promise<void> {
        await this.traerAreas();
    }

    async traerAreas(): Promise<void> {
        this.areas = await this.areasSrv.getTodos([], 'nombre', 'asc')
            .catch((error: Error) => {
                this.toastSrv.error('No se pudo traer las areas de trabajo');
                console.error(error);
                return undefined;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
        console.log({ area: this.areas });
    }

    async pausarArea(area: IAreaDeTrabajo): Promise<void> {
        if (area.estado == EEstadoAreaDeTRabajo.activa) {
            area.estado = EEstadoAreaDeTRabajo.pausada;
        } else if (area.estado == EEstadoAreaDeTRabajo.pausada) {
            area.estado = EEstadoAreaDeTRabajo.activa;
        }
        await this.areasSrv.guardar(area)
            .then(() => {
                this.toastSrv.info('Se guardaron los cambios');
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar guardar los cambios');
            })
            .finally(async () => {
                this.spinnerSrv.ocultar();
            });
    }

    async eliminarArea(area: IAreaDeTrabajo): Promise<void> {

        const publicaciones = await this.publicacionesSrv
            .getTodos([{ campo: 'areaDeTrabajo', opcion: '==', 'valor': area }]);

        const msg = publicaciones.length > 0
            ? 'Al eliminar esta area, eliminará las publicaciones que la utilicen. ¿ Realmente quiere eliminar el area y las publicaciones ?'
            : 'Realmente quiere eliminar';

        if (!(await this.modalSrv.confirm(msg))) {
            this.spinnerSrv.ocultar();
            return;
        }

        publicaciones.forEach(async (publicacion) => {
            // TODO: promise all
            await this.publicacionesSrv.eliminarPorId(publicacion.id!)
                .catch(error => {
                    console.error(error);
                    this.toastSrv.error('Error al eliminar la publicación');
                });
        });

        await this.areasSrv.eliminarPorId(area.id as string)
            .then(async () => {

                const msg2 = publicaciones.length > 0
                    ? 'Se ha eliminado el area de trabajo y las publicaciones'
                    : 'Se ha eliminado el area de trabajo';

                this.toastSrv.success(msg2);

                await this.traerAreas();
            })
            .catch((error: Error) => {
                this.toastSrv.error('No se pudo eliminar el area de trabajo');
                console.error(error);
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }
}
