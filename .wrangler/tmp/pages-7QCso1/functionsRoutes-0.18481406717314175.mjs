import { onRequestPost as __api_subscribe_js_onRequestPost } from "/Users/fiegellansknowledge/Documents/Documents - Christopher’s MacBook Pro/nsb-tools/functions/api/subscribe.js"

export const routes = [
    {
      routePath: "/api/subscribe",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_subscribe_js_onRequestPost],
    },
  ]