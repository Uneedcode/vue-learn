/*
 * @Author: uneedcode
 * @Date: 2021-09-24 09:24:17
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-24 09:24:18
 * @Description: render函数转化为虚拟dom核心方法 _render
 */
import { createElement, createTextNode } from "./vdom/index";
export function renderMixin(Vue) {
  Vue.prototype._render = function () {
    const vm = this;
    // 获取模板编译生成的render方法
    const { render } = vm.$options;
    // 生成虚拟dom
    const vnode = render.call(vm);
    return vnode;
  };

  // render函数里面有_c_v_s方法需要定义
  Vue.prototype._c = function (...args) {
    // 创建虚拟dom元素
    return createElement(...args);
  };
  Vue.prototype._v = function (text) {
    // 创建虚拟dom文本
    return createTextNode(text);
  };
  Vue.prototype._s = function (val) {
    // 如果模板里面的是一个对象 需要JSON.stringfy
    return val === null
      ? ""
      : typeof val === "object"
      ? JSON.stringify(val)
      : val;
  };
}
// 主要在原型定义了_render方法，还有_c_v_s这些函数
