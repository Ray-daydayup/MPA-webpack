import { handle200, handle401, handle404, handle500 } from './handler'
/**
 * @param {String} flag 默认标志位
 * @param {Function} callback 回调函数
 * @return {Function} 处理函数
 * 工厂函数，制造处理函数
 */
const handler = (flag, callback) => {
  return (response) => {
    const formatRes = {
      data: null,
      rootResponse: response,
      flag: flag
    }
    callback(response, formatRes)
    return formatRes
  }
}

const httpExceptionMap = new Map()

httpExceptionMap.set(200, handler(true, handle200))
httpExceptionMap.set(400, handler(false, handle500))
httpExceptionMap.set(401, handler(false, handle401))
httpExceptionMap.set(404, handler(false, handle404))
httpExceptionMap.set(500, handler(false, handle500))

const handleResponse = function(response) {
  const resStatus = response.status
  if (httpExceptionMap.has(resStatus)) {
    return httpExceptionMap.get(resStatus)(response.data)
  } else {
    console.log('发生未知响应错误 >>', response)
    return handler(false, handle500)(response.data)
  }
}
export default handleResponse
