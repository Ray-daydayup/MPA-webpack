import { parsePath } from '../utils/index'
import Watcher from '../observer/watcher.js'
// import Dep from '../observer/dep.js'
import updater from '../compile/updater'

class ElementCompiler {
  constructor(mVue, str) {
    const tagName = str.match(/\w+/)[0]
    this.el = document.createElement(tagName)
    // this.el = el
    this.mVue = mVue
    this.propsMatched = str.match(/\[(.+?)\]/)
    this.textMatched = str.match(/\{(.+?)\}/)
    this.eventMatched = str.match(/@(.+?)\@/)
  }
  init() {
    this.props()
    this.el.textContent = this.text(true)
    this.event()
    return this.el
  }
  props() {
    if (this.propsMatched) {
      this.propsMatched[1]
        .split(',')
        .forEach((item) => this.el.setAttribute(...item.split('="')))
    }
  }
  text(isFirst = false) {
    if (this.textMatched) {
      let textContent = this.textMatched[1]
      const expMatched = textContent.match(/\$(.+?)\$/g)
      if (expMatched) {
        expMatched.forEach((item) => {
          const exp = item.slice(1, item.length - 1)
          if (isFirst) {
            new Watcher(this.mVue, exp, (newVal, oldVal) => {
              updater.text(this.el, this.text())
            })
          }
          const getter = parsePath(exp)
          const val = getter.call(this.mVue, this.mVue)
          textContent = textContent.replace(item, val)
        })
      }
      return textContent
    }
  }
  event() {
    if (this.eventMatched) {
      let [eventName, fn] = this.eventMatched[1].split('=')
      let isStop = false
      let params = []
      // 判断是否阻止事件冒泡
      if (/\./.test(eventName)) {
        eventName = eventName.split('.')[0]
        isStop = true
      }
      if (/:/.test(fn)) {
        ;[fn, ...params] = fn.split(':')
      }
      this.el.addEventListener(eventName, (e) => {
        params = params.map((item) => {
          if (this.mVue[item]) {
            const getter = parsePath(item)
            return getter.call(this.mVue, this.mVue)
          }
          return item
        })
        params.push(e)
        this.mVue[fn](...params)
        if (isStop) {
          e.stopPropagation()
        }
        e.preventDefault()
      })
    }
  }
}

export default class Component {
  constructor(name, str) {
    this.name = name
    this.str = str
    this.mVue = null
  }
  createComponent(mVue) {
    this.mVue = mVue
    const fragment = this.createFragment(this.str)
    this.mVue = null
    // console.log(fragment)
    return fragment
  }
  createFragment(string) {
    let str = string
    const operators = []
    const pointers = []
    const fragment = document.createDocumentFragment()
    let pointer = fragment
    pointers.push(pointer)
    while (str !== '') {
      const firstCharacter = str[0]
      if (/[a-z]/.test(firstCharacter)) {
        const elStr = str.match(/[^>+()]+/)[0]
        str = str.replace(elStr, '')

        const el = new ElementCompiler(this.mVue, elStr).init()
        calculate(el)
      } else {
        str = str.replace(firstCharacter, '')
        operators.push(firstCharacter)
        if (firstCharacter === '(') {
          const partFragment = document.createDocumentFragment()
          pointers.push(pointer)
          pointer = partFragment
          pointers.push(pointer)
        }
        if (firstCharacter === ')') {
          operators.pop()
          const part = pointers.pop()
          pointer = pointers.pop()
          calculate(part)
        }
      }
    }
    return fragment

    function calculate(element) {
      let template = null
      if (element.toString().indexOf('DocumentFragment') !== -1) {
        template = element.children[element.children.length - 1]
      }
      if (operators.length === 0) {
        pointer.appendChild(element)
        if (template) {
          pointer.appendChild(template)
          pointer = template
        } else {
          pointer = element
        }

        return
      }
      const preOperator = operators[operators.length - 1]
      if (preOperator === '>' || preOperator === '(') {
        pointer.appendChild(element)
        if (template) {
          pointer.appendChild(template)
          pointer = template
        } else {
          pointer = element
        }
        operators.pop()
      }
      if (preOperator === '+') {
        pointer.parentNode.appendChild(element)

        if (template) {
          pointer.parentNode.appendChild(template)
          pointer = template
        } else {
          pointer = element
        }
        operators.pop()
      }
    }
  }
}
