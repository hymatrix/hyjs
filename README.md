# hyjs-test

> 一个用于与 HyMatrix 去中心化计算与消息协议交互的 JavaScript/TypeScript SDK，支持 Ethereum、Arweave、AO 网络。

[![NPM version](https://img.shields.io/npm/v/hyjs-test.svg)](https://www.npmjs.com/package/hyjs-test)  
[![License: MIT](https://img.shields.io/npm/l/hyjs-test.svg)](./LICENSE)

---

## 功能特点

- 查询 HyMatrix 网络节点和进程信息  
- 查询消息及任务分配（Assignment）数据  
- 支持发送签名消息到 HyMatrix 网络  
- 支持 Arweave Bundle、Ethereum 签名等多种签名方式  
- 自动处理标签（Tags）合并与校验  
- 友好的 TypeScript 类型支持

---

## 安装

```bash
npm install hyjs-test
# 或
yarn add hyjs-test

```

```ts
import HyMatrix from 'hyjs-test'

const sdk = new HyMatrix({
  accid: '你的账号ID',
  debug: false
})

async function main() {
  const info = await sdk.info()
  console.log('网络信息:', info)

  const msgId = '消息ID'
  const result = await sdk.getResult(msgId)
  console.log('消息结果:', result)
}

main()
```


| 方法                      | 描述               | 参数                                   | 返回值                     |
| ----------------------- | ---------------- | ------------------------------------ | ----------------------- |
| `info()`                | 获取 HyMatrix 网络信息 | 无                                    | Promise<HMInfo>         |
| `getResult(msgId)`      | 根据消息ID查询结果       | `msgId: string`                      | Promise<MessageItem>    |
| `getResults(processId)` | 获取指定进程的所有结果      | `processId: string`, `limit: number` | Promise<MessageItemMap> |
| `getMessage(msgId)`     | 查询消息详细信息         | `msgId: string`                      | Promise<BundleItem>     |
| `getAssignByNonce(...)` | 根据随机值查询任务分配      | `processId: string`, `nonce: number` | Promise<BundleItem>     |
| `getNodes()`            | 获取所有节点信息         | 无                                    | Promise<HMNodeMap>      |
| `getNode(accid?)`       | 查询单个节点信息         | `accid?: string`                     | Promise<HMNode>         |
| `getProcesses(accid?)`  | 查询账号创建的进程列表      | `accid?: string`                     | Promise\<string\[]>     |
| `balanceOf(accid?)`     | 查询账号余额           | `accid?: string`                     | Promise<string>         |
| `stakeOf(accid?)`       | 查询账号质押           | `accid?: string`                     | Promise<string>         |
| `sendMessage(params)`   | 发送签名消息           | `params: SendMessageParams`          | Promise<FormatResponse> |
