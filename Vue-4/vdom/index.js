/*
 * @Author: uneedcode
 * @Date: 2021-09-24 09:25:03
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-24 09:25:04
 * @Description: 创建虚拟dom
 */
// 定义Vnode类
export default class Vnode {
  constructor(tag, data, key, children, text) {
    this.tag = tag;
    this.data = data;
    this.key = key;
    this.children = children;
    this.text = text;
  }
}

// 创建元素vnode 等于render函数里面的 h=>h(App)
export function createElement(tag, data = {}, ...children) {
  let key = data.key;
  return new Vnode(tag, data, key, children);
}

// 创建文本node
export function createTextNode(text) {
  return new Vnode(undefined, undefined, undefined, undefined, text);
}

// 代表虚拟dom相关功能 定义Vnode类以及createElement和createTextNode方法都返回vnode
