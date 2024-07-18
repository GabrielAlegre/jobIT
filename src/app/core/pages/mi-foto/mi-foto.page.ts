import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { EExtensionImagenValida } from '../../../shared/enum/extension-imagen-valida.enum';
import { IValidadorOpciones } from '../../../shared/interfaces/validador-opciones.interface';
import { ArchivosService } from '../../../shared/services/archivos.service';
import { RouterService } from '../../../shared/services/router.service';
import { SpinnerService } from '../../../shared/services/spinner.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ValidadorService } from '../../../shared/services/validador.service';
import { ISubirArchivo } from '../../interfaces/subir-archivo.interface';
import { UsuariosService } from '../../services/usuarios.service';
import { TTodosLosUsuarios } from '../../types/todos-los-usuarios.type';

@Component({
    selector: 'core-mi-foto',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './mi-foto.page.html',
    styleUrl: './mi-foto.page.scss'
})
export default class MiFotoPage implements OnInit {

    private readonly authSrv = inject(AuthService);
    private readonly routerSrv = inject(RouterService);
    private readonly toastSrv = inject(ToastService);
    private readonly usuariosSrv = inject(UsuariosService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly spinnerSrv = inject(SpinnerService);
    private readonly archivosSrv = inject(ArchivosService);
    private readonly validadorSrv = inject(ValidadorService);
    private readonly storage = inject(Storage);

    usuario?: TTodosLosUsuarios;
    image: string = "";
    file!: File | null;
    form: FormGroup = this.formBuilder.group<ISubirArchivo>({
        archivo: [null, {
            updateOn: 'submit',
            validators: [Validators.required],
        }],
    });;

    async ngOnInit(): Promise<void> {

        this.usuario = await this.authSrv.usuarioLogeadoBBDD();

        if (!this.usuario) {
            this.toastSrv.error('No se pudo recuperar los datos del usuario');
            await this.routerSrv.navigateByUrl('/');
            return;
        }
    }

    get imagenesValidas(): string {
        return this.archivosSrv.imagenesValidas;
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
            this.toastSrv.error('Debe subir solo una imagen', 'Incompleto');
            return;
        }

        const file = files[0];

        if (!this.archivosSrv.validarImagen(file)) {
            this.resetForm();
        } else {
            this.file = file;
            this.image = URL.createObjectURL(this.file);
        }

        if (!this.usuario) { return; }
        this.usuario.pathFoto = this.image;
    }

    private resetForm(): void {
        this.getForm('archivo')?.reset();
        this.file = null;
        this.image = '';
    }


    private get extension(): string {
        const valor = this.getForm('archivo')?.value as string;
        return valor.split('.').at(-1) || EExtensionImagenValida.jpg;
    }

    async enviarForm() {

        if (!this.usuario) { return; }
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }
        if (!this.getForm('archivo')?.value || !this.file) { return; }
        if (!this.archivosSrv.validarImagen(this.file)) { return; }

        this.spinnerSrv.mostrar();
        const imgRef = ref(this.storage, `${this.usuario.tipo}/${this.usuario.correo}/imagenes/foto_de_perfil.${this.extension}`);
        await uploadBytes(imgRef, this.file);
        this.usuario.pathFoto = await getDownloadURL(imgRef);

        await this.usuariosSrv.actualizar(this.usuario)
            .then(() => { this.toastSrv.info('Se actualizó la foto'); })
            .catch((error: Error) => {
                console.error(error);
                this.toastSrv.error('Ha ocurrido un error al intentar actualizar la foto del usuario');
            })
            .finally(() => {
                this.resetForm();
                this.spinnerSrv.ocultar();
            });
    }

}
