import { Tag, Config, SendMessageParams } from '../types'
import { JWKInterface } from 'arweave/node/lib/wallet'
import {
  InjectedEthereumSigner,
  ArweaveSigner
} from 'arseeding-arbundles/src/signing'
import EthereumSigner from 'arseeding-arbundles/src/signing/chains/ethereumSigner'
import { createData, DataItem } from 'arseeding-arbundles'
import isString from 'lodash/isString'
import { mergeTags } from '../utils'
import { Web3Provider } from '@ethersproject/providers'
import { utils } from 'ethers'
export const checkArPermissions = async (
  permissions: string[] | string
): Promise<void> => {
  let existingPermissions: string[] = []
  permissions = isString(permissions) ? [permissions] : permissions

  try {
    existingPermissions = await window.arweaveWallet.getPermissions()
  } catch {
    throw new Error('PLEASE_INSTALL_ARCONNECT')
  }

  if (permissions.length === 0) {
    return
  }

  if (
    permissions.some((permission) => {
      return !existingPermissions.includes(permission)
    })
  ) {
    await window.arweaveWallet.connect(permissions as never[])
  }
}

let ethPublicKey = ''
export const createAndSignItem = async (config: Config, params: SendMessageParams): Promise<ArrayBuffer> => {
  const sdkTimestampTag: Tag[] = [
    {
      name: 'SDK-Timestamp',
      value: Date.now().toString()
    }
  ]
  const { tags, processId: target, data = '' } = params
  const finalTags = mergeTags(sdkTimestampTag, tags)
  if ((config?.signer != null || config.signer !== undefined) && config.signer instanceof Web3Provider) {
    const signer = new InjectedEthereumSigner(config.signer)
    if (ethPublicKey !== '') {
      const signerAddr = await config.signer.getSigner().getAddress()
      const publicKeyAddr = utils.computeAddress('0x' + ethPublicKey)
      if (signerAddr.toLowerCase() !== publicKeyAddr.toLowerCase()) {
        await signer.setPublicKey()
        ethPublicKey = signer.publicKey.toString('hex')
      } else {
        signer.setPublicKey = async function () {
          this.publicKey = Buffer.from(ethPublicKey, 'hex')
        }
        await signer.setPublicKey()
      }
    } else {
      await signer.setPublicKey()
      ethPublicKey = signer.publicKey.toString('hex')
    }

    const dataItem = createData(data, signer, {
      tags: finalTags,
      target
    })
    await dataItem.sign(signer)
    return dataItem.getRaw()
  } else if ((config.arJWK != null || config.arJWK !== undefined) && config.arJWK === 'use_wallet') {
    await checkArPermissions([
      'ACCESS_ADDRESS',
      'ACCESS_ALL_ADDRESSES',
      'ACCESS_PUBLIC_KEY',
      'SIGN_TRANSACTION',
      'SIGNATURE'
    ])
    if (window.arweaveWallet !== undefined && typeof (window.arweaveWallet as any).signDataItem === 'function') {
      const signed = await (window.arweaveWallet as any).signDataItem({
        data,
        tags: finalTags,
        target
      })
      const dataItem = new DataItem(Buffer.from(signed))

      return dataItem.getRaw()
    } else {
      throw new Error('window.arweaveWallet not undefined')
    }
  } else if (typeof config.privateKey === 'string' && /^0x[0-9a-fA-F]{64}$/.test(config.privateKey)) {
    const signer = new EthereumSigner(config.privateKey.slice(2))
    const dataItem = createData(data, signer, { tags: finalTags, target })
    await dataItem.sign(signer)
    return dataItem.getRaw()
  } else if (config.arJWK !== undefined && isJWKInterface(config.arJWK)) {
    const signer = new ArweaveSigner(config.arJWK)
    const dataItem = createData(data, signer, { tags: finalTags, target })
    await dataItem.sign(signer)
    return dataItem.getRaw()
  }
  throw new Error(
    'Config must provide at least one of: ethSigner, privateKey, or arJWK'
  )
}

export function isJWKInterface (obj: JWKInterface): obj is JWKInterface {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.kty === 'string' &&
    typeof obj.e === 'string' &&
    typeof obj.n === 'string'
    // // 可选字段不强制判断，但可以加类型判断，防止异常
    // (obj.d === undefined || typeof obj.d === 'string') &&
    // (obj.p === undefined || typeof obj.p === 'string') &&
    // (obj.q === undefined || typeof obj.q === 'string') &&
    // (obj.dp === undefined || typeof obj.dp === 'string') &&
    // (obj.dq === undefined || typeof obj.dq === 'string') &&
    // (obj.qi === undefined || typeof obj.qi === 'string')
  )
}
