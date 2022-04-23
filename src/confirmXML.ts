import { consecutivoStr } from '@src/lib/genClave'
import { xmlToJson, genXML } from '@src/lib/genXML/index'
import { send } from '@src/services/send/index'
import { getFinalMessage, getMsjObj } from '@src/lib/genJSON/confirmXML'

function getConsecutivoStr(opts: any): string {
  return consecutivoStr({
    sucursal: opts.consecutivo.sucursal,
    terminal: opts.consecutivo.terminal,
    tipoDocKey: opts.tipoDocKey,
    consecutivo: opts.consecutivo.consecutivo
  })
}

export default async (opts: {
  token: string;
  tipoDocKey: string;
  consecutivo: any;
  xmlStr: string;
  pemOpt: any;
}): Promise<any> => {
  const { token, pemOpt, tipoDocKey } = opts
  const consecutivo = getConsecutivoStr(opts)
  const fullInvoice = xmlToJson(opts.xmlStr)
  const msjObj = getMsjObj({ fullInvoice, consecutivo, tipoDocKey })
  const xmlBase64 = await genXML(tipoDocKey, msjObj, {
    buffer: pemOpt.buffer,
    password: pemOpt.password,
    base64: true
  })
  const finalMesage = getFinalMessage(fullInvoice, consecutivo, xmlBase64)
  return send(token, finalMesage).catch((err) => {
    const response = err.response || {}
    const header = response.headers || {}
    const data = response.data = {}
    console.log('status', response.status)
    console.log('data', data)
    console.log('x-error-cause', header['x-error-cause'])
  })
}
