import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext

/* require.context("./test", false, /.test.js$/);
   就会去 test 文件夹（不包含子目录）下面的找所有文件名以 .test.js 结尾的文件能被 require 的文件。
   这个方法有3个参数：
   1.要搜索的文件夹目录
   2.是否还应该搜索它的子目录，
   3.以及一个匹配文件的正则表达式 
   更直白的说就是 我们可以通过正则匹配引入相应的文件模块。
*/
const modulesFiles = require.context('./modules', true, /\.js$/)

/* 
 （创建了）一个包含了./modules文件夹（不包含子目录）下面的、所有文件名以 `.js` 结尾的,能被require请求到的文件的上下文。
*/
// 该文件启用 @/store/index,导入所有vuex模块
// 它将自动要求所有vuex模块从模块文件,以一次性的方式。不应该有任何编辑该文件的理由。
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
  modules,
  getters,
})

export default store
