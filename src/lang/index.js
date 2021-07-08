import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN' // element-ui lang
import elementEsLocale from 'element-ui/lib/locale/lang/es' // element-ui lang
import elementJaLocale from 'element-ui/lib/locale/lang/ja' // element-ui lang
import enLocale from './en' // 英文
import zhLocale from './zh' // 中文
import esLocale from './es' // 西班牙
import jaLocale from './ja' // 日文

Vue.use(VueI18n)

// 准备本地的翻译信息
const messages = {
  // 英文
  en: {
    ...enLocale,
    ...elementEnLocale,
  },
  // 中文
  zh: {
    ...zhLocale,
    ...elementZhLocale,
  },
  // 西班牙
  es: {
    ...esLocale,
    ...elementEsLocale,
  },
  // 日文
  ja: {
    ...jaLocale,
    ...elementJaLocale,
  },
}
// 获取语言
export function getLanguage() {
  // 从cookies读取语言
  const chooseLanguage = Cookies.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  // navigator.language返回一个字符串,该字符串代表用户的首先语言，
  // 通常是浏览器使用的语言,navigator.language为只读属性。
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  /* 
    Object.keys 返回一个所有元素为字符串的数组，
    其元素来自于从给定的object上面可直接枚举的属性。
    这些属性的顺序与手动遍历该对象属性时的一致。 
    var obj = { 0: 'a', 1: 'b', 2: 'c' };
    console.log(Object.keys(obj)); // console: ['0', '1', '2']
   */

  const locales = Object.keys(messages) //
  for (const locale of locales) {
    // 如果存在en,zh,es,ja之中匹配一个，就返回那种语言
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages,
})

export default i18n
