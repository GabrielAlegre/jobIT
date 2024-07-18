import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime, firstValueFrom, tap, timer } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { CardPublicacionComponent } from '../../../core/components/card-publicacion/card-publicacion.component';
import { EEstadoPublicacion } from '../../../core/enums/estado-publicacion.enum';
import { EEstadoRegistro } from '../../../core/enums/estado-registro.enum';
import { EExperiencia } from '../../../core/enums/experiencia.enum';
import { EFormasDeTrabajo } from '../../../core/enums/formas-de-trabajo.enum';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { IExperiencia } from '../../../core/interfaces/experiencia.interface';
import { IFiltro } from '../../../core/interfaces/filtro.interface';
import { IPublicacion } from '../../../core/interfaces/publicacion.interface';
import { IRegistro } from '../../../core/interfaces/registro.interface';
import { FiltroCheckboxesEnums } from '../../../core/pipes/filtro-checkboxes-enums.pipe';
import { FiltroTituloDescripcionPipe } from '../../../core/pipes/filtro-titulo-descripcion.pipe';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { RegistroService } from '../../../core/services/registro.service';

import { ENivel } from '../../../core/enums/nivel.enum';
import { ETiempoDeTrabajo } from '../../../core/enums/tiempo-de-trabajo.enum';
import { EstadoRegistroPipe } from '../../../core/pipes/estado-registro.pipe';
import { TCheckboxesEnums } from '../../../core/types/checkboxes-enums.type';
import { RouterService } from '../../../shared/services/router.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
    selector: 'empleados-publicaciones',
    standalone: true,
    imports: [
        CommonModule,
        CardPublicacionComponent,
        ReactiveFormsModule,
        FiltroTituloDescripcionPipe,
        FiltroCheckboxesEnums,
        EstadoRegistroPipe
    ],
    providers: [TitleCasePipe],
    templateUrl: './publicaciones.page.html',
    styleUrl: './publicaciones.page.scss'
})
export default class PublicacionesPage implements OnInit, OnDestroy {

    @Input() experiencia?: EExperiencia;

    private readonly toastSrv = inject(ToastService);
    private readonly routerSrv = inject(RouterService);
    private readonly authSrv = inject(AuthService);
    private readonly publicacionSrv = inject(PublicacionesService);
    private readonly registroSrv = inject(RegistroService);
    private readonly formBuilder = inject(FormBuilder);
    tituloODescripcion: string = '';
    publicaciones: IPublicacion[] = [];
    usuario?: IEmpleado;
    experienciaRender: IExperiencia[] = [];
    registros: IRegistro[] = [];

    formFiltro: FormGroup = this.formBuilder.group<IFiltro>({ filtro: '' });

    formFormasDeTrabajo: FormGroup = this.formBuilder.group<TCheckboxesEnums<EFormasDeTrabajo>>(
        { hibrido: true, local: true, remoto: true }
    );
    formasDeTrabajo: string[] = Object.keys(EFormasDeTrabajo);
    formasDeTrabajoSeleccionadas?: TCheckboxesEnums<EFormasDeTrabajo>;

    formNiveles: FormGroup = this.formBuilder.group<TCheckboxesEnums<ENivel>>(
        { trainee: true, junior: true, semiSenior: true, senior: true }
    );
    niveles: string[] = Object.keys(ENivel);
    nivelSeleccionados?: TCheckboxesEnums<ENivel>;

    formTiemposDeTrabajo: FormGroup = this.formBuilder.group<TCheckboxesEnums<ETiempoDeTrabajo>>(
        { fullTime: true, partTime: true }
    );
    tiemposDeTrabajo: string[] = Object.keys(ETiempoDeTrabajo);
    tiemposDeTrabajosSeleccionados?: TCheckboxesEnums<ETiempoDeTrabajo>;

    provincias: string[] = [];
    provinciasSeleccionadas?: TCheckboxesEnums<any>;
    formProvincias?: FormGroup;

    localidades: string[] = [];
    localidadesSeleccionadas?: TCheckboxesEnums<any>;
    formLocalidades?: FormGroup;

    areasDeTrabajo: string[] = [];
    areasDeTrabajoSeleccionadas?: TCheckboxesEnums<any>;
    formAreasDeTrabajo?: FormGroup;

    estadosDeSolicitud: EEstadoRegistro[] = [];
    estadoDeSolicitudSeleccionadas?: TCheckboxesEnums<any>;
    formEstadoDeSolicitud?: FormGroup;

    private subscriberFiltro?: Subscription;
    private subscriberFormasDeTrabajo?: Subscription;
    private subscriberNiveles?: Subscription;
    private subscriberTiemposDeTrabajo?: Subscription;
    private subscriberProvincia?: Subscription;
    private subscriberLocalidad?: Subscription;
    private subscriberAreadDeTrabajo?: Subscription;
    private subscriberEstadoDeSolicitud?: Subscription;

    async ngOnInit(): Promise<void> {
        await this.getUsuarioLogeado();
        await this.getPublicacionesActivas();
        await this.getRegistros();
        //TODO: hacerlo dependiente de suceso y no de tiempo
        await firstValueFrom(timer(1).pipe(
            tap(() => {
                this.getProvincias();
                this.getLocalidades();
                this.getAreasDeTrabajo();
                this.getEstadosDeSolicitud();
            })
        ));
        this.filtros();
    }

