/*
 * @Author: uneedcode
 * @Date: 2021-09-24 16:01:20
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-24 16:01:21
 * @Description: 定义watcher  订阅数据变化通知
 */
import { pushTarget, popTarget } from "./dep";
// 全局变量id  每次new Watcher都会自增
let id = 0;
export default class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb; // 回调函数 比如在watcher更新之前可以执行beforeUpdate方法
    this.options = options; // 额外的选项 true 代表渲染watcher
    this.id = id++; // watcher的唯一标识
    this.deps = []; // 存放dep的容器
    this.depsId = new Set(); //用来去重dep
    // 如果表达式是一个函数
    if (typeof exprOrFn === "function") {
      this.getter = exprOrFn;
    }
    // 实例化就会默认调用get方法
    this.get();
  }
  get() {
    pushTarget(this); // 调用方法之前先把当前watcher实例推到全局Dep.target上
    this.getter(); // 如果watcher是渲染watcher 那么就相当于执行 vm._update(vm._render()) 这个方法在render函数执行时会取值 从而实现依赖收集
    popTarget(); //在调用方法之后把当前watcher实例从全局Dep.target移除
  }
  // 把dep放到deps里面 同时保证同一个dep只被保存到watcher一次
  // 同样的 同一个watcher也只会保存在dep一次
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      // 直接调用dep的addSub方法 把自己--watcher 实例添加到dep的subs容器里面
      dep.addSub(this);
    }
  }
  // 这里简单的就执行以下get方法 之后涉及到计算属性就不一样了
  update() {
    this.get();
  }
}
// 在observer 文件夹下新建watcher.js代表和观察者相关 这里是vue里面使用到的观察者模式
// 我们可以把Watcher当作观察者 它需要订阅数据的变动 当数据变动之后 通知它去执行某些方法
// 本质就是一个构造函数 初始化时会去执行get方法

// watcher在调用getter方法前后分别把自身赋值给Dep.target方便进行依赖收集
// update方法用来进行更新
