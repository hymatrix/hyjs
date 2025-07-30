import HyMatrix from '../src/index'

const hyMatrix = new HyMatrix()

describe('test', () => {
  test('getMessage', async () => {
    const msgId = 'OnTyG5YOkBmCrS_3OCUvnQ3H2D-YF0yMAru0uuQMrFY'
    return await hyMatrix.getMessage(msgId).then((result) => {
      const { signatureType, tags, target } = result
      expect(typeof signatureType).toBe('number')
      expect(typeof target).toBe('string')
      expect(tags).toBeInstanceOf(Array)
      expect(tags.length).toBeGreaterThan(0)
    })
  })
  test('getMessage 2', async () => {
    const pid = 'Ec3lGBja3TuYDrY07TVTLQ36Sd6F7gOG3I_db4dGCrw'
    const nonce = 1736
    return await hyMatrix.getMessageByNonce(pid, nonce).then((result) => {
      const { signatureType, tags, target } = result
      expect(typeof signatureType).toBe('number')
      expect(typeof target).toBe('string')
      expect(tags).toBeInstanceOf(Array)
      expect(tags.length).toBeGreaterThan(0)
    })
  })
})
