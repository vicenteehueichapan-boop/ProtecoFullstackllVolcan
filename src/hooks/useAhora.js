import { useEffect, useState } from 'react'

// Hook propio: entrega la fecha y hora actual y la renueva cada cierto tiempo.
// - useState guarda la hora; leerla en el renderizado ya no es una llamada impura.
// - useEffect inicia un temporizador al montar (fase de montaje).
// - La función que retorna el efecto limpia el temporizador al desmontar (fase de
//   desmontaje), así no quedan intervalos corriendo después de salir de la página.
export function useAhora(intervaloMs = 60_000) {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    const temporizador = setInterval(() => setAhora(new Date()), intervaloMs)
    return () => clearInterval(temporizador)
  }, [intervaloMs])

  return ahora
}
