<!--
 * @Author: uneedcode
 * @Date: 2021-09-23 10:52:21
 * @LastEditors: uneedcode
 * @LastEditTime: 2021-09-24 08:33:22
 * @Description: file content
-->

基于 vue2.0
问题 1: data 里面能不能直接使用 prop 的值，为什么？
思考：不能直接使用，因为初始化时没有值，无法添加 object.defineproperty 来监听数据变化
问题 2: Object.defineProperty 缺点？
思考：对象新增或删除的属性无法被 set 监听到，只有对象本身存在的属性才会被劫持
