import observe from './observer/index'
import Component from './compile/index'
import { parsePath } from './utils/index'

export default class MVue {
  constructor(options) {
    const { el, data, methods, created } = options
    if (data) {
      this.data = typeof data === 'function' ? data() : data
      this.proxy(this.data)
      observe(this.data)
    }
    Object.assign(this, methods)
    created && created.call(this)
    if (el) {
      this.elSelector = el
      // this.render()
    }
  }
  static Component(options) {
    const { name, template } = options
    const component = new Component(name, template)
    if (!MVue.Components[name]) {
      MVue.Components[name] = { options, component }
    }
  }
  render() {
    const elSelector = this.elSelector
    const app = document.querySelector(elSelector)
    Object.keys(MVue.Components).forEach((name) => {
      const els = app.querySelectorAll(name)
      if (els.length > 0) {
        const { options, component } = MVue.Components[name]
        els.forEach((element) => {
          const mVue = new MVue(options)
          if (element.attributes.length > 0) {
            const attributes = [...element.attributes]
            attributes.forEach((item) => {
              proxyProps({
                cMVue: mVue,
                mVue: this,
                key: convertNamingFormat(item.localName),
                exp: item.nodeValue
              })
            })
          }
          element.parentNode.replaceChild(
            component.createComponent(mVue),
            element
          )
        })
      }
    })
  }
  proxy(data) {
    const me = this
    // console.log(Object.keys(data))
    Object.keys(data).forEach(function (key) {
      Object.defineProperty(me, key, {
        configurable: false,
        enumerable: true,
        get: function () {
          return me.data[key]
        },
        set: function (newVal) {
          me.data[key] = newVal
        }
      })
    })
  }
}
MVue.Components = {}

function proxyProps(option) {
  const { cMVue, mVue, key, exp } = option
  Object.defineProperty(cMVue, key, {
    configurable: false,
    enumerable: true,
    get: function () {
      const getter = parsePath(exp)
      return getter.call(mVue, mVue)
    }
  })
}

function convertNamingFormat(name) {
  let key = name
  if (/-/.test(key)) {
    const keyArr = key.split('-')
    for (let i = 1; i < keyArr.length; i++) {
      const element = keyArr[i]
      keyArr[i] = element.replace(element[0], element[0].toUpperCase())
    }
    key = keyArr.join('')
  }
  return key
}
