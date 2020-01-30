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

export interface MensajeReceptorContenedor {
  MensajeReceptor: MensajeReceptor;
}
