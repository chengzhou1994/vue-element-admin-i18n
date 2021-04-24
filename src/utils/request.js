import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建一个axios服务实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 5000, // 请求定时
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    /**
     * 在发送请求之前做些什么
     * 判断是否存在token,存在的让每个请求携带token
     * 此处token一般是用户完成登录后储存到localstorage或者vuex中去的
     * 这里是存在vuex中去，使用cookier
     * 一般是在请求头里加入Authorization，并加上Bearer标注：
     */

    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      // config.headers["Authorization"] = "Bearer" + getToken();
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  (error) => {
    // 处理请求错误做些什么
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * 对响应数据做点什么
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 XMLHttpRequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000,
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning',
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      /* if (res.code === 511) {
         // 未授权调取授权接口
       } else if (res.code === 510) {
         // 未登录跳转登录页
       } else {
         return Promise.resolve(response)
       } */
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    console.log('err' + error) // for debug
    /* 对响应错误做点什么
     响应拦截器response.response() 里，error的回调不能做未登录、 未授权的判断，
     因为error是请求失败后的回调， 例如404、 500 ,而未登录和未授权是已经请求成功了，
     只是后端校验不给通过而已，应该放在response成功后的回调里来做判断。
      */
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
