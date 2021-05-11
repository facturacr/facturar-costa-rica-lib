import { getClave } from '@src/lib/genClave'
import requestStub from '@test/stubs/frontendRequest.stub'
import { ClientPayload } from '@src/types/globalInterfaces'

const frontEndRequest: ClientPayload = requestStub
const result = getClave(frontEndRequest)

console.log('Clave', result)
console.log('pass test:', result.length === 50)
