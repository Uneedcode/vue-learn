/*
 * @Author: uneedcode
 * @Date: 2021-09-24 11:16:59
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-24 11:17:00
 * @Description: patch用来渲染和更新视图 今天只介绍初次渲染逻辑
 */
export function patch(oldVnode, vnode) {
  // 判断传入的oldVnode是否是一个真实元素
  // 这里很关键 初次渲染 传入的vm.$el就是咱们传入的el选项 所以是真实dom
  // 如果不是初始渲染而是视图更新的时候 vm.$el就被替换成了更新之前的老的虚拟dom
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    // 这里是初次渲染的逻辑
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;
    // 将虚拟dom转化成真实dom节点
    let el = createElm(vnode);
    // 插入到老的el节点下一个节点的前面 就相当于插入到老的el节点后面
    // 这里不使用父元素appendChild是为了不破坏替换的位置
    parentElm.insertBefore(el, oldElm.nextSibling);
    // 删除老的el节点
    parentElm.removeChild(oldVnode);
    return el;
  }
}

// 虚拟dom转成真实dom 就是调用原生方法生成dom树
function createElm(vnode) {
  let { tag, data, key, children, text } = vnode;
  // 判断虚拟dom是元素节点还是文本节点
  if (typeof tag === "string") {
    // 虚拟dom的el属性指向真实dom
    vnode.el = document.createElement(tag);
    // 解析虚拟dom属性
    updateProperties(vnode);
    // 如果有子节点就递归插入到父节点里面
    children.forEach((child) => {
      return vnode.el.appendChild(createElm(child));
    });
  } else {
    // 文本节点
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}

// 解析vnode的data属性 映射到真实dom上
function updateProperties(vnode) {
  let newProps = vnode.data || {};
  let el = vnode.el; // 真实节点
  for (let key in new newProps()) {
    // style需要特殊处理下
    if (key === "style") {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === "class") {
      el.className = newProps.class;
    } else {
      // 给这个属性添加属性 值就是对应的值
      el.setAttribute(key, newProps[key]);
    }
  }
}
// _update核心方法就是patch初始渲染和后续更新都是共用这个方法
// 只是传入的第一个参数不同，初始渲染总体思路是根据虚拟dom(vnode)调用原生js传教真实dom并替换掉el选项的位置
