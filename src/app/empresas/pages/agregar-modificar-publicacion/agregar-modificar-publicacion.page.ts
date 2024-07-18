import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { EEstadoAreaDeTRabajo } from '../../../core/enums/estado-area-de-trabajo.enum';
import { EEstadoPublicacion } from '../../../core/enums/estado-publicacion.enum';
import { EFormasDeTrabajo } from '../../../core/enums/formas-de-trabajo.enum';
import { ENivel } from '../../../core/enums/nivel.enum';
import { ETiempoDeTrabajo } from '../../../core/enums/tiempo-de-trabajo.enum';
import { IAreaDeTrabajo } from '../../../core/interfaces/area-de-trabajo.interface';
import { IEmpresa } from '../../../core/interfaces/empresa.interface';
import { IPublicacion } from '../../../core/interfaces/publicacion.interface';
import { AreasDeTrabajoService } from '../../../core/services/areas-de-trabajo.service';
import { GeoRefService } from '../../../core/services/geo-ref.service';
import { PublicacionesService } from '../../../core/services/publicaciones.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';

@Component({
    selector: 'empresas-agregar-modificar-publicacion',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RouterModule, RutaValidaPipe],
    templateUrl: './agregar-modificar-publicacion.page.html',
    styleUrl: './agregar-modificar-publicacion.page.scss'
})
export default class AgregarModificarPublicacionPage {

    private readonly formBuilder = inject(FormBuilder);
    private readonly toastSrv = inject(ToastService);
    private readonly validadorSrv = inject(ValidadorService);
    private readonly authSrv = inject(AuthService);
    private readonly routerSrv = inject(RouterService);
    private readonly usuarioSrv = inject(UsuariosService);
    private readonly publicacionSrv = inject(PublicacionesService);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly areasSrv = inject(AreasDeTrabajoService);
    private readonly geoRefSrv = inject(GeoRefService);

    readonly formasDeTrabajo: EFormasDeTrabajo[] = Object.values(EFormasDeTrabajo);
    readonly niveles: ENivel[] = Object.values(ENivel);
    readonly tiempoDeTrabajo: ETiempoDeTrabajo[] = Object.values(ETiempoDeTrabajo);

    empresa?: IEmpresa;
    puedePublicar?: Boolean;
    titulo: 'Publicar' | 'Actualizar' = 'Publicar';
    publicacion?: IPublicacion;
    areas?: IAreaDeTrabajo[];
    areasVisibles?: IAreaDeTrabajo[];
    provincias?: string[];
    localidades?: string[];

    @Input() id?: string;

