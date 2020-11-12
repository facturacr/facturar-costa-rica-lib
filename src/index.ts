import confirmXML from '@src/confirmXML'
import { sendToCustomURL } from '@src/services/send/index'
import getToken from '@src/services/getToken'
import genJSON from '@src/lib/genJSON'
import eletronicBill from '@src/electronicBill'
import * as genClaveTools from '@src/lib/genClave'
// import creditNote from '@src/creditNote'
// import debitNote from '@src/debitNote'

export {
  confirmXML,
  sendToCustomURL,
  getToken,
  eletronicBill,
  genJSON,
  genClaveTools
}
