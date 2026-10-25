import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  actualizarCliente,
  cerrarSesionCliente,
  iniciarSesionCliente,
  leerSesionCliente,
  listarClientes,
  registrarCliente,
} from './clienteService'

const datosCamila = {
  nombre: ' Camila ',
  apellidos: ' Sepúlveda Rojas ',
  run: '12345678k',
  correo: ' Camila@Correo.cl ',
  tipoCliente: 'residencial',
}

describe('clienteService', () => {
  beforeEach(() => localStorage.clear())
  afterEach(() => vi.restoreAllMocks())

  it('inicia sin clientes ni sesión', () => {
    expect(listarClientes()).toEqual([])
    expect(leerSesionCliente()).toBeNull()
  })

  it('registra un cliente con datos limpios, identificador correlativo y sin contraseña', () => {
    const cliente = registrarCliente({ ...datosCamila, clave: 'secreta1' })

    expect(cliente).toMatchObject({
      id: 'CLI-0001',
      nombre: 'Camila',
      apellidos: 'Sepúlveda Rojas',
      run: '12345678K',
      correo: 'camila@correo.cl',
      tipoCliente: 'residencial',
      direccion: '',
      zonaId: '',
    })
    expect(cliente).not.toHaveProperty('clave')
    expect(localStorage.getItem('gas-el-volcan-clientes')).not.toContain('secreta1')
    expect(registrarCliente({ ...datosCamila, run: '11111111K', correo: 'otra@correo.cl' }).id).toBe('CLI-0002')
  })

  it.each([
    [{ correo: 'CAMILA@correo.cl ', run: '99999999K' }, 'Ya existe una cuenta con ese correo'],
    [{ correo: 'otra@correo.cl', run: '12345678K' }, 'Ya existe una cuenta con ese RUN'],
    [{ correo: 'operadora@ejemplo.cl', run: '99999999K' }, 'reservado para el personal'],
  ])('rechaza registros repetidos o reservados %j', (cambios, mensaje) => {
    registrarCliente(datosCamila)

    expect(() => registrarCliente({ ...datosCamila, ...cambios })).toThrow(mensaje)
    expect(listarClientes()).toHaveLength(1)
  })

  it.each([
    { nombre: 'A' },
    { apellidos: '' },
    { run: '12.345.678-K' },
    { correo: 'sin-arroba' },
    { tipoCliente: 'administracion' },
  ])('no guarda datos inválidos %j', (cambios) => {
    expect(() => registrarCliente({ ...datosCamila, ...cambios })).toThrow()
    expect(listarClientes()).toEqual([])
  })

  it('inicia y cierra la sesión del cliente, que sobrevive a una recarga', () => {
    registrarCliente(datosCamila)

    expect(iniciarSesionCliente(' CAMILA@correo.cl').id).toBe('CLI-0001')
    expect(leerSesionCliente()?.nombre).toBe('Camila')
    cerrarSesionCliente()
    expect(leerSesionCliente()).toBeNull()
  })

  it('indica el campo al que corresponde cada error, para mostrarlo junto a él', () => {
    registrarCliente(datosCamila)

    expect(() => registrarCliente({ ...datosCamila, run: '99999999K' })).toThrow(expect.objectContaining({ campo: 'correo' }))
    expect(() => registrarCliente({ ...datosCamila, correo: 'x@correo.cl' })).toThrow(expect.objectContaining({ campo: 'run' }))
    expect(() => registrarCliente({ ...datosCamila, nombre: '' })).toThrow(expect.objectContaining({ campo: 'nombre' }))
    expect(() => iniciarSesionCliente('nadie@correo.cl')).toThrow(expect.objectContaining({ campo: 'correo' }))
  })

  it('no inicia sesión con un correo sin cuenta', () => {
    expect(() => iniciarSesionCliente('nadie@correo.cl')).toThrow('No existe una cuenta con ese correo')
    expect(leerSesionCliente()).toBeNull()
  })

  it('ignora una sesión que apunta a una cuenta inexistente', () => {
    localStorage.setItem('gas-el-volcan-sesion-cliente', 'CLI-0099')

    expect(leerSesionCliente()).toBeNull()
  })

  it('actualiza solo los datos permitidos de la entrega', () => {
    const { id } = registrarCliente(datosCamila)

    const actualizado = actualizarCliente(id, { direccion: ' Los Aromos 123 ', zonaId: 'centro', run: '1', id: 'CLI-9' })

    expect(actualizado).toMatchObject({ id: 'CLI-0001', run: '12345678K', direccion: 'Los Aromos 123', zonaId: 'centro' })
    expect(() => actualizarCliente(id, { zonaId: 'marte' })).toThrow('La zona de despacho no es válida')
    expect(() => actualizarCliente('CLI-0404', { direccion: 'Calle 1' })).toThrow('No existe la cuenta')
  })

  it('informa clientes guardados dañados sin borrarlos', () => {
    localStorage.setItem('gas-el-volcan-clientes', '[{"id":"CLI-0001"}]')

    expect(() => listarClientes()).toThrow('Las cuentas guardadas están dañadas')
    expect(() => registrarCliente(datosCamila)).toThrow('Las cuentas guardadas están dañadas')
    expect(localStorage.getItem('gas-el-volcan-clientes')).toBe('[{"id":"CLI-0001"}]')
  })
})
