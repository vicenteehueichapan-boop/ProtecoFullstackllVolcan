// Crea un error que indica a qué campo del formulario corresponde, para que la página
// pueda mostrarlo junto a ese campo (Guía 14) y no en un aviso general.
export function errorDeCampo(campo, mensaje) {
  const error = new Error(mensaje)
  error.campo = campo
  return error
}