    ngOnDestroy(): void {
        this.subscriberFiltro?.unsubscribe();
        this.subscriberFormasDeTrabajo?.unsubscribe();
        this.subscriberNiveles?.unsubscribe();
        this.subscriberTiemposDeTrabajo?.unsubscribe();
        this.subscriberProvincia?.unsubscribe();
        this.subscriberLocalidad?.unsubscribe();
        this.subscriberAreadDeTrabajo?.unsubscribe();
        this.subscriberEstadoDeSolicitud?.unsubscribe();
    }

    private async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }
        this.usuario = usuario as IEmpleado;
    }

    private async getPublicacionesActivas(): Promise<void> {
        await this.publicacionSrv.getTodos([{ campo: 'estado', opcion: '==', valor: EEstadoPublicacion.activa }])
            .then(publicaciones => {
                this.publicaciones = publicaciones.map((publicacion) =>
                    ({ ...publicacion, areaDeTrabajo: (publicacion.areaDeTrabajo as any).nombre }));
            })
            .catch(error => {
                console.error(error);
                this.toastSrv.error('Al momento de traer las publicaciones');
            });
    }

    private async getRegistros(): Promise<void> {
        if (!this.usuario) { return; }
        const registros = await this.registroSrv.getTodos([
            { campo: 'idEmpleado', opcion: '==', valor: this.usuario.id }
        ]);
        this.registros = registros ? registros : [];

        console.log(registros);
        this.registros.forEach(async ({ estado, idPublicacion }) => {
            console.log(estado);
            if (estado == "aceptadoEmpleado") {
                await this.publicacionSrv.getPorId(idPublicacion)
                    .then(publicacion => {
                        if (!publicacion?.idEmpresa) {
                            throw new Error('No se pudo recuperar dentro del then...');
                        }
                        this.publicaciones.push(publicacion);
                    })
                    .catch(error => {
                        console.error(error);
                        this.toastSrv.error('Al momento de traer las publicaciones');
                    });
            }
            this.publicaciones = this.publicaciones.map((publicacion) => {
                if (idPublicacion == publicacion.id) {
                    return { ...publicacion, estadoRegistro: estado };
                }
                return { ...publicacion };
            });
        });

        this.publicaciones = this.publicaciones.map((publicacion) => {
            if (publicacion.estadoRegistro) { return publicacion; }
            return { ...publicacion, estadoRegistro: EEstadoRegistro.sinAplicar };
        });
    }

    private getProvincias(): void {
        this.provincias = this.publicaciones.map(({ provincia }) => String(provincia));
        this.provincias = [... new Set(this.provincias)];
        this.formProvincias = this.formBuilder.group(this.crearCheckboxControls(this.provincias));
    }

    private getLocalidades(): void {
        this.localidades = this.publicaciones.map(({ localidad }) => String(localidad));
        this.localidades = [... new Set(this.localidades)];
        this.formLocalidades = this.formBuilder.group(this.crearCheckboxControls(this.localidades));
    }

    private getAreasDeTrabajo(): void {
        this.areasDeTrabajo = this.publicaciones.map(({ areaDeTrabajo }) => String(areaDeTrabajo));
        this.areasDeTrabajo = [... new Set(this.areasDeTrabajo)];
        this.formAreasDeTrabajo = this.formBuilder.group(this.crearCheckboxControls(this.areasDeTrabajo));
    }

    private getEstadosDeSolicitud(): void {
        this.estadosDeSolicitud = this.registros
            .map(({ estado }) => estado);
        this.estadosDeSolicitud.push(EEstadoRegistro.sinAplicar);
        this.estadosDeSolicitud = [... new Set(this.estadosDeSolicitud)];
        this.formEstadoDeSolicitud = this.formBuilder.group(this.crearCheckboxControls(this.estadosDeSolicitud));
    }

    private crearCheckboxControls(array: string[]): TCheckboxesEnums<any> {
        const controls: any = {};
        array.forEach((key: any) => {
            controls[key] = new FormControl(true);
        });
        return controls;
    }

    getEstadoPostulacion(idPublicacion: string): EEstadoRegistro | undefined {
        return this.registros.find(reg => reg.idPublicacion === idPublicacion)?.estado;
    }

    formControlNameFiltro(campo: keyof IFiltro): keyof IFiltro {
        return campo;
    }

    getFormFiltro(campo: keyof IFiltro) {
        return this.formFiltro.get(campo);
    }

    private filtros(): void {
        this.subscriberFiltro = this.getFormFiltro('filtro')?.valueChanges.pipe(debounceTime(3000))
            .subscribe((filtro: string) => {
                this.tituloODescripcion = filtro?.toLowerCase();
            });

        this.subscriberFormasDeTrabajo = this.formFormasDeTrabajo.valueChanges
            .subscribe(value => {
                this.formasDeTrabajoSeleccionadas = value;
            });

        this.subscriberNiveles = this.formNiveles.valueChanges
            .subscribe(value => {
                this.nivelSeleccionados = value;
            });

        this.subscriberTiemposDeTrabajo = this.formTiemposDeTrabajo.valueChanges
            .subscribe(value => {
                this.tiemposDeTrabajosSeleccionados = value;
            });

        this.subscriberProvincia = this.formProvincias?.valueChanges
            .subscribe(value => {
                this.provinciasSeleccionadas = value;
            });

        this.subscriberLocalidad = this.formLocalidades?.valueChanges
            .subscribe(value => {
                this.localidadesSeleccionadas = value;
            });

        this.subscriberAreadDeTrabajo = this.formAreasDeTrabajo?.valueChanges
            .subscribe(value => {
                this.areasDeTrabajoSeleccionadas = value;
            });

        this.subscriberEstadoDeSolicitud = this.formEstadoDeSolicitud?.valueChanges
            .subscribe(value => {
                this.estadoDeSolicitudSeleccionadas = value;
            });
    }
}
