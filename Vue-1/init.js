/*
 * @Author: uneedcode
 * @Date: 2021-09-23 11:34:34
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-23 11:34:35
 * @Description: vue初始化 数据处理、事件处理、生命周期处理等
 */
import { initState } from "./state";
export function initMixin(Vue) {
  // 给vue的原型添加_init方法
  Vue.prototype._init = function (options) {
    const vm = this;
    //这里的this是调用_init的实例对象
    //  vm.$options是用户new Vue时传入的参数
    vm.$options = options;
    //  初始化状态
    initState(vm);
  };
}
// intiMixin把_init方法添加到Vue原型上供Vue实例使用
