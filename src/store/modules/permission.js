import { asyncRoutes, constantRoutes } from '@/router'

// 我们来看第二个actions，这个是动态路由中的重要一步，生成可访问路由，
// 根据当前用户的权限数组，和路由中可访问的权限数组(也就是路由元中meta.roles)，进行匹配生成。
/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles 用户拥有角色
 * @param route 待判定路由
 */
function hasPermission(roles, route) {
  // 判断数组中是否存在满足条件的项，只要有一项满足条件，就会返回true。
  // roles.some => Array.some 相当于是只要有一个满足就为true
  // 判断用户的权限于当前路由访问所需要的权限是否有一个满足
  // 比如说用户权限为 ['one','two']  当前路由访问所需要权限为 ['two','three'] 那么就说明当前用户可以访问这个路由

  if (route.meta && route.meta.roles) {
    return roles.some((role) => route.meta.roles.includes(role))
  } else {
    // 默认是可访问的
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes 待过滤路由表,首次传入的就是AsyncRoutes
 * @param roles 用户拥有角色
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
