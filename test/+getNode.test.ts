import HyMatrix from '../src/index'

const hyMatrix = new HyMatrix()

describe('test', () => {
  test('getNodes', async () => {
    return await hyMatrix.getNodes().then((result) => {
      // 检查是对象
      expect(typeof result).toBe('object')
      expect(result).not.toBeNull()
      // 至少包含一个 key
      const keys = Object.keys(result)
      expect(keys.length).toBeGreaterThan(0)
      // 检查每个 key 的值是否符合 HMNode
      for (const key of keys) {
        const node = result[key]
        expect(typeof node['Acc-Id']).toBe('string')
        expect(typeof node.Name).toBe('string')
        expect(typeof node.Role).toBe('string')
        expect(typeof node.Desc).toBe('string')
        expect(typeof node.URL).toBe('string')
      }
    })
  })
  test('getNode', async () => {
    const accId = '0x972AeD684D6f817e1b58AF70933dF1b4a75bfA51'
    return await hyMatrix.getNode(accId).then((node) => {
      expect(typeof node['Acc-Id']).toBe('string')
      expect(typeof node.Name).toBe('string')
      expect(typeof node.Role).toBe('string')
      expect(typeof node.Desc).toBe('string')
      expect(typeof node.URL).toBe('string')
    })
  })
  test('getNodesByProcess', async () => {
    const processId = '9UoykHW8xijir9wt7ZiHJU4dI6uVvzcvGuz5ttG_gHQ'
    return await hyMatrix.getNodesByProcess(processId).then((nodes) => {
      expect(nodes).toBeInstanceOf(Array) // 是否是 Array 类型
      // 至少包含一个
      expect(nodes.length).toBeGreaterThan(0)
      nodes.forEach((node) => {
        expect(typeof node['Acc-Id']).toBe('string')
        expect(typeof node.Name).toBe('string')
        expect(typeof node.Role).toBe('string')
        expect(typeof node.Desc).toBe('string')
        expect(typeof node.URL).toBe('string')
      })
    })
  })
  test('getProcesses', async () => {
    const accid = '0x972AeD684D6f817e1b58AF70933dF1b4a75bfA51'
    return await hyMatrix.getProcesses(accid).then((processes) => {
      expect(processes).toBeInstanceOf(Array) // 是否是 Array 类型
      // 至少包含一个
      expect(processes.length).toBeGreaterThan(0)
      processes.forEach((pid) => {
        expect(typeof pid).toBe('string')
      })
    })
  })
})
