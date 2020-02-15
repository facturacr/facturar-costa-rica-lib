interface MensajeReceptor {
  Clave: string;
  NumeroCedulaEmisor: string;
  FechaEmisionDoc: string;
  Mensaje: string;
  DetalleMensaje?: string;
  MontoTotalImpuesto: string;
  CodigoActividad: string;
  CondicionImpuesto: string;
  MontoTotalDeGastoAplicable: string;
  NumeroCedulaReceptor: string;
  TotalFactura: string;
  NumeroConsecutivoReceptor: string;
}

interface NumeroConsecutivo {
  sucursal: string;
  terminal: string;
  tipoDocumento: string;
  consecutivo: string;
}

export interface MensajeReceptorContenedor {
  MensajeReceptor: MensajeReceptor;
}
