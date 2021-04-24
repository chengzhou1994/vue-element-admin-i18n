// 登录，注销，获取用户信息接口 第三方登录接口
import { login, logout, getInfo, loginByThirdparty } from '@/api/user'
// 删除，设置，获取token
import { getToken, setToken, removeToken } from '@/utils/auth'

import router, { resetRouter } from '@/router'
// user.js里面存放主要是用户的登录以及登陆后对token和用户信息在vuex中的处理，
const state = {
  // token
  token: getToken(),
  // 姓名
  name: '',
  // 头像
  avatar: '',
  // 介绍
  introduction: '',
  // 角色
  roles: [],
}

const mutations = {
  // token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 介绍
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  // 姓名
  SET_NAME: (state, name) => {
    state.name = name
  },
  // 头像
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 角色
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
}

const actions = {
  // 用户名登录
  // login
  /* 一句话来概括：登陆验证，登陆成功之后，分别保存token到vuex、cookie中。 */

  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response
          // store中存token
          commit('SET_TOKEN', data.token)
          // 登录成功后将token存储在cookie之中
          setToken(data.token)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // 获取用户信息
  // token 为参数去请求获取你的用户权限，原逻辑是没有权限就跳登陆页面，我这系统需要，没权限也有个首页可看，所以
  // SET_ROLES 参数给了个“普通用户”，反正什么值无所谓有值，没权限就行。
  // 下面 commit 里的参数，分别为，用户名，头像，介绍，保留就好，也可自定义。
  // 在每次页面跳转时候页面都会走一个GetUserInfo ，以此来判断用户有没有失效，
  // 因此，我的做法是直接把用户信息包括权限保存在 redis 里取，不要每次都从库里查
  // 这个就是调用getInfo接口获取用户信息并且保存到vuex中，为了严谨性，进行相对应的数据校验，然后把data返回。
  // 总结：获取用户信息，并保存用户信息。
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }
          // 解构出需要保存的值
          const { roles, name, avatar, introduction } = data

          // roles权限数组至少有一个权限
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // 基于角色生成可访问路由映射
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true,
    })
    // 动态添加可访问的路由
    // addRoutes动态添加更多的路由规则。参数必须是一个符合 routes 选项要求的数组
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
