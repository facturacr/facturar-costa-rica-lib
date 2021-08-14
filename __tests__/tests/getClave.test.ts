import { getClave } from '../../src/lib/genClave'
import fe from '../stubs/frontendRequest.stub'
import { ClientPayload } from '../../src/types/globalInterfaces'

describe('GET CLAVE', () => {
  it('should create a new key with 50 characters', () => {
    const frontEndRequest: ClientPayload = fe
    const result = getClave(frontEndRequest)
    expect(result.length).toBe(50)
  })
})
