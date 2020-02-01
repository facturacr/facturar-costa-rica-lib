interface MensajeReceptor {
  Clave: string;
  NumeroCedulaEmisor: string;
  FechaEmisionDoc: string;
  Mensage: string;
  DetalleMensaje?: string;
  MontoTotalImpuesto: string;
  CodigoActividad: string;
  NumeroCedulaReceptor: string;
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
