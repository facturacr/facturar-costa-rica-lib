import { getClave } from '../src/lib/genClave'
import fe from './input/frontendRequest'
import { FrontEndRequest } from '../src/types/globalInterfaces'

const frontEndRequest: FrontEndRequest = fe
const result = getClave(frontEndRequest)

console.log('Clave', result)
console.log('pass test:', result.length === 50)
