type NotaCreditoElectronica = {
    Clave: string;
    CodigoActividad: number;
    NumeroConsecutivo: string;
    FechaEmision?: Date;
    Emisor: any;
    Receptor: any;
}

export type NotaCreditoContenedor = {
  NotaCreditoElectronica: NotaCreditoElectronica;
}
