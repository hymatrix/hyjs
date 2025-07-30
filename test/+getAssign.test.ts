import HyMatrix from '../src/index'

const hyMatrix = new HyMatrix()

describe('test', () => {
  test('getAssignByNonce', async () => {
    const pid = 'Ec3lGBja3TuYDrY07TVTLQ36Sd6F7gOG3I_db4dGCrw'
    const nonce = 1736
    return await hyMatrix.getAssignByNonce(pid, nonce).then((result) => {
      const { signatureType, tags, target } = result
      expect(typeof signatureType).toBe('number')
      expect(typeof target).toBe('string')
      expect(tags).toBeInstanceOf(Array)
      expect(tags.length).toBeGreaterThan(0)
    })
  })
  test('getAssignByNonce 2', async () => {
    const msgId = 'I547_b09SrMBb8v9fK84iiy96HqP7Wi4LVoBpYH4jIs'
    return await hyMatrix.getAssignByMessage(msgId).then((result) => {
      const { signatureType, tags, target } = result
      expect(typeof signatureType).toBe('number')
      expect(typeof target).toBe('string')
      expect(tags).toBeInstanceOf(Array)
      expect(tags.length).toBeGreaterThan(0)
    })
  })
})
