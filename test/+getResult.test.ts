import HyMatrix from '../src/index'

const hyMatrix = new HyMatrix()

describe('test', () => {
  test('getResult', async () => {
    const msgId = 'OnTyG5YOkBmCrS_3OCUvnQ3H2D-YF0yMAru0uuQMrFY'
    return await hyMatrix.getResult(msgId).then((result) => {
      expect(typeof result.Nonce).toBe('string')
      expect(typeof result['Item-Id']).toBe('string')
      expect(typeof result['From-Process']).toBe('string')
      expect(typeof result['Pushed-For']).toBe('string')
      expect(Array.isArray(result.Messages)).toBe(true)
      expect(Array.isArray(result.Spawns)).toBe(true)
    })
  })
  test('getResult', async () => {
    const pid = 'Ec3lGBja3TuYDrY07TVTLQ36Sd6F7gOG3I_db4dGCrw'
    const limit = 10
    return await hyMatrix.getResults(pid, limit).then((result) => {
      expect(result).toHaveProperty('edges') // 是否存在 edges 字段
      expect(result.edges).toBeInstanceOf(Array) // 是否是 Array 类型
      expect(result.edges.length).toBeGreaterThan(0) // 可选，检查数组是否非空
      expect(typeof result.edges[0].cursor).toBe('string') // 判断 cursor 是否是 string 类型
    })
  })
})
