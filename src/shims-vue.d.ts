/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  WVJBCallbacks: any;
  cocoBridge:any;
  WebViewJavascriptBridge:any
}
