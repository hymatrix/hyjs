import HyMatrix from '../src/index'
import { SendMessageParams } from '../src/types'
import jwkfile from '../src/constants/arweave-keyfile.json'
// import { ArJWK } from '../src/types'

// 以 《转账》 为例
describe('test', () => {
  test('ethereum 私钥 Action transfer', async () => {
    // eth 地址私钥 以 0x为起点 另包含 64 为私钥， 共 66 位。
    const privateKey = '0x123123123123'
    // 可不传递 accid ，无碍
    const hyMatrix1 = new HyMatrix({
      privateKey: privateKey
    })
    // 以 hmAR 为例
    const processId = 'Ec3lGBja3TuYDrY07TVTLQ36Sd6F7gOG3I_db4dGCrw'
    const tags = [
      { name: 'Action', value: 'Transfer' },
      { name: 'Recipient', value: '0xfc65E09Ef6674DdB4D8a6f3b6a6c8D9d55d67716' },
      { name: 'Quantity', value: '100' }
    ]
    // data 可选， 若不选 则默认空字符串
    const params: SendMessageParams = {
      tags,
      processId
    }
    return await hyMatrix1.sendMessage(params).then((res) => {
      console.log(res.id) // https://hymx.permadao.io/result/O3DR7uWaSV9CjGw5ldMgWc2Tz9tiiK5OlJBrO8A26mM
      expect(typeof res.id).toBe('string')
    })
  })

  test('arweave 私钥 Action transfer', async () => {
    const hyMatrix1 = new HyMatrix({
      arJWK: jwkfile
    })
    // 以 hmAR 为例
    const processId = 'Ec3lGBja3TuYDrY07TVTLQ36Sd6F7gOG3I_db4dGCrw'
    const tags = [
      { name: 'Action', value: 'Transfer' },
      { name: 'Recipient', value: '_qrhp4_c-jl1IwLKcwlDGMCqs3Bx73eJeptAhYN9wNo' },
      { name: 'Quantity', value: '100' }
    ]
    // data 可选， 若不选 则默认空字符串
    const params: SendMessageParams = {
      tags,
      processId
    }
    return await hyMatrix1.sendMessage(params).then((res) => {
      console.log(res.id) // https://hymx.permadao.io/result/InD-Ii-ieGC2PVEY6v9lFFmnl4hP266TMy338wtQK-k
      expect(typeof res.id).toBe('string')
    })
  })
})
