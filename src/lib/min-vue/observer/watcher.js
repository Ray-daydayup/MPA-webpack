import { parsePath } from '../utils/index'
import Dep from '../observer/dep.js'

export default class Watcher {
  constructor(mVue, exp, callback) {
    this.callback = callback
    this.mVue = mVue
    this.exp = exp
    Dep.target = this
    this.value = this.get()
    this.immediate = false
    Dep.target = null
    this.update()
  }
  addDep(dep) {
    dep.addSub(this)
  }
  update() {
    const value = this.get()
    if (this.value !== value || this.immediate) {
      this.callback(value, this.value)
      this.value = value
    }
  }
  get() {
    const getter = parsePath(this.exp)
    return getter.call(this.mVue, this.mVue)
  }
}
