import { Routes } from '@angular/router';
import { adminGuard } from './auth/guards/admin.guard';
import { empleadoGuard } from './auth/guards/empleado.guard';
import { empresaEmpleadoGuard } from './auth/guards/empresa-empleado.guard';
import { empresaGuard } from './auth/guards/empresa.guard';
import { logeadoGuard } from './auth/guards/logeado.guard';
import { noLogeadoGuard } from './auth/guards/no-logeado.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./core/layout/layout.page'),
        children: [
            {
                path: '',
                redirectTo: 'inicio',
                pathMatch: 'full'
            },
            {
                title: 'Inicio',
                path: 'inicio',
                loadComponent: () => import('./core/pages/home/home.page'),
            },
            {
                title: 'Mi Información',
                path: 'mi-informacion',
                loadComponent: () => import('./core/pages/datos-layout/datos-layout.page'),
                canActivate: [logeadoGuard]
            },
            {
                title: 'Listar Experiencias de',
                path: 'mi-informacion/listar/:experiencia',
                loadComponent: () => import('./empleados/pages/listar-experiencias/listar-experiencias.page'),
                canActivate: [empleadoGuard]
            },
            {
                title: 'Agregar experiencia de',
                path: 'mi-informacion/agregar/:experiencia',
                loadComponent: () => import('./empleados/pages/agregar-modificar-experiencia/agregar-modificar-experiencia.page'),
                canActivate: [empleadoGuard]
            },
            {
                title: 'Modificar experiencia de',
                path: 'mi-informacion/modificar/:experiencia/:id',
                loadComponent: () => import('./empleados/pages/agregar-modificar-experiencia/agregar-modificar-experiencia.page'),
                canActivate: [empleadoGuard]
            },
            {
                title: 'Mi Foto',
                path: 'mi-foto',
                loadComponent: () => import('./core/pages/mi-foto/mi-foto.page'),
                canActivate: [logeadoGuard]
            },
            {
                title: 'Mi CV',
                path: 'mi-cv',
                loadComponent: () => import('./empleados/pages/mi-cv/mi-cv.page'),
                canActivate: [empleadoGuard]
            },
            {
                title: 'Mis Pagos',
                path: 'mis-pagos',
                loadComponent: () => import('./core/pages/listar-pagos/listar-pagos.page'),
                canActivate: [empresaEmpleadoGuard]
            },
            {
                title: 'Información Empresa',
                path: 'ver-informacion-empresa/:id',
                loadComponent: () => import('./empresas/pages/ver-informacion-empresa/ver-informacion-empresa.page'),
                canActivate: [empleadoGuard]
            },
            {
                title: 'Mis postulaciones',
                path: 'publicaciones/mis-postulaciones',
                loadComponent: () => import('./empleados/pages/mis-postulaciones/mis-postulaciones.page'),
                canActivate: [empleadoGuard]
            },
            {
                title: 'Agregar tarjeta',
                path: 'mis-tarjetas/agregar-tarjeta',
                loadComponent: () => import('./core/pages/agregar-modificar-tarjeta/agregar-modificar-tarjeta.page'),
                canActivate: [empresaEmpleadoGuard]
            },
            {
                title: 'Modificar tarjeta',
                path: 'mis-tarjetas/modificar-tarjeta/:id',
                loadComponent: () => import('./core/pages/agregar-modificar-tarjeta/agregar-modificar-tarjeta.page'),
                canActivate: [empresaEmpleadoGuard]
            },
            {
                title: 'Listar tarjetas',
                path: 'mis-tarjetas/listar-tarjetas',
                loadComponent: () => import('./core/pages/listar-tarjetas/listar-tarjetas.page'),
                canActivate: [empresaEmpleadoGuard]
            },
            {
                title: 'Agregar publicación',
                path: 'mis-publicaciones/agregar-publicacion',
                loadComponent: () => import('./empresas/pages/agregar-modificar-publicacion/agregar-modificar-publicacion.page'),
                canActivate: [empresaGuard]
            },
            {
                title: 'Modificar publicación',
                path: 'mis-publicaciones/modificar-publicacion/:id',
                loadComponent: () => import('./empresas/pages/agregar-modificar-publicacion/agregar-modificar-publicacion.page'),
                canActivate: [empresaGuard]
            },
            {
                title: 'Mis publicaciones',
                path: 'mis-publicaciones/listar-publicaciones',
                loadComponent: () => import('./empresas/pages/mis-publicaciones/mis-publicaciones.page'),
                canActivate: [empresaGuard]
            },
            {
                title: 'Comprar subscripción',
                path: 'mis-suscripciones/comprar-suscripcion',
                loadComponent: () => import('./empleados/pages/comprar-suscripcion/comprar-suscripcion.page'),
                canActivate: [empleadoGuard]
            },
            {
                title: 'Mis suscripciones',
                path: 'mis-suscripciones/listar-suscripciones',
                loadComponent: () => import('./empleados/pages/mis-suscripciones/mis-suscripciones.page'),
                canActivate: [empleadoGuard]
            },
            {
                title: 'Comprar pack',
                path: 'mis-packs/comprar-pack',
                loadComponent: () => import('./empresas/pages/comprar-pack/comprar-pack.page'),
                canActivate: [empresaGuard]
            },
            {
                title: 'Mis packs',
                path: 'mis-packs/listar-packs',
                loadComponent: () => import('./empresas/pages/listar-packs/listar-packs.page'),
                canActivate: [empresaGuard]
            },
            {
                title: 'Suscripción',
                path: 'mis-ingresos/suscripcion',
                loadComponent: () => import('./admins/pages/suscripcion/suscripcion.page'),
                canActivate: [adminGuard]
            },
            {
                title: 'Listar packs',
                path: 'mis-ingresos/listar-packs',
                loadComponent: () => import('./admins/pages/listar-packs/listar-packs.page'),
                canActivate: [adminGuard]
            },
            {
                title: 'Agregar pack',
                path: 'mis-ingresos/agregar-pack',
                loadComponent: () => import('./admins/pages/agregar-modificar-pack/agregar-modificar-pack.page'),
                canActivate: [adminGuard]
            },
            {
                title: 'Modificar pack',
                path: 'mis-ingresos/modificar-pack/:id',
                loadComponent: () => import('./admins/pages/agregar-modificar-pack/agregar-modificar-pack.page'),
                canActivate: [adminGuard]
            },
            {
                title: 'Listar areas de trabajo',
                path: 'datos-dinamicos/listar-areas-de-trabajo',
                loadComponent: () => import('./admins/pages/listar-areas-de-trabajo/listar-areas-de-trabajo.page'),
                canActivate: [adminGuard]
            },
            {
                title: 'Agregar area de trabajo',
                path: 'datos-dinamicos/agregar-area-de-trabajo',
                loadComponent: () => import('./admins/pages/agregar-modificar-area-de-trabajo/agregar-modificar-area-de-trabajo.page'),
                canActivate: [adminGuard]
            },
            {
                title: 'Modificar area de trabajo',
                path: 'datos-dinamicos/modificar-area-de-trabajo/:id',
                loadComponent: () => import('./admins/pages/agregar-modificar-area-de-trabajo/agregar-modificar-area-de-trabajo.page'),
                canActivate: [adminGuard]
            },
            {
                title: 'Página no encontrada',
                path: '404',
                loadComponent: () => import('./shared/pages/error404/error404.page'),
            },
            {
                title: 'Publicaciones',
                path: 'publicaciones/ver-todas',
                loadComponent: () => import('./empleados/pages/publicaciones/publicaciones.page'),
                canActivate: [logeadoGuard]
            },
            {
                title: 'Ver detalle publicación',
                path: 'publicaciones/ver-detalle/:id',
                loadComponent: () => import('./empleados/pages/ver-detalle-publicacion/ver-detalle-publicacion.page'),
                canActivate: [logeadoGuard]
            },
            {
                title: 'Ver postulantes de la publicación',
                path: 'publicacion/ver-postulantes/:id',
                loadComponent: () => import('./empresas/pages/ver-postulantes/ver-postulantes.page'),
                canActivate: [empresaGuard]
            },
            {
                title: 'Ver detalle postulante',
                path: 'postulante/ver-detalle/:id/:idPublicacion',
                loadComponent: () => import('./empresas/pages/ver-detalle-postulante/ver-detalle-postulante.page'),
                canActivate: [empresaGuard]
            },
        ],
    },
    {
        path: 'auth',
        loadComponent: () => import('./core/layout/layout.page'),
        children: [
            {
                path: '',
                redirectTo: 'iniciar-sesion',
                pathMatch: 'full'
            },
            {
                title: 'Iniciar Sesión',
                path: 'iniciar-sesion',
                loadComponent: () => import('./auth/pages/iniciar-sesion/iniciar-sesion.page'),
                canActivate: [noLogeadoGuard],
            },
            {
                title: 'Registrarse',
                path: 'registrarse',
                loadComponent: () => import('./auth/pages/registrarse/registrarse.page'),
                canActivate: [noLogeadoGuard],
            },
            {
                title: 'Recuperar cuenta',
                path: 'recuperar-cuenta',
                loadComponent: () => import('./auth/pages/recuperar-cuenta/recuperar-cuenta.page'),
                canActivate: [noLogeadoGuard],
            },
        ],
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    }
];
