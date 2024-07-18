import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EEstadoAreaDeTRabajo } from '../../../core/enums/estado-area-de-trabajo.enum';
import { IAreaDeTrabajo } from '../../../core/interfaces/area-de-trabajo.interface';
import { AreasDeTrabajoService } from '../../../core/services/areas-de-trabajo.service';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { RutaValidaPipe } from '../../../shared/pipes/ruta-valida.pipe';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';

@Component({
    selector: 'admins-agregar-modificar-area-de-trabajo',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, RutaValidaPipe, RouterModule],
    templateUrl: './agregar-modificar-area-de-trabajo.page.html',
    styleUrl: './agregar-modificar-area-de-trabajo.page.scss'
})
export default class AgregarModificarAreaDeTrabajoPage implements OnInit {

    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly areaSrv = inject(AreasDeTrabajoService);
    private readonly validadorSrv = inject(ValidadorService);
    @Input() id?: string;
    area?: IAreaDeTrabajo;
    titulo: 'Agregar' | 'Actualizar' = 'Agregar';

    form: FormGroup = this.formBuilder.group<IAreaDeTrabajo>({
        nombre: ['', {
            updateOn: 'submit',
            validators: [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20),
            ],
            asyncValidators: []
        }],
    });

    async ngOnInit(): Promise<void> {

        if (!this.id) { return; }
        this.area = await this.areaSrv.getPorId(this.id)
            .then(area => {
                if (!area.nombre) {
                    throw new Error('No se pudo recuperar dentro del then...');
                }
                this.titulo = 'Actualizar';
                return area;
            })
            .catch(async (error: Error) => {
                this.toastSrv.error('No se pudo recuperar la información del area');
                console.error(error);
                await this.routerSrv.navigateByUrl('/datos-dinamicos/listar-areas-de-trabajo');
                return undefined;
            })
            .finally(() => { this.spinnerSrv.ocultar(); });

        this.form.reset({ ...this.area });
    }

    getForm(campo: keyof IAreaDeTrabajo) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof IAreaDeTrabajo): keyof IAreaDeTrabajo {
        return campo;
    }

    messageError(field: keyof IAreaDeTrabajo, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    async enviarForm(): Promise<void> {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.spinnerSrv.mostrar();
        const areaActualizado: IAreaDeTrabajo = {
            ...this.area,
            ...this.form.value,
            fecha: new Date(),
            estado: EEstadoAreaDeTRabajo.activa
        };
        await this.areaSrv.guardar(areaActualizado, this.area)
            .then(() => {
                this.toastSrv.info('Los datos se agregaron');
            })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar guardar los cambios');
            })
            .finally(async () => {
                await this.routerSrv.navigateByUrl('/datos-dinamicos/listar-areas-de-trabajo');
                this.spinnerSrv.ocultar();
            });
    }

}
