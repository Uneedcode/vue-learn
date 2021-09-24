/*
 * @Author: uneedcode
 * @Date: 2021-09-23 16:07:08
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-23 22:25:45
 * @Description: 模板转化核心方法
 */
import { parse } from "./parse";
import { generate } from "./codegen";
export function compileToFunctions(template) {
  // 我们需要把html字符串变成render函数
  // 1.把html代码转成ast语法树 ast用来描述代码本身形成树结构 不仅可以描述html，也能描述css以及js语法
  // 很多库用到了ast 比如webpack babel eslint等等
  let ast = parse(template);
  // 2.优化静态节点
  // 这个可以看源码，不影响核心功能就不实现了
  // if(options.optimize!==false){
  //     optimize(ast,options)
  // }
  // 3.通过ast重新生成代码
  // 我们最后生成的代码要和render函数一样
  // 类似_c('div',{id:'app'},_c('div',undefined,_v("hello"+_s(name)),_c('span',undefined,_v("world"))))
  // _c代表创建元素，_v代表创建文本，_s代表Json.stringfy --把对象解析成文本
  let code = generate(ast);
  // 使用with语法改变作用域this 之后调用render函数可以使用call改变this 方便code里面的变量取值
  let renderFn = new Function(`with(this){return ${code}}`);
  return renderFn;
}
// compiler文件夹表示编译相关功能 核心导出compileToFunctions 函数主要有三个步骤
// 1.生成ast语法树
// 2.优化静态节点
// 3.根据ast生成render函数
