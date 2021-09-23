/*
 * @Author: uneedcode
 * @Date: 2021-09-23 11:41:32
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-23 12:07:12
 * @Description: file content
 */
import { observe } from "./observer/index";
// 初始化状态的顺序
// prop>methods>data>computed>watch
export function initState(vm) {
  // 获取传入的数据对象
  const opts = vm.$options;
  if (opts.props) {
    initProps(vm);
  }
  if (opts.methods) {
    initMethod(vm);
  }
  if (opts.data) {
    initData(vm);
  }
  if (opts.computed) {
    initComputed(vm);
  }
  if (opts.watch) {
    initWatch(vm);
  }
}

// 初始化data数据
function initData(vm) {
  let data = vm.$options.data;
  // 实例的_data属性就是传入的data
  // vue组件data推荐使用函数，防止数据在组件之间共享
  data = vm._data = typeof data === "function" ? data.call(vm) : data || {};
  // 将数据代理到vm也就是实例上面，就可以通过this.xx来访问this._data.xx
  for (let key in data) {
    proxy(vm, "_data", key);
  }
  // 对数据进行观察 -- 响应式数据核心
  observe(data);
}
// data数据代理
function proxy(object, sourceKey, key) {
  Object.defineProperty(object, key, {
    get() {
      return object[sourceKey][key];
    },
    set(newVal) {
      object[sourceKey][key] = newVal;
    },
  });
}
// initState主要关注observe是响应式数据核心
// 所以另建observer文件夹来专注响应式逻辑
// 其次做了一层数据代理，把data代理到实例this上
