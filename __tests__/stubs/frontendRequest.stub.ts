import { Impuesto, LineaDetalle, Persona } from '@src/types/facturaInterfaces'
import { ClientPayload } from '@src/types/globalInterfaces'

const impuestoStub: Impuesto = {
  Codigo: '01',
  CodigoTarifa: '08',
  Tarifa: 13
}

const lineaDetalleStub: LineaDetalle = {
  Codigo: '8311100000000',
  Cantidad: 1,
  UnidadMedida: 'Unid',
  Detalle: 'detalle',
  PrecioUnitario: 10,
  Impuesto: impuestoStub
}

const transmitterStub: Persona = {
  Nombre: 'SRL',
  NombreComercial: 'CIENCIA DEL SABOR',
  Identificacion: {
    Tipo: '02',
    Numero: '3102759157'
  },
  Ubicacion: {
    Provincia: '2',
    Canton: '06',
    Distrito: '04',
    Barrio: '06',
    OtrasSenas: '25 norte 500 oeste restaurante El Faro'
  },
  Telefono: {
    CodigoPais: '506',
    NumTelefono: '80808080'
  },
  CorreoElectronico: 'cienciadelsabor@gmail.com',
  Fax: {
    CodigoPais: '506',
    NumTelefono: '80808080'
  }
}

const receiverStub: Persona = {
  Nombre: 'Nombre Receptor',
  Identificacion: {
    Numero: '206920142'
  }
}

const requestStub: ClientPayload = {
  Emisor: transmitterStub,
  Receptor: receiverStub,
  sucursal: '001',
  terminal: '00001',
  tipoDocumento: 'FE',
  codigoPais: '506',
  consecutivo: '18', // In the examples this prop needs to be changed
  codigoSeguridad: '00000001',
  situationEC: '1',
  actividad: '4',
  LineasDetalle: [lineaDetalleStub],
  facturaElectronicaType: 'FacturaElectronicaExportacion'
}

export default requestStub
