// Indica si un clic en un enlace es "simple": botón principal y sin teclas especiales.
// Solo en ese caso la aplicación cambia de página sin recargar. Con Ctrl, Cmd, Shift,
// Alt o el botón central, la persona quiere abrir otra pestaña o ventana, y eso lo
// resuelve el navegador con el href real del enlace.
export function esClicSimple(evento) {
  return evento.button === 0 && !evento.ctrlKey && !evento.metaKey && !evento.shiftKey && !evento.altKey
}
