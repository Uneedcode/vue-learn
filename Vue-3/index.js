/*
 * @Author: uneedcode
 * @Date: 2021-09-23 11:03:19
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-24 15:32:19
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
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";
function Vue(options) {
  this._init(options);
}
// _init方法是挂载在vue原型的方法 通过文件引入方式进行原型挂载需要传入Vue
initMixin(Vue);

// 混入_render
renderMixin(Vue);
// 混入_update
lifecycleMixin(Vue);
export default Vue;
