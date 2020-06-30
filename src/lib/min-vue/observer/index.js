import { def } from '../utils/index'
import arrProto from './array'
import Dep from './dep'

const arrayKeys = Object.getOwnPropertyNames(arrProto)

/**
 * 监听
 * @param {Object} data
 */
export default function observe(data) {
  if (typeof data !== 'object' || data === null) {
    // 不是对象或数组
    return
  }
  let ob
  if (data.hasOwnProperty('__ob__') && data.__ob__ instanceof Observer) {
    ob = data.__ob__
  } else {
    ob = new Observer(data)
  }
  return ob
}

/**
 *
 * @param {obj} target
 * @param {*} src
 * @param {*} keys
 */
function addSelfMethod(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * 定义响应式
 * @param {Object} data 数据
 * @param {string} key 属性名
 * @param {*} val 值
 */
function defineReactive(obj, key, value) {
  const dep = new Dep()
  let val = value
  let childOb = observe(val) // 递归深度遍历，实现深度监听
  Object.defineProperty(obj, key, {
    enumerable: true, // 可枚举
    configurable: true, // 当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。
    get: function () {
      // val 闭包
      if (Dep.target) {
        if (childOb) {
          childOb.dep.addSub(Dep.target)
        } else {
          dep.addSub(Dep.target)
        }
      }
      // console.log('取值')
      return val
    },
    set: function (newVal) {
      if (childOb) {
        let temp = childOb.dep
        childOb = observe(newVal) // 递归深度遍历，实现深度监听
        childOb.dep.subs.push(...temp.subs)
      }
      // val 一直在闭包中，此处设置完之后，再 get 时也是会获取最新的值
      // console.log(dep.subs)
      val = newVal

      if (childOb) {
        childOb.dep.notify()
      } else {
        dep.notify()
      }
    }
  })
}

class Observer {
  constructor(data) {
    this.data = data
    this.dep = new Dep()
    def(data, '__ob__', this)
    if (Array.isArray(data)) {
      if ('__proto__' in {}) {
        data.__proto__ = arrProto
      } else {
        addSelfMethod(data, arrProto, arrayKeys)
      }
      this.observeArr(data)
    } else {
      this.observeObj(data)
    }
    // observe(data)
  }

  observeObj(obj) {
    const keys = Object.keys(obj)
    // console.log(keys)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
  observeArr(arr) {
    for (let i = 0; i < arr.length; i++) {
      observe(arr[i])
    }
  }
}
