import { ClaveOpts } from './interfaces'
import { tipoDocumento } from '../data/tipoDocumento'
// import { tipoCedula } from '../data/tipoCedula'

export default (opts: ClaveOpts): void => {
  const codigoDocumento = tipoDocumento[opts.tipoDocumento]
  // const codigoCedula = tipoCedula[opts.tipoCedula]
  const consecutivoFinal = opts.sucursal + opts.terminal + codigoDocumento + opts.consecutivo
  // const identificacion
  // https://github.com/CRLibre/API_Hacienda/blob/0e4256a5ade4be91b22d7844af48ed4a0ff6eb6f/api/contrib/clave/clave.php
  // $clave = $codigoPais . $dia . $mes . $ano . $identificacion . $consecutivoFinal . $situacion . $codigoSeguridad;
}
