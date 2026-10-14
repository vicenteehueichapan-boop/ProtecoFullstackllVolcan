import personalDemostracion from '../data/personalDemostracion'

export function identificarPersonal(correo) {
  if (typeof correo !== 'string') return null
  const perfil = personalDemostracion.find((persona) => persona.correo === correo.trim().toLowerCase())
  return perfil ? { ...perfil } : null
}

export function puedeAccederPersonal(perfil, roles) {
  return Boolean(perfil && identificarPersonal(perfil.correo)?.rol === perfil.rol && roles.includes(perfil.rol))
}
