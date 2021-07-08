import { shallowMount } from '@vue/test-utils' // 创建一个包含被挂载和渲染的 Vue 组件的 Wrapper
import SvgIcon from '@/components/SvgIcon/index.vue' // 引入组件
describe('SvgIcon.vue', () => {
  // describe 代表一个作用域
  it('iconClass', () => {
    // iconClass 这里只是一个自定义的描述性文字
    const wrapper = shallowMount(SvgIcon, {
      // 通过shallowMount 生成了一个包裹器，包括了一个挂载组件或 vnode，以及测试该组件或 vnode 的方法
      propsData: {
        iconClass: 'test',
      },
      // 可以带参数，这里我通过 propsData 传递了接口数据
    })
    expect(wrapper.find('use').attributes().href).toBe('#icon-test')
    // .vm 可以获取当前实例对象，相当于拿到了vue组件里的 this 对象
    // find()可以匹配各种类型的选择器，类似于选中 DOM, text() 就是获取其中的内容
    // toEqual 是一个断言，判断结果为 ‘test’ 时，通过测试，否则猜测是失败
  })
  it('className', () => {
    const wrapper = shallowMount(SvgIcon, {
      propsData: {
        iconClass: 'test',
      },
    })
    expect(wrapper.classes().length).toBe(1)
    // 在创建的时候修改了props中msg的值
    wrapper.setProps({ className: 'test' })
    expect(wrapper.classes().includes('test')).toBe(true)
    // classes() 方法，返回class名称的数组。或在提供class名的时候返回一个布尔值
    // toBe 和toEqual 类似，区别在于toBe 更严格限于同一个对象，如果是基本类型则没什么区别
  })
})
