import { JWKInterface } from 'arweave/node/lib/wallet'
import { Web3Provider } from '@ethersproject/providers'
export type ArJWK = JWKInterface | 'use_wallet'
export type EthereumPrivateKey = `0x${string}`

interface DefaultConfig {
  debug?: boolean
  accid?: string
  url?: string
}
export { Web3Provider }
// 三种互斥 signer 类型
type SignerConfig =
  | { signer: Web3Provider, privateKey?: never, arJWK?: never }
  | { privateKey: EthereumPrivateKey, signer?: never, arJWK?: never }
  | { arJWK: ArJWK, signer?: never, privateKey?: never }
export type Config = DefaultConfig & Partial<SignerConfig>

export interface Tag {
  name: string
  value: string
}

export interface ResMessage {
  Sequence: string
  Target: string
  Data: string
  Tags: Tag[]
}

export interface ResSpawn {
  Sequance: string
  Data: string
  Tags: Tag[]
}

export interface MessageItem {
  Nonce: string
  Timestamp: string
  'Item-Id': string
  'From-Process': string
  'Pushed-For': string
  Messages: ResMessage[]
  Spawns: ResSpawn[]
  Assignmengts: any // 类型未知，先用 any
  Output: any // 类型未知，先用 any
  Data: string
  Cache?: Record<string, string>
  Error: string
}

export interface MessageItemMap {
  edges: Array<{
    cursor: string
    node: MessageItem
  }>
}

export interface BundleItem {
  signatureType: number
  signature: string
  owner: string // base64-encoded public key
  target: string // optional, base64 string of length 32
  anchor: string // optional, base64 string of length 32
  tags: Tag[]
  data: string // usually base64-encoded or raw string
  id: string
  tagsBy: string // base64-encoded bytes of tags
}

export interface HMNode {
  ['Acc-Id']: string
  Name: string
  Role: string
  Desc: string
  URL: string
}

export interface HMInfo {
  Protocol: string
  Variant: string
  ['Join-Network']: string
  Hm: string
  Registry: string
  Node: HMNode
}
export interface HMNodeMap {
  [key: string]: HMNode
}

// export const DataProtocol = 'hymx'
// export const Variant = 'v1.0.0'

export enum BaseType {
  TypeModule = 'Module',
  TypeProcess = 'Process',
  TypeMessage = 'Message',
  TypeAssignment = 'Assignment',
  TypeSchedulerLocation = 'Scheduler-Location',
  TypeSchedulerTransfer = 'Scheduler-Transfer',
  TypeCheckpoint = 'Checkpoint'
}

export interface Base {
  'Data-Protocol': string
  Variant: string
  Type: string
}

export interface Module {
  'Module-Format': string
  'Memory-Limit': string
  'Compute-Limit': string
  'Input-Encoding'?: string // optional
  'Output-Encoding'?: string // optional
  Tags?: Tag[] // optional
  Base: Base
}

export interface Process {
  Module: string
  Scheduler: string
  'From-Process'?: string
  Tags: Tag[]
  Base: Base
}

export interface Message {
  Action: string
  'From-Process'?: string
  'Pushed-For': string
  Sequence: string
  Tags?: Tag[]
  Base: Base
}

export interface Assignment {
  Process: string
  Message: string
  Nonce: string
  Timestamp: string
  Base: Base
}

export interface Checkpoint {
  Process: string
  Nonce: string
  Base: Base
}

export interface ResponseResult {
  id: string
  message: string
}
export interface Response {
  id: string
}
export interface SendMessageParams {
  processId: string
  tags: Tag[]
  data?: string
}
// export interface SpawnParams {
//   processId: string
//   tags: Tag[]
//   data?: string
// }

export abstract class HyMatrixBase {
  abstract info (): Promise<HMInfo>
  abstract getResult (pid: string, msgId: string): Promise<MessageItem>
  abstract getResults (pid: string, limit: number): Promise<MessageItemMap>
  abstract getMessage (msgId: string): Promise<BundleItem>
  abstract getMessageByNonce (pid: string, nonce: number): Promise<BundleItem>
  abstract getAssignByNonce (pid: string, nonce: number): Promise<BundleItem>
  abstract getAssignByMessage (msgId: string): Promise<BundleItem>
  abstract getNodes (): Promise<HMNodeMap>
  abstract getNode (accid?: string): Promise<HMNode>
  abstract getNodesByProcess (processId: string): Promise<HMNode[]>
  abstract getProcesses (accid: string): Promise<string[]>
  abstract balanceOf (accid?: string): Promise<string>
  abstract stakeOf (accid?: string): Promise<string>
  abstract sendMessage (params: SendMessageParams): Promise<Response>
  abstract getCacheByPidAndKey (pid: string, key: string): Promise<string>
  abstract getModules (): Promise<string[]>
  abstract getModule (mid: string): Promise<Module>
}
