/*
 * @Author: uneedcode
 * @Date: 2021-09-24 09:01:48
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-24 15:40:25
 * @Description: 组件挂载核心方法
 */
export function mountComponent(vm, el) {
  // 上一步模板编译解析生成了render函数
  // 下一步就是执行vm._render()方法 调用生成的render函数 生成虚拟dom
  // 最后使用vm._update()方法把虚拟dom渲染到页面

  // 真实的el选项赋值给实例的$el 为之后虚拟dom产生的新dom替换老的dom做铺垫
  vm.$el = el;
  // _update和_render都是挂载在Vue原型的方法 类似_init
  vm._update(vm._render());
}

// 此文件表示生命周期相关功能 核心导出mountComponent主要使用vm._update(vm._render())进行实例挂载
import { patch } from "./vdom/patch";
export function lifecycleMixin(Vue) {
  // 把_update挂载在Vue的原型
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // patch是渲染vnode为真实dom核心
    patch(vm.$el, vnode);
  };
}
