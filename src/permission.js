// 权限管理

/* 
   在登陆这个流程中，permission.js这个是最重要的一环，
   其实这个文件就是路由的全局钩子（beforeEach和afterEach），
   全局钩子的意思就是每次跳转的时候可以根据情况进行拦截，不让它进行跳转。
   使用场景最常见的就是有些页面需要用户登陆之后才能访问，就可以在beforeEach中校验用户是否登陆来进行相对应的拦截处理。
   下面会详细的讲解permission.js的内容。
   用一句话来概括：是否登陆？没有就给我老老实实登陆。是否有用户信息？没有就给我获取用户信息，
   并且生成可访问路由然后利用addRoutes进行添加。
*/
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 获取token
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  /* 是否显示环形进度动画，默认true。 */
  showSpinner: false,
}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // 没有重定向，白名单
// 从这里的逻辑可以看到,登陆后,现在判断了用户权限,如果没权限就会进入之前说到的GetUserInfo方法去获取权限,
// 由于要对目录进行控制,所以在GetUserInfo 里我们也需要获取到目录的权限列表，只需要获取到有的就行了，没有权限的目录就不需要获取。
// 在GetUserInfo 的最后通过 resolve方法把返回值返回这个页面,截图中 module 就是我获取到的有权限的目录列表，然后通过
// GenerateRoutes 来生成要加载的目录，接下来就是改这了
router.beforeEach(async (to, from, next) => {
  // 加载进度条
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 并且要前往的路径是'/login'  则返回 '/'
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // 从store中取得用户的 roles, 也就是用户的权限 并且用户的权限数组必须有一个以上
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 有权限则直接进入
      if (hasRoles) {
        next()
      } else {
        // 没有权限的话
        try {
          // 获取用户信息
          // 获到角色必须是一个对象数组 such as: ['admin'] or ,['developer','editor']
          // const { roles } = await store.dispatch('getInfo')
          // 第一个 user/getInfo
          const { roles } = await store.dispatch('user/getInfo')
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          // 根据roles生成可访问的路由
          // store.dispatch('generateRoutes', roles)
          // 第二个这个是动态路由中的重要一步，生成可访问路由，根据当前用户的权限数组，和路由中可访问的权限数组，进行匹配生成。
          router.addRoutes(accessRoutes)
          // hack方法，以确保addRoutes是完整的
          // 设置replace: true，这样导航就不会留下历史记录
          // 进入路由
          next({ ...to, replace: true })
        } catch (error) {
          // 删除令牌并转到登录页重新登录,如果出现异常  清空路由
          await store.dispatch('user/resetToken')
          // Message提示错误
          Message.error(error || 'Has Error')
          // 跳到login页面重新登陆
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token 也就是没有登陆的情况下
    // 判断是否是白名单(也就是说不需要登陆就可以访问的路由)

    if (whiteList.indexOf(to.path) !== -1) {
      // 在免费登录白名单，直接去
      next()
    } else {
      // 其他的一路给我跳到login页面 老老实实的进行登陆
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条加载完成
  NProgress.done()
})

/*
  https://juejin.im/post/5d53f6c8f265da03ed1949f8

  总结：
  1.Login/index.vue点击登陆 提交user/login的actions。
  2.user/login进行登陆验证，登陆成功之后保存token到vuex和cookie中。
  3.回到Login/index.vue跳转路由，这时就到了permission.js
  4.permission.js进行判断是否登陆，是否有用户信息？没有用户信息就获取用户信息，
  并且保存到vuex，然后根据用户信息中的roles生成可访问路由，并通过addRoutes进行添加。
 */
