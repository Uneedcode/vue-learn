/*
 * @Author: uneedcode
 * @Date: 2021-09-23 11:34:34
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-23 11:34:35
 * @Description: vue初始化 数据处理、事件处理、生命周期处理等
 */
import { initState } from "./state";
import { compileToFunctions } from "./compiler/index";
export function initMixin(Vue) {
  // 给vue的原型添加_init方法
  Vue.prototype._init = function (options) {
    const vm = this;
    //这里的this是调用_init的实例对象
    //  vm.$options是用户new Vue时传入的参数
    vm.$options = options;
    //  初始化状态
    initState(vm);

    // 如果有el属性，则进行模板渲染 模板编译入口
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };

  // 这块代码在源码里面的位置其实是放在entry-runtime-with-compiler.js里面
  // 代表的是vue源码里面包含了compile编译功能 这个和runtime-only版本需要区分开
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    // 如果不存在render属性
    if (!options.render) {
      // 如果存在template属性
      let template = options.template;
      if (!template && el) {
        // 如果不存在template和render，存在el，直接将模板赋值到el所在的外层html结构（即el本身，不是el的父元素）
        template = el.outerHTML;
      }
      // 最终需要将template模板转化为render函数
      if (template) {
        const render = compileToFunctions(template);
        options.render = render;
      }
    }
  };
}
// intiMixin把_init方法添加到Vue原型上供Vue实例使用
