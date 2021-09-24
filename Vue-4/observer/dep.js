/*
 * @Author: uneedcode
 * @Date: 2021-09-24 16:21:23
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-24 19:22:38
 * @Description: dep和watcher是多对多的关系
 */
// dep和watcher是多对多的关系
// 每个属性都有自己的dep
let id = 0; //dep实例的唯一标识
export default class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; //这个是存放watcher的容器
  }
  depend() {
    // 如果存在当前watcher
    if (Dep.target) {
      Dep.target.addDep(this); // 把自身-dep实例存放在watcher里面
    }
  }
  notify() {
    // 依次执行subs里面的watcher更新方法
    this.subs.forEach((watcher) => watcher.update());
  }
  addSub(watcher) {
    // 把watcher加入到自身的subs容器
    this.subs.push(watcher);
  }
}
// 默认将Dep.target设为null
Dep.target = null;

// Dep也是一个构造函数 可以理解为观察者模式里面的被观察者
// 在subs里面收集watcher 当数据变化的时候通知自身subs所有的watcher更新
// Dep.target是一个全局Watcher指向  初始状态是null

// 栈结构用来存放watcher
const targetStack = [];
export function pushTarget(watcher) {
  targetStack.push(watcher);
  Dep.target = watcher; // Dep.target指向当前watcher
}
export function popTarget() {
  targetStack.pop(); // 当前watcher出栈 拿到上一个watcher
  Dep.target = targetStack[targetStack.length - 1];
}

// 定义相关的方法收集依赖的同时 把自身也放到watcher的deps容器里面去
// 思考？这时对象的更新已经可以满足了
// 但是如果是数组 类似{a:[1,2,3]} a.push(4)并不会触发自动更新
// 因为数组并没有收集依赖
