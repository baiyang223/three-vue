import type { App, Component } from 'vue'
import SvgIcon from './index.vue'

const components: { [name: string]: Component } = { SvgIcon }
// 对外暴漏插件对象
export default {
  // 务必叫做install方法
  install(app: App) {
    // 注册项目全部的全局组件
    Object.keys(components).forEach((key: string) => {
      // 注册为全局组件
      app.component(key, components[key])
    })
  },
}
