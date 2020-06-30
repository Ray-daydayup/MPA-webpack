import '@/styles/base.less'
import '@/styles/grid.less'
import '@/styles/iconfont.css'
import '@/styles/index.less'
import '@/lib/rem.js'

import MVue from '@/components/index'
import { getCount } from '@/api/index.js'

setTimeout(() => {
  document.querySelector('#mask').style.display = 'none'
}, 1000)
const mVue = new MVue({
  el: '#app',
  data: {
    name: 'ztr',
    a: '12345454',
    b: 1521513021,
    count: {
      articleCount: 0,
      categoryCount: 0,
      tagCount: 0
    }
  },
  async created() {
    await this.getCount()
  },
  methods: {
    async getCount() {
      const res = await getCount()
      if (res.flag) {
        this.count = res.data
      }
    }
  }
})
mVue.render()
