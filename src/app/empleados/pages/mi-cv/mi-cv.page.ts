import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { IEmpleado } from '../../../core/interfaces/empleado.interface';
import { ISubirArchivo } from '../../../core/interfaces/subir-archivo.interface';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { EExtensionIArchivoValido } from '../../../shared/enum/extension-archivo-valido.enum';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { ArchivosService } from '../../../shared/services/archivos.service';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';

@Component({
    selector: 'empleados-mi-cv',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './mi-cv.page.html',
    styleUrl: './mi-cv.page.scss'
})
export default class MiCvPage implements OnInit {

    private readonly authSrv = inject(AuthService);
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly archivosSrv = inject(ArchivosService);
    private readonly validadorSrv = inject(ValidadorService);
    private readonly storage = inject(Storage);

    empleado?: IEmpleado;
    archivo: string = "";
    file!: File | null;
    form: FormGroup = this.formBuilder.group<ISubirArchivo>({
        archivo: [null, {
            updateOn: 'submit',
            validators: [Validators.required],
        }],
    });;

    async ngOnInit(): Promise<void> {

        const usuario = await this.authSrv.usuarioLogeadoBBDD();
        this.empleado = usuario as IEmpleado;
        if (!this.empleado) {
            this.toastSrv.error('No se pudo recuperar los datos del empleado');
            await this.routerSrv.navigateByUrl('/');
            return;
        }
    }

    get archivosValidos(): string {
        return this.archivosSrv.archivosValidos;
    }

    getForm(campo: keyof ISubirArchivo) {
        return this.form.get(campo);
    }

    formControlName(campo: keyof ISubirArchivo): keyof ISubirArchivo {
        return campo;
    }

    messageError(field: keyof ISubirArchivo, options?: IValidadorOpciones)
        : string | null {
        return this.validadorSrv.mensajeError(this.form, field, options);
    }

    handleFoto(event: Event) {

        const files: FileList | null = ((event.target) as HTMLInputElement).files;
        if (files?.length !== 1) {
            this.toastSrv.error('Debe subir solo un CV', 'Incompleto');
            return;
        }

        const file = files[0];

        if (!this.archivosSrv.validarArchivo(file)) {
            this.resetForm();
        } else {
            this.file = file;
            this.archivo = URL.createObjectURL(this.file);
        }

        if (!this.empleado) { return; }
        this.empleado.pathCV = this.archivo;
    }

    private resetForm(): void {
        this.getForm('archivo')?.reset();
        this.file = null;
        this.archivo = '';
    }

    private get extension(): string {
        const valor = this.getForm('archivo')?.value as string;
        return valor.split('.').at(-1) || EExtensionIArchivoValido.pdf;
    }

    async enviarForm() {

        if (!this.empleado) { return; }
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        console.log({ lolo: this.extension });
        if (!this.getForm('archivo')?.value || !this.file) { return; }
        if (!this.archivosSrv.validarArchivo(this.file)) { return; }

        this.spinnerSrv.mostrar();
        const imgRef = ref(this.storage, `${this.empleado.tipo}/${this.empleado.correo}/archivos/cv.${this.extension}`);
        await uploadBytes(imgRef, this.file);
        this.empleado.pathCV = await getDownloadURL(imgRef);

        await this.usuariosSrv.actualizar(this.empleado)
            .then(() => { this.toastSrv.info('Se actualizó el CV'); })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar actualizar el CV del empleado');
            })
            .finally(() => {
                this.resetForm();
                this.spinnerSrv.ocultar();
            });
    }

}
