import { getClave } from '@src/lib/genClave'
import requestStub from '@test/stubs/frontendRequest.stub'
import { FrontEndRequest } from '@src/types/globalInterfaces'

const frontEndRequest: FrontEndRequest = requestStub
const result = getClave(frontEndRequest)

console.log('Clave', result)
console.log('pass test:', result.length === 50)
