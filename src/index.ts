interface FinalMessagePerson {
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

interface FinalMessage {
  clave: string;
  fecha: string;
  emisor: FinalMessagePerson;
  receptor: FinalMessagePerson;
  comprobanteXML: string;
}

function createLastMessage(): FinalMessage {
  return {
    clave: '',
    fecha: '',
    emisor: {
      tipoIdentificacion: '',
      numeroIdentificacion: ''
    },
    receptor: {
      tipoIdentificacion: '',
      numeroIdentificacion: ''
    },
    comprobanteXML: ''
  }
}

export default () => {
  const finalMesage = createLastMessage()
}
