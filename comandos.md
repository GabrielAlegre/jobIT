```npm

ngg g c shared/spinner
ngg g P shared/error404
ngg g g shared/admin --guardType=CanActivate
ngg g g shared/empleado --guardType=CanActivate
ngg g g shared/empresa --guardType=CanActivate
ngg g g shared/logeado --guardType=CanActivate
ngg g g shared/noLogeado --guardType=CanActivate
ngg g s shared/modal
ngg g s shared/toast
ngg g s shared/spinner
ngg g s shared/localStorage
ngg g p shared/tituloValido
ngg g p shared/rutaValida

ngg g t shared/validadorAsincronico
ngg g t shared/validadorSincronico
ngg g t shared/erroresValidos
ngg g t shared/routerValido
ngg g t shared/routesValidos
ngg g t shared/estructuraFormValida
ngg g i shared/estructuraForm
ngg g i shared/validadorOpciones

ngg g t shared/tituloValido
ngg g t shared/rutaValida

ngg g P auth/home auth
ngg g P auth/iniciarSesion auth
ngg g P auth/registrarse auth
ngg g P auth/recuperarCuenta auth
ngg g s auth/auth


ngg g P core/layout core
mv -v src/app/core/pages/layout src/app/core/layout
ngg g P core/home core



```
