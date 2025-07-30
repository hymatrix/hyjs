import HyMatrix from '../src/index'
// import { ArJWK } from '../src/types'

// 接口返回的是 number ，api 中 将其转为 string。可讨论
describe('test', () => {
  test('get BalanceOf', async () => {
    const accid = '0x972AeD684D6f817e1b58AF70933dF1b4a75bfA51'
    const hyMatrix1 = new HyMatrix({
      accid
    })
    return await hyMatrix1.balanceOf().then((balance) => {
      expect(typeof balance).toBe('string')
    })
  })
  test('get BalanceOf2', async () => {
    const accid = '0x972AeD684D6f817e1b58AF70933dF1b4a75bfA51'
    const hyMatrix1 = new HyMatrix()
    return await hyMatrix1.balanceOf(accid).then((balance) => {
      expect(typeof balance).toBe('string')
    })
  })
})
