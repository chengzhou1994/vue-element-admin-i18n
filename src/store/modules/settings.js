import variables from '@/styles/element-variables.scss'
// 默认的系统布局设置 tag标签，主题颜色，侧边栏logo,固定header,
import defaultSettings from '@/settings'

const { showSettings, tagsView, fixedHeader, sidebarLogo, supportPinyinSearch } = defaultSettings

const state = {
  // 主题色
  theme: variables.theme,
  // 侧边栏设置
  showSettings,
  // 展示tagsView
  tagsView,
  // 固定header
  fixedHeader,
  // 侧边栏logo
  sidebarLogo,
  // 支持拼音搜索
  supportPinyinSearch,
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // 此方法可用于确定对象是否具有指定属性 返回true false
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  },
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
