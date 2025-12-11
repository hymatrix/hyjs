
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import { stringify as qsStringify } from 'query-string'
import { MessageItem, BundleItem, ResponseResult, HMInfo, HMNodeMap, HMNode, MessageItemMap, Module, TrySendRequest } from '../types/index'
import { toBN } from '../utils'

// `validateStatus` defines whether to resolve or reject the promise for a given
// HTTP response status code. If `validateStatus` returns `true` (or is set to `null`
// or `undefined`), the promise will be resolved; otherwise, the promise will be rejected.
const validateStatus = function (status: number): boolean {
  return status >= 200 && status < 300 // default
}

const rConfig = {
  timeout: 15000,
  validateStatus,
  headers: {
    'Content-Type': 'application/json'
  }
}

export const sendRequest = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  return await new Promise((resolve, reject) => {
    axios({
      ...rConfig,
      ...config
    }).then((res: AxiosResponse) => {
      if (res.data !== undefined) {
        resolve(res)
      } else {
        reject(new Error(`${config.url ?? ''}: null response`))
      }
    }).catch(error => {
      if (isString(error)) {
        reject(new Error(error))
      } else if (isObject(error.response) && isObject(error.response.data)) {
        // like { error: 'err_invalid_signature' }
        reject(new Error(error.response.data.error))
      } else {
        reject(new Error(error))
      }
    })
  })
}

export const getInfo = async (apiHost: string): Promise<HMInfo> => {
  const url = `${apiHost}/info`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}
export const getResult = async (apiHost: string, processId: string, msgId: string): Promise<MessageItem> => {
  const url = `${apiHost}/result/${processId}/${msgId}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getResults = async (apiHost: string, processId: string, limit: number): Promise<MessageItemMap> => {
  const queryStr = qsStringify({
    sort: 'DESC',
    limit
  })
  const url = `${apiHost}/results/${processId}${queryStr !== '' ? `?${queryStr}` : ''}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getMessage = async (apiHost: string, msgId: string): Promise<BundleItem> => {
  const url = `${apiHost}/message/${msgId}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getMessageByNonce = async (apiHost: string, processId: string, nonce: number): Promise<BundleItem> => {
  const url = `${apiHost}/messageByNonce/${processId}/${nonce}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getAssignByNonce = async (apiHost: string, processId: string, nonce: number): Promise<BundleItem> => {
  const url = `${apiHost}/assignmentByNonce/${processId}/${nonce}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getAssignByMessage = async (apiHost: string, msgId: string): Promise<BundleItem> => {
  const url = `${apiHost}/assignmentByMessage/${msgId}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getNodes = async (apiHost: string): Promise<HMNodeMap> => {
  const url = `${apiHost}/nodes`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getNode = async (apiHost: string, accid: string): Promise<HMNode> => {
  const url = `${apiHost}/node/${accid}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getNodesByProcess = async (apiHost: string, processId: string): Promise<HMNode[]> => {
  const url = `${apiHost}/nodesByProcess/${processId}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getProcesses = async (apiHost: string, accid: string): Promise<string[]> => {
  const url = `${apiHost}/processes/${accid}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getBalanceOfByAccid = async (apiHost: string, accid: string): Promise<string> => {
  const url = `${apiHost}/balanceof/${accid}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return toBN(result.data).toString()
}

export const getStakeOfByAccid = async (apiHost: string, accid: string): Promise<string> => {
  const url = `${apiHost}/stakeof/${accid}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return toBN(result.data).toString()
}

export const send = async (apiHost: string, data: ArrayBuffer): Promise<ResponseResult> => {
  const url = `${apiHost}/`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'POST',
    data
  })
  return result.data
}

export const getCacheByPidAndKey = async (apiHost: string, pid: string, key: string): Promise<string> => {
  const url = `${apiHost}/cache/${pid}/${key}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getModules = async (apiHost: string): Promise<string[]> => {
  const url = `${apiHost}/modules`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const getModuleByMid = async (apiHost: string, mid: string): Promise<Module> => {
  const url = `${apiHost}/module/${mid}`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'GET'
  })
  return result.data
}

export const trySend = async (apiHost: string, params: TrySendRequest): Promise<string> => {
  const url = `${apiHost}/trysend`
  const result = await sendRequest({
    ...rConfig,
    url,
    method: 'POST',
    data: params
  })
  return result.status === 200 ? 'ok' : result.data
}
