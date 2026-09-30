export default function SelectorTipoCliente({ valor, alCambiar }) {
  return (
    <div className="mb-4">
      <label className="form-label" htmlFor="tipo-cliente">
        Tipo de cliente
      </label>
      <select
        className="form-select"
        id="tipo-cliente"
        value={valor}
        onChange={(evento) => alCambiar(evento.target.value)}
      >
        <option value="residencial">Residencial</option>
        <option value="comercial">Comercial</option>
      </select>
    </div>
  )
}
