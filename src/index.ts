import { getHyMatrixHost } from './config'
import {
  BundleItem,
  Config,
  MessageItem,
  Tag,
  BaseType,
  HMInfo,
  HyMatrixBase,
  SendMessageParams,
  Response,
  HMNodeMap,
  HMNode,
  MessageItemMap
} from './types'

import {
  getInfo,
  getResult,
  getResults,
  getMessage,
  getMessageByNonce,
  getAssignByNonce,
  getAssignByMessage,
  getBalanceOfByAccid,
  getStakeOfByAccid,
  getNodes,
  send,
  getNode,
  getNodesByProcess,
  getProcesses
} from './api/api'
import { createAndSignItem } from './lib'
import { getDefaultBase, mergeTags, baseToTags } from './utils'
export * from './types'
class HyMatrix extends HyMatrixBase {
  constructor (config?: Config) {
    super()
    this._config = {
      ...config,
      debug: config?.debug ?? false,
      accid: config?.accid ?? ''
    }
    this._apiHost = ((config?.url) != null && config.url !== undefined && config.url !== '') ? config.url : getHyMatrixHost(this._config.debug)
  }

  private readonly _apiHost: string
  // private readonly _explorerHost: string
  // private readonly _expressHost: string
  private readonly _config: Config

  async info (): Promise<HMInfo> {
    const result = await getInfo(this._apiHost)
    return result
  }

  async getResult (processId: string, msgId: string): Promise<MessageItem> {
    const result = await getResult(this._apiHost, processId, msgId)
    return result
  }

  async getResults (processId: string, limit: number): Promise<MessageItemMap> {
    const result = await getResults(this._apiHost, processId, limit)
    return result
  }

  async getMessage (msgId: string): Promise<BundleItem> {
    const result = await getMessage(this._apiHost, msgId)
    return result
  }

  async getMessageByNonce (processId: string, nonce: number): Promise<BundleItem> {
    const result = await getMessageByNonce(this._apiHost, processId, nonce)
    return result
  }

  async getAssignByNonce (processId: string, nonce: number): Promise<BundleItem> {
    const result = await getAssignByNonce(this._apiHost, processId, nonce)
    return result
  }

  async getAssignByMessage (msgId: string): Promise<BundleItem> {
    const result = await getAssignByMessage(this._apiHost, msgId)
    return result
  }

  async getNodes (): Promise<HMNodeMap> {
    const result = await getNodes(this._apiHost)
    return result
  }

  async getNode (accid?: string): Promise<HMNode> {
    const accTemp = accid ?? (this._config.accid as string)
    const result = await getNode(this._apiHost, accTemp)
    return result
  }

  async getNodesByProcess (processId: string): Promise<HMNode[]> {
    const result = await getNodesByProcess(this._apiHost, processId)
    return result
  }

  async getProcesses (accid?: string): Promise<string[]> {
    const accTemp = accid ?? (this._config.accid as string)
    const result = await getProcesses(this._apiHost, accTemp)
    return result
  }

  async balanceOf (accid?: string): Promise<string> {
    const accTemp = accid ?? (this._config.accid as string)
    const result = await getBalanceOfByAccid(this._apiHost, accTemp)
    return result
  }

  async stakeOf (accid?: string): Promise<string> {
    const accTemp = accid ?? (this._config.accid as string)
    const result = await getStakeOfByAccid(this._apiHost, accTemp)
    return result
  }

  async sendMessage (params: SendMessageParams): Promise<Response> {
    const info = await this.info()
    const defaultBaseMessage = getDefaultBase(BaseType.TypeMessage, info)
    const msg = {
      Base: defaultBaseMessage
    }
    const baseTags: Tag[] = baseToTags(msg.Base)
    const msgTags = mergeTags(baseTags, params.tags)
    const binary = await createAndSignItem(this._config, {
      ...params,
      tags: msgTags
    })
    const result = await send(this._apiHost, binary)
    return { id: result.id }
  }

  // private async initToken (tokenModule: string, Base: Base, tags: Tag[]): Promise<string> {
  //   const baseTags: Tag[] = baseToTags(Base)
  //   const process = [
  //     { name: 'Module', value: tokenModule },
  //     { name: 'Scheduler', value: this._config.accid ?? '' },
  //     ...baseTags
  //   ]
  //   const msgTags = mergeTags(process, tags)
  //   const params: SendMessageParams = {
  //     tags: msgTags,
  //     processId: '',
  //     data: Date.now().toString()
  //   }
  //   const result = await this.sendMessage(params)
  //   return result.id
  // }

  // async spawn (params: SpawnParams): Promise<any> {
  //   const info = await this.info()
  //   const defaultBase = getDefaultBase(BaseType.TypeProcess, info)
  //   await this.initToken(info.Hm, defaultBase, params.tags)
  //   return info
  // }
}

export default HyMatrix
