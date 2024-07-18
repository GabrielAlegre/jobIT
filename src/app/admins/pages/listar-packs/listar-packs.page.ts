import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IPack } from '../../../core/interfaces/pack.interface';
import { PacksService } from '../../../core/services/packs.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { ModalService } from '../../../shared/services/modal.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'admins-listar-packs',
    standalone: true,
    imports: [CommonModule, RouterModule, RutaValidaPipe],
    templateUrl: './listar-packs.page.html',
    styleUrl: './listar-packs.page.scss'
})
export default class ListarPacksPage implements OnInit {

    private readonly packsSrv = inject(PacksService);
    private readonly toastSrv = inject(ToastService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly modalSrv = inject(ModalService);
    packs?: IPack[];

    async ngOnInit(): Promise<void> {
        await this.traerPacks();
    }

    async traerPacks(): Promise<void> {
        this.packs = await this.packsSrv.getTodos([], 'fecha', 'asc')
            .catch((error: Error) => {
                this.toastSrv.error('No se pudo traer los packs');
                console.error(error);
                return undefined;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

    async eliminarPack(pack: IPack): Promise<void> {
        if (!(await this.modalSrv.confirm('¿Realmente quiere eliminar?'))) { return; }
        await this.packsSrv.eliminarPorId(pack.id as string)
            .then(async () => {
                this.toastSrv.success('Se ha eliminado el pack');
                await this.traerPacks();
            })
            .catch((error: Error) => {
                this.toastSrv.error('No se pudo eliminar el pack');
                console.error(error);
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

}
