/*
 * @Author: uneedcode
 * @Date: 2021-09-23 11:47:30
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-23 11:47:31
 * @Description: 对象数据劫持
 */
// 2.对象数据劫持
import { arrayMethods } from "./array";
import Dep from "./dep";
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
  let childOb = observe(value); // childOb就是Observer实例

  let dep = new Dep(); // 为每个属性实例化一个Dep被观察者

  // 如果value还是一个对象会继续走一遍defineReactive层层遍历直到value不是对象才停止
  // 思考 如果vue数据嵌套层级过深》》性能会受影响
  Object.defineProperty(data, key, {
    get() {
      // 新的
      // 页面取值时，可以把watcher收集到dep里面 --依赖收集
      if (Dep.target) {
        // 如果有watcher dep就会保存watcher 同时watcher也会保存dep
        dep.depend();
        if (childOb) {
          // 这里表示 属性的值依然是一个对象 包含数组和对象 childOb指代的就是Observer实例对象 里面的dep进行依赖收集
          // 比如{a:[1,2,3]} 属性a对应的值是一个数组 观测数组的返回值就是对应数组的Observer实例对象
          childOb.dep.depend();
          if (Array.isArray(value)) {
            // 如果数据结构类似{a:[1,2,[3,4,[5,6]]]} 这种数组多层嵌套 数组包含数组的情况
            // 那么我们访问a的时候 只是对第一层的数组进行了依赖收集 里面的数组因为没有访问到
            // 所以无法收集依赖
            // 但是如果我们改变了a的第二层数组的值 是需要更新页面的 所以需要对数组递归进行依赖收集
            if (Array.isArray(value)) {
              // 如果内部还是数组
              dependArray(value); // 不停的进行依赖收集
            }
          }
        }
      }

      console.log("获取值");
      return value;
    },
    set(newVal) {
      if (newVal === value) return;

      // 新的
      // 如果赋值的新值时一个对象 需要观测
      observe(newVal);

      console.log("设置值");
      value = newVal;

      // 新的
      dep.notify(); // 通知渲染watcher去更新  --派发更新
    },
  });
}
// 以上代码就是依赖收集和派发更新的核心 其实就是在数据被访问的时候
// 把我们定义好的渲染watcher放进dep的subs数组里面
// 同时把dep实例对象也放到渲染watcher里面去
// 数据更新时就可以通知dep的subs存储的watcher更新
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

// 递归收集数组依赖
function dependArray(value) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i];
    // e.__ob__代表已经被响应式观测了 但是没有收集依赖 所以把他们收集到自己的Observer实例的dep里面
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      // 如果数组里面还有数组 就递归去收集依赖
      dependArray(e);
    }
  }
}

// 如果对象属性的值是一个数组 那么执行childOb.dep.depend()收集数组的依赖
// 如果数组里面还有数组,需要递归遍历收集 因为只有访问数据触发了get才会去收集依赖
// 一开始只是递归对数据进行响应式处理无法收集依赖 这两点要分清
