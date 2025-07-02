import { ReceptorConsecutive } from '@src/ATV/core/ReceptorConsecutive'

describe('ReceptorConsecutive', () => {
  describe('create', () => {
    it('should create a ReceptorConsecutive instance with padded values', () => {
      const consecutive = ReceptorConsecutive.create({
        branch: '1',
        terminal: '1',
        documentType: '05',
        consecutive: '1'
      })

      expect(consecutive).toBeInstanceOf(ReceptorConsecutive)
    })

    it('should pad branch with zeros to 3 digits', () => {
      const consecutive = ReceptorConsecutive.create({
        branch: '1',
        terminal: '12345',
        documentType: '05',
        consecutive: '1234567890'
      })

      expect(consecutive.value).toBe('00112345051234567890')
    })

    it('should pad terminal with zeros to 5 digits', () => {
      const consecutive = ReceptorConsecutive.create({
        branch: '123',
        terminal: '1',
        documentType: '06',
        consecutive: '1234567890'
      })

      expect(consecutive.value).toBe('12300001061234567890')
    })

    it('should pad consecutive with zeros to 10 digits', () => {
      const consecutive = ReceptorConsecutive.create({
        branch: '123',
        terminal: '12345',
        documentType: '07',
        consecutive: '1'
      })

      expect(consecutive.value).toBe('12312345070000000001')
    })
  })

  describe('value', () => {
    it('should return concatenated values', () => {
      const consecutive = ReceptorConsecutive.create({
        branch: '001',
        terminal: '00001',
        documentType: '05',
        consecutive: '0000000001'
      })

      expect(consecutive.value).toBe('00100001050000000001')
    })
  })
})
