/*
 * @Author: uneedcode
 * @Date: 2021-09-23 11:03:19
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-23 13:34:34
 * @Description: vue响应式数据原理
 */
// 1.数据初始化
//  new VUE({
//      el:'#app',
//      router,
//      store,
//      render:(h)=>h(App),
//  })

import { initMixin } from "./init.js";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
export default Vue;
