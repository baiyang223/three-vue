import './assets/main.css'
import 'virtual:svg-icons-register'
import 'element-plus/dist/index.css'

import type { Component } from 'vue'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/dist/locale/zh-cn.mjs'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import DataVVue3 from '@kjgl77/datav-vue3'

import router from './router'
import globalComponent from '@/components/SvgIcon/index'

import App from '@/App.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue))
  app.component(key, <Component>component)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { locale })
app.use(globalComponent)
app.use(DataVVue3)

app.mount('#app')