    form: FormGroup = this.formBuilder.group<IPublicacion>({
        title: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ],
            asyncValidators: []
        }],
        description: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(1000),
            ],
            asyncValidators: []
        }],
        formasDeTrabajo: [EFormasDeTrabajo.hibrido, {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.min(10),
                Validators.max(1000000),
            ],
            asyncValidators: []
        }],
        areaDeTrabajo: [{ nombre: '', id: undefined }, {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        provincia: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        localidad: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        domicilio: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
            ],
            asyncValidators: []
        }],
        tiempoDeTrabajo: [ETiempoDeTrabajo.partTime, {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
        salario: [0, {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.min(1),
                Validators.max(9999999999999999),
            ],
            asyncValidators: []
        }],
        nivel: [ENivel.trainee, {
            updateOn: 'submit',
            validators: [
                Validators.required,
            ],
            asyncValidators: []
        }],
    });

    async ngOnInit(): Promise<void> {

        await this.getUsuarioLogeado();
        this.puedePublicar = this.validarQueTengaPackActivo();

        if (!this.puedePublicar) { return; }

        await this.traerProvincias();
        await this.traerAreas();

        if (this.areas) {
            this.getForm('areaDeTrabajo')?.setValue(this.areas[0].id);
        }

        if (!this.id) { return; };

        this.publicacion = await this.publicacionSrv.getPorId(this.id)
            .then(publicacion => {
                if (!publicacion.title) {
                    throw new Error('No se pudo recuperar dentro del then...');
                }
                if (publicacion.idEmpresa != this.empresa?.id) {
                    throw new Error('La publicacicón no es de esta empresa');
                }
                this.titulo = 'Actualizar';
                return publicacion;
            })
            .catch(async (error: Error) => {
                this.toastSrv.error('No se pudo recuperar la información del publicacion');
                console.error(error);
                await this.routerSrv.navigateByUrl('/mis-publicaciones/listar-publicaciones');
                return undefined;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });


        await this.traerLocalidades(String(this.publicacion?.provincia));

        this.form?.reset({ ...this.publicacion });
        const idAreaDeTrabajo = (this.publicacion?.areaDeTrabajo as IAreaDeTrabajo).id;

        const elAreaEstaPausada = !this.areasVisibles?.some((({ id }) => id == idAreaDeTrabajo));
        if (elAreaEstaPausada) {
            this.areasVisibles?.push(this.publicacion?.areaDeTrabajo as IAreaDeTrabajo);
        }
        this.getForm('areaDeTrabajo')?.setValue(idAreaDeTrabajo);

    }


    getForm(campo: keyof IPublicacion) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IPublicacion): keyof IPublicacion {
        return campo;
    }

    messageError(field: keyof IPublicacion, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    empresaTieneDatosCargados(empresa: IEmpresa): boolean {
        return !!(
            empresa.nombre &&
            empresa.cuit &&
            empresa.telefono &&
            empresa.provincia &&
            empresa.localidad &&
            empresa.pathFoto &&
            empresa.domicilio
        );
    }

    validarQueTengaPackActivo(): boolean {
        if (this.empresa && this.empresa.packs && this.empresa.packs.length > 0) {
            return Number(this.empresa.packs.at(-1)?.cantidadDePublicacionesRestantes) > 0;
        }
        return false;
    }

    async traerProvincias(): Promise<void> {
        this.spinnerSrv.mostrar();
        this.provincias = await this.geoRefSrv.getProvincias()
            .catch((error) => {
                console.error(error);
                this.toastSrv.error(error.toString());
                return [];
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

    async traerLocalidades(provincia: string): Promise<void> {
        this.spinnerSrv.mostrar();
        this.localidades = await this.geoRefSrv.getLocalidades(provincia)
            .catch((error) => {
                console.error(error);
                this.toastSrv.error(error.toString());
                return [];
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
    }

    async traerAreas(): Promise<void> {
        // README: traigo todo porque podría estar pausada la que esta elegida en una modificacion
        this.areas = await this.areasSrv.getTodos([], 'nombre', 'asc')
            .then((areas) => {
                if (!areas.length) {
                    throw new Error('No existen areas de trabajo');
                }
                return areas;
            })
            .catch(async (error: Error) => {
                this.toastSrv.error(error.message);
                console.error(error);
                await this.routerSrv.navigateByUrl('mis-publicaciones/listar-publicaciones');
                throw error;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });
        this.areasVisibles = this.areas.filter(({ estado }) => estado === EEstadoAreaDeTRabajo.activa);
    }

    async getUsuarioLogeado(): Promise<void> {
        const usuario = await this.authSrv.usuarioLogeadoBBDD();
        if (!usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }
        this.empresa = usuario as IEmpresa;

        if (!this.empresaTieneDatosCargados(this.empresa)) {
            this.toastSrv.error('La empresa debe completar todos los campos obligatorios antes de publicar.');
            await this.empresa.pathFoto ? this.routerSrv.navigateByUrl('/mi-informacion') : this.routerSrv.navigateByUrl('/mi-foto');
            return;
        }
    }


    async altaPublicacion(): Promise<void> {

        if (!this.form) { return; }

        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        // TODO: no poder modificar la publicación si pasaron 7 dias (o mirar regla de negocio )
        if (!(this.empresa && (this.puedePublicar || this.titulo == 'Actualizar'))) { return; }

        //README: no es posible que no lo encuentre porque lo selecciono
        const areaDeTrabajo: IAreaDeTrabajo = this.areas?.find(({ id }) => id == this.getForm('areaDeTrabajo')?.value)!;
        const publicacion: IPublicacion = { ...this.form.value, areaDeTrabajo };
        publicacion.empresaQuePublica = String(this.empresa?.nombre);
        publicacion.idEmpresa = String(this.empresa?.id);

        //si modifica, le dejo el estado tal cual esta y mantengo la fecha inicio y fin originales
        if (this.publicacion?.id) {
            publicacion.id = this.publicacion.id;
            publicacion.estado = this.publicacion.estado;
            publicacion.inicio = this.publicacion.inicio;
            publicacion.fin = this.publicacion.fin;
        }
        else {
            //Solo si es alta, establezco fecha de inicio y fin, y el estado como activa
            publicacion.inicio = new Date();
            publicacion.fin = new Date();
            publicacion.fin.setMonth(publicacion.inicio.getMonth() + 2);
            publicacion.estado = EEstadoPublicacion.activa;
        }

        await this.publicacionSrv.guardar(publicacion).then(async () => {
            await this.actualizarPackDeLaEmpresa();
            this.toastSrv.success('Se guardaron los cambios de la publicación con éxito');
            await this.routerSrv.navigateByUrl('mis-publicaciones/listar-publicaciones');
        }).catch((error: Error) => {
            console.error(error);
            this.toastSrv.error(`Ha ocurrido un error al intentar ${this.titulo} la publicación`);
        }).finally(() => {
            this.spinnerSrv.ocultar();
        });

    }

    async actualizarPackDeLaEmpresa(): Promise<void> {

        if (!this.empresa) { return; }

        if (!(this.empresa.packs && this.empresa.packs.length > 0)) { return; }

        if (this.titulo == 'Actualizar') { return; }

        const cantPublicacionesActualizada = Number(this.empresa.packs.at(-1)?.cantidadDePublicacionesRestantes ?? 1) - 1;
        this.empresa.packs.at(-1)!.cantidadDePublicacionesRestantes = cantPublicacionesActualizada;

        await this.usuarioSrv.guardar(this.empresa)
            .then(() => {
                this.toastSrv.info('Se actualizaron los packs de la empresa');
            })
            .catch((error: Error) => {
                console.error('Error al actualizar el pack de la empresa', error);
                this.toastSrv.error('Ha ocurrido un error al actualizar el pack de la empresa');
            });
    }

}
