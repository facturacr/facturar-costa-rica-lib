import { Persona, DetalleServicio, Resumen } from '@src/types/facturaInterfaces'

type NotaCreditoElectronica = {
  Clave: string;
  CodigoActividad: string;
  NumeroConsecutivo: string;
  FechaEmision?: string;
  Emisor: Persona;
  Receptor: Persona;
  CondicionVenta?: string;
  PlazoCredito?: string;
  MedioPago?: string;
  DetalleServicio?: DetalleServicio;
  ResumenFactura: Resumen;
  Otros?: {
    OtroTexto: string;
  };
}

export type NotaCreditoContenedor = {
  NotaCreditoElectronica: NotaCreditoElectronica;
}
