// Regla pura de acceso a las herramientas del personal: el perfil debe existir y su rol
// estar entre los permitidos para la ruta. Que el perfil siga activo y con ese rol lo
// garantiza SesionPersonalContext, que lo lee desde los datos guardados.
export function puedeAccederPersonal(perfil, roles) {
  return Boolean(perfil && roles.includes(perfil.rol))
}
