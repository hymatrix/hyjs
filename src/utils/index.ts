import BN from 'bignumber.js'
import { Tag, Base, Message, HMInfo, BaseType } from '../types'

BN.config({
  EXPONENTIAL_AT: 1000
})

export const toBN = (x: number | string | BN): BN => {
  if (isNaN(Number(x))) return new BN(0)
  if (x instanceof BN) return x

  if (typeof x === 'string') {
    if (x.indexOf('0x') === 0 || x.indexOf('-0x') === 0) {
      return new BN((x).replace('0x', ''), 16)
    }
  }
  return new BN(x)
}

export const baseToTags = (b: Base): Tag[] => {
  return [
    { name: 'Data-Protocol', value: b['Data-Protocol'] },
    { name: 'Variant', value: b.Variant },
    { name: 'Type', value: b.Type }
  ]
}

const checkDuplicateTags = (tags: Tag[]): void => {
  const seen = new Set<string>()
  for (const tag of tags) {
    if (seen.has(tag.name)) {
      throw new Error(`duplicate tag: ${tag.name}`)
    }
    seen.add(tag.name)
  }
}

export const messageToTags = (msg: Message): Tag[] => {
  let tags: Tag[] = baseToTags(msg.Base)

  if (msg.Action !== '') {
    tags.push({ name: 'Action', value: msg.Action })
  }
  if (msg['From-Process'] !== '') {
    tags.push({ name: 'From-Process', value: msg['From-Process'] ?? '' })
  }
  if (msg['Pushed-For'] !== '') {
    tags.push({ name: 'PushedFor', value: msg['Pushed-For'] })
  }
  if (msg.Sequence !== '') {
    tags.push({ name: 'Sequence', value: msg.Sequence })
  }

  if (msg.Tags != null) {
    tags = tags.concat(msg.Tags)
  }

  checkDuplicateTags(tags)

  return tags
}

export const mergeTags = (tags1: Tag[], tags2: Tag[]): Tag[] => {
  const tagMap = new Map<string, string>()

  // 先放入 tags1 的内容，保留它们的优先级
  for (const tag of tags1) {
    tagMap.set(tag.name, tag.value)
  }

  // 加入 tags2 的项，如果 name 不存在才加
  for (const tag of tags2) {
    if (!tagMap.has(tag.name)) {
      tagMap.set(tag.name, tag.value)
      tags1.push(tag) // 保留原始结构
    }
  }

  return tags1
}
export const getDefaultBase = (defaultBaseType: BaseType, hmInfo: HMInfo): Base => {
  return {
    'Data-Protocol': hmInfo.Protocol,
    Variant: hmInfo.Variant,
    Type: defaultBaseType
  }
}
