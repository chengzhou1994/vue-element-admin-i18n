/* 
  在编写测试用例之前，我们先来简单了解一下 Vue Test Utils 的 几个 API 以及 Wrapper
  mount: 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper
  shallowMount: 与mount作用相同，但是不渲染子组件
  render: 将一个对象渲染成为一个字符串并返回一个 cheerio 包裹器
  createLocalVue:  返回一个 Vue 的类供你添加组件、混入和安装插件而不会污染全局的 Vue 类
  wrapper: 一个 wrapper 是一个包括了一个挂载组件或 vnode，以及测试该组件或 vnode 的方法。
  wrapper.vm: 可以访问一个实例所有的方法和属性
  wrapper.setData() : 同Vue.set()
  wrapper.trigger(): 异步触发事件
  wrapper.find(): 返回DOM节点或者Vue组件 
*/

import { shallowMount } from '@vue/test-utils'
import Hamburger from '@/components/Hamburger/index.vue'
describe('Hamburger.vue', () => {
  it('toggle click', () => {
    // 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper
    const wrapper = shallowMount(Hamburger)
    // 创建mock函数
    const mockFn = jest.fn()
    wrapper.vm.$on('toggleClick', mockFn)
    // trigger()可以触发一个事件，这里模拟了点击
    wrapper.find('.hamburger').trigger('click')
    // 查看是否有回调
    expect(mockFn).toBeCalled()
  })

  it('prop isActive', () => {
    const wrapper = shallowMount(Hamburger)
    // 在创建的时候修改了props中msg的值
    wrapper.setProps({ isActive: true })
    // 也便于检查已存在的元素
    expect(wrapper.contains('.is-active')).toBe(true)
    wrapper.setProps({ isActive: false })
    expect(wrapper.contains('.is-active')).toBe(false)
  })
})
