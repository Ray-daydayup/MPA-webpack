/**
 * Define a property.
 */
export function def(...args) {
  const [obj, key, val, enumerable = false] = args
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * 比较两个对象是否相等
 */
export function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}
/**
 * 获取变量路径
 * @param {String} expPath 变量路径
 */
export function parsePath(expPath) {
  let path = expPath
  if (path.indexOf('[')) {
    path = path.replace(/\[/g, '.')
    path = path.replace(/\]/g, '.')
    if (/\.$/.test(path)) {
      path = path.slice(0, path.length - 1)
    }
    if (/\.\./.test(path)) {
      path = path.replace('..', '.')
    }
  }
  const bailRE = /[^\w.$]/
  if (bailRE.test(path)) {
    return
  }
  // console.log(expPath, 'here')
  const segments = path.split('.')
  return function (object) {
    let obj = object
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return ''
      let exp = segments[i]
      obj = obj[exp]
    }
    return obj
  }
}
