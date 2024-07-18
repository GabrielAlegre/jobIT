import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { EEstadoPago } from '../../../core/enums/estado-pago.enum';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { IPack } from '../../../core/interfaces/pack.interface';
import { IPago } from '../../../core/interfaces/pago.interface';
import { ITarjeta } from '../../../core/interfaces/tarjeta.interface';
import { PacksService } from '../../../core/services/packs.service';
import { PagosService } from '../../../core/services/pagos.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'empresas-comprar-pack',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule, RutaValidaPipe],
    templateUrl: './comprar-pack.page.html',
    styleUrl: './comprar-pack.page.scss'
})
export default class ComprarPackPage implements OnInit {

    private readonly toastSrv = inject(ToastService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly packsSrv = inject(PacksService);
    private readonly pagosSrv = inject(PagosService);
    packs?: IPack[];
    empresa?: IEmpresa;
    selectedPack?: IPack;
    selectedTarjeta?: ITarjeta;
    tienePacksActivo?: boolean;

    async ngOnInit(): Promise<void> {
        // this.toastSrv.warning('trabajando...');

        await this.getUsuarioLogeado();

        this.packs = await this.packsSrv.getTodos([])
            .finally(() => {
                this.spinnerSrv.ocultar();
            });

        this.tienePacksActivo = this.ultimoPackConPublicacionesRestantes();
    }

    async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }

        this.empresa = usuario as IEmpresa;

        if (!this.empresa?.tarjetas || this.empresa.tarjetas?.length == 0) {
            this.toastSrv.warning('Usted aun no tiene tarjetas cargadas');
            await this.routerSrv.navigateByUrl('mis-tarjetas/agregar-tarjeta');
            return;
        }
    }

    async comprarPack(): Promise<void> {
        if (!this.selectedPack || !this.selectedTarjeta) {
            this.toastSrv.warning('Debe seleccionar un pack y una tarjeta antes de continuar');
            return;
        }

        try {
            if (this.empresa && this.selectedPack && this.selectedTarjeta) {
                this.selectedPack.cantidadDePublicacionesRestantes = this.selectedPack?.cantidadDePublicaciones;
                if (!this.empresa.packs) {
                    // Si this.empresa.packs es undefined, crea un nuevo arreglo y agrega el pack seleccionado
                    this.empresa.packs = [this.selectedPack];
                } else {
                    // Si this.empresa.packs ya existe, simplemente agrega el pack seleccionado al arreglo existente
                    this.empresa.packs.push(this.selectedPack);
                }

                console.log(this.empresa);

                await this.usuarioSrv.actualizar(this.empresa).then(
                    async () => {
                        await this.guardarPago();
                        this.toastSrv.success('Compra realizada con éxito');
                        this.routerSrv.navigateByUrl('/mis-packs/listar-packs');
                    }
                );
            }
        } catch (error) {
            console.error(error);
            this.toastSrv.error('Ha ocurrido un error al intentar guardar los cambios');
        } finally {
            this.spinnerSrv.ocultar();
        }
    }

    async guardarPago(): Promise<void> {

        const pago: IPago = {
            idTarjeta: this.selectedTarjeta?.id?.toString(),
            idUsuario: this.empresa?.id?.toString(),
            precio: Number(this.selectedPack?.precio),
            numeroDeTarjeta: this.selectedTarjeta?.numero.toString(),
            estado: EEstadoPago.aceptado,
            fecha: new Date(),
            descripcion: `Pago de pack: ${this.selectedPack?.nombre}`,
        };
        try {
            await this.pagosSrv.guardar(pago);
            console.log('Pago guardado correctamente');
        } catch (error) {
            console.error('Error al guardar el pago', error);
            this.toastSrv.error('Ha ocurrido un error al guardar el pago');
        }
    }

    ultimoPackConPublicacionesRestantes(): boolean {
        if (this.empresa && this.empresa.packs && this.empresa.packs.length > 0) {
            return Number(this.empresa.packs[this.empresa.packs.length - 1].cantidadDePublicacionesRestantes) > 0;
        }
        return false;
    }

    selectPack(pack: IPack): void {
        this.selectedPack = this.selectedPack === pack ? undefined : pack;
    }

    selectTarjeta(tarjeta: ITarjeta): void {
        this.selectedTarjeta = this.selectedTarjeta === tarjeta ? undefined : tarjeta;
    }

}
