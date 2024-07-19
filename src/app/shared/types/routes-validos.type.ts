// "ruta"___"titulo"
// ruta + 3 guion bajo + titulo

export type TRoutesValidos =
    | '___'
    | 'auth___'

    | '**___'

    | 'inicio___Inicio'

    | '404___Página no encontrada'


    | 'iniciar-sesion___Iniciar Sesión'
    | 'auth/iniciar-sesion___Iniciar Sesión'

    | 'registrarse___Registrarse'
    | 'auth/registrarse___Registrarse'

    | 'recuperar-cuenta___Recuperar cuenta'
    | 'auth/recuperar-cuenta___Recuperar cuenta'


    | '___Sesión'
    | '___Cerrar Sesión'


    | '___Mis Datos'
    | '___Mis Tarjetas'
    | '___Básica'
    | '___Experiencia'
    | '___Agregar trabajo'
    | '___Agregar estudio'
    | '___Académica'
    | '___Laboral'
    | '___Tarjetas'
    | 'mi-informacion___Mi Información'
    | 'mi-informacion/listar___'
    | 'mi-informacion/listar/trabajo___Listar trabajos'
    | 'mi-informacion/listar/estudio___Listar estudios'
    | 'mi-informacion/listar/:experiencia___Listar Experiencias de'
    | 'mi-informacion/agregar___'
    | 'mi-informacion/agregar/trabajo___'
    | 'mi-informacion/agregar/estudio___'
    | 'mi-informacion/agregar/:experiencia___Agregar experiencia de'
    | 'mi-informacion/modificar___'
    | 'mi-informacion/modificar/:experiencia/:id___Modificar experiencia de'
    | 'mi-foto___Mi Foto'
    | 'mi-cv___Mi CV'
    | 'mis-pagos___Mis Pagos'
    | 'ver-informacion-empresa___Información Empresa'
    | 'ver-informacion-empresa/:id___Información Empresa'
    | 'mis-tarjetas/listar-tarjetas___Listar tarjetas'
    | 'mis-tarjetas/agregar-tarjeta___Agregar tarjeta'
    | 'mis-tarjetas/modificar-tarjeta___Modificar tarjeta'
    | 'mis-tarjetas/modificar-tarjeta/:id___Modificar tarjeta'


    | '___Mis Ingresos'
    | '___Packs'
    | 'mis-ingresos/suscripcion___Suscripción'
    | 'mis-ingresos/listar-packs___Listar packs'
    | 'mis-ingresos/agregar-pack___Agregar pack'
    | 'mis-ingresos/modificar-pack___Modificar pack'
    | 'mis-ingresos/modificar-pack/:id___Modificar pack'

    | '___Datos dinámicos'
    | '___Area de trabajo'
    | 'datos-dinamicos/listar-areas-de-trabajo___Listar areas de trabajo'
    | 'datos-dinamicos/agregar-area-de-trabajo___Agregar area de trabajo'
    | 'datos-dinamicos/modificar-area-de-trabajo___Modificar area de trabajo'
    | 'datos-dinamicos/modificar-area-de-trabajo/:id___Modificar area de trabajo'


    | 'mis-suscripciones/comprar-suscripcion___Comprar subscripción'
    | 'mis-suscripciones/listar-suscripciones___Mis suscripciones'



    | 'publicaciones___Publicaciones'
    | 'panel-de-control___Panel de control'
    | 'publicaciones/mis-postulaciones___Mis postulaciones'
    | 'publicaciones/ver-todas___Ver todas'
    | 'publicaciones/ver-detalle/:id___'
    | 'publicaciones/ver-detalle___Ver detalle publicación'
    | 'publicacion/ver-postulantes___Ver postulantes de la publicación'
    | 'publicacion/ver-postulantes/:id___Ver postulantes de la publicación'
    //en un futuro sera  'postulante/ver-detalle/:id___Ver detalle postulante'
    | 'postulante/ver-detalle___Ver detalle postulante'
    | 'postulante/ver-detalle/:id/:idPublicacion___Ver detalle postulante'



    | 'mis-packs/comprar-pack___Comprar pack'
    | 'mis-packs/listar-packs___Mis packs'


    | 'mis-publicaciones/publicaciones___Mis publicaciones'
    | 'mis-publicaciones/listar-publicaciones___Listar publicaciones'
    | 'mis-publicaciones/agregar-publicacion___Agregar publicación'
    | 'mis-publicaciones/modificar-publicacion___Modificar publicación'
    | 'mis-publicaciones/modificar-publicacion/:id___Modificar publicación'

