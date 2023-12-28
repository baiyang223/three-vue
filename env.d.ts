/// <reference types="vite/client" />
declare module 'element-plus/dist/locale/zh-cn.mjs'
declare module '@element-plus/icons-vue'
declare module 'three'
declare module '*.vue' {
    import type {DefineComponent} from "vue";
    const component: DefineComponent<any, any, {}>
    export default component
}
