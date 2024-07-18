# JobIt

### Actualizar a Angular 17.3.5

```
npm uninstall -g @angular/cli
npm install -g @angular/cli@17.3.5
```

> menu.component.ts

```
label : TTituloValido
routerLink : TRutaValida
```

> app.route.ts

```
title: TTituloValido
path: TRutaValida
redirectTo: TRutaValida
```

<etiqueta/>
<etiqueta></etiqueta>

constructor (private readonly routerSrv : Router) {}

utilizar RouterService que te autocompleta la ruta
private readonly routerSrv = inject(RouterService);
private readonly spinnerSrv = inject(SpinnerService);

this.spinnerSrv.mostrar();
this.spinnerSrv.ocultar();

track es seguimiento
@for(tipo of tipos; track tipo){
@if(tipo !== 'admin') {}
@else {}
}

@for(tipo of tipos; let i = $index ; track i){

}@empty{

<h1>No hay dat</h1>
}

https://angular.io/api/core/for

    <span class="form-text text-danger"
        [innerHTML]="messageError('nombre')"
        >
    </span>

    <span class="form-text text-danger"
        > {{messageError('nombre')}}
    </span>

2 cosas (componenets y pages)
ng g c core/pages/ejemplo2 --type=page --prefix=core
ng g c empleados/pages/ejemplo3 --type=page --prefix=empleados

# Tarea
