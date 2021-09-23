/*
 * @Author: uneedcode
 * @Date: 2021-09-23 11:47:30
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-23 11:47:31
 * @Description: 对象数据劫持
 */
// 2.对象数据劫持
import { arrayMethods } from "./array";
class Observer {
  constructor(value) {
    if (Array.isArray(value)) {
      // 给每个响应式数据添加一个不可枚举的__ob__属性，并且指向了Observer实例
      // 作用：可以根据这个属性来防止已经被响应式观察的数据反复被观测；
      //      响应式数据可以使用__ob__来获取Observer实例的相关方法，这对数组很关键
      Object.defineProperty(value, "__ob__", {
        // 值指代的就是Observer的实例
        value: this,
        enumerable: false,
        writable: true,
        configurable: true,
      });
      // 这里对数组做了额外的判断
      // 通过重写数组的原型方法来对数组的七种方法进行拦截
      value.__proto__ = arrayMethods;
      // 如果里面还包含数组，需要递归判断
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }
  walk(data) {
    // 对象上所有属性依次进行观测
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let value = data[key];
      defineReactive(data, key, value);
    }
  }
  observeArray(items) {
    for (let i = 0; i < items.length; i++) {
      observe(items[i]);
    }
  }
}
// Object.defineProperty数据劫持核心，兼容性在ie9及以上
function defineReactive(data, key, value) {
  // 观察属性的值 ,递归关键
  observe(value);
  // 如果value还是一个对象会继续走一遍defineReactive层层遍历直到value不是对象才停止
  // 思考 如果vue数据嵌套层级过深》》性能会受影响
  Object.defineProperty(data, key, {
    get() {
      console.log("获取值");
      return value;
    },
    set(newVal) {
      if (newVal === value) return;
      console.log("设置值");
      value = newVal;
    },
  });
}
export function observe(value) {
  // 如果传过来的是对象或数组 进行属性劫持
  if (
    Object.prototype.toString.call(value) === "[object object]" ||
    Array.isArray(value)
  ) {
    return new Observer(value);
  }
}
// 数据劫持的核心defineReactive函数主要使用Object.defineProperty来对数据get和set进行劫持
// 这里就解决了之前的问题,为啥数据变动了视图会自动更新，我们可以在set里面去通知视图更新
// 思考 1.这样的数据劫持方式对数组有什么影响？
// 一个数组里面有上千上万个元素，每个元素都添加get和set方法，对性能来说是承担不起的，所以只能劫持对象
