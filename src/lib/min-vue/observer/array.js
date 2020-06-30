// 重新定义数组原型
const oldArrayProperty = Array.prototype
// 创建新对象，原型指向 oldArrayProperty ，再扩展新的方法不会影响原型
const arrProto = Object.create(oldArrayProperty)
;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(
  (methodName) => {
    arrProto[methodName] = function (...args) {
      const result = oldArrayProperty[methodName].call(this, ...args)
      const ob = this.__ob__
      let inserted
      switch (methodName) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) ob.observeArr(inserted)
      // updateView()
      ob.dep.notify()
      return result
    }
  }
)

export default arrProto
