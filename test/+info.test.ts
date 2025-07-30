import { isString } from 'lodash'
import HyMatrix from '../src/index'
// import { ArJWK } from '../src/types'

// const arJWK: ArJWK = 'use_wallet'
const hyMatrix1 = new HyMatrix()
// 失败， 因为 arJWK ｜ privateKey ｜ signer 只能存在一个
// const hyMatrix2 = new HyMatrix({
//   arJWK: arJWK,
//   privateKey: '0x123123'
// })

test('hm info got correct', async () => {
  return await hyMatrix1.info().then((info) => {
    const { Hm, Protocol, Variant } = info
    expect(isString(Hm)).toBe(true)
    expect(isString(Protocol)).toBe(true)
    expect(isString(Variant)).toBe(true)
  })
})
