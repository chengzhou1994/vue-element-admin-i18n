/**
 * @function 求和
 * @param {String} arr
 */
export const sum = (arr) => {
  return arr.reduce((pre, cur) => {
    return pre + cur
  })
}

/* 求平均值 */
export const average = (arr) => {
  return this.sum(arr) / arr.length
}
/*  数组排序，{type} 1：从小到大 2：从大到小 3：随机 */
export const sort = (arr, type = 1) => {
  return arr.sort((a, b) => {
    switch (type) {
      case 1:
        return a - b
      case 2:
        return b - a
      case 3:
        return Math.random() - 0.5
      default:
        return arr
    }
  })
}
/* 获取url参数 */
export const getQueryString = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const search = window.location.search.split('?')[1] || ''
  const r = search.match(reg) || []
  return r[2]
}

/**
 * 识别ie--浅识别
 */
export const isIe = () => {
  let explorer = window.navigator.userAgent
  //判断是否为IE浏览器
  if (explorer.indexOf('MSIE') >= 0) {
    return true
  } else {
    return false
  }
}
/**
 * 颜色转换16进制转rgba
 * @param {String} hex
 * @param {Number} opacity
 */
export function hex2Rgba(hex, opacity) {
  if (!hex) hex = '#2c4dae'
  return (
    'rgba(' +
    parseInt('0x' + hex.slice(1, 3)) +
    ',' +
    parseInt('0x' + hex.slice(3, 5)) +
    ',' +
    parseInt('0x' + hex.slice(5, 7)) +
    ',' +
    (opacity || '1') +
    ')'
  )
}
/* 去除html标签 */
export const htmlSafeStr = (str) => {
  return str.replace(/<[^>]+>/g, '')
}

/* 获取url参数 */
/* export const getQueryString = () => {
    let qs = location.href.split('?')[1] || '',
        args = {},
        items = qs.length ? qs.split("&") : [];
        items.forEach((item,i) => {
            let arr = item.split('='),
                name = decodeURIComponent(arr[0]),
                value = decodeURIComponent(arr[1]);
                name.length && (args[name] = value)
        })
    return args;
} */

/* 解析url参数 */
export const paramsToStringify = (params) => {
  if (params) {
    let query = []
    for (let key in params) {
      query.push(`${key}=${params[key]}`)
    }
    return `${query.join('&')}`
  } else {
    return ''
  }
}

/* 将数据转化为数组 */
export const toArray = (data) => {
  return Array.isArray(data) ? data : [data]
}
/**
 * 带参数跳转url（hash模式）
 * @param {String} url
 * @param {Object} params
 */
export const toPage = (url, params) => {
  if (params) {
    let query = []
    for (let key in params) {
      query.push(`${key}=${params[key]}`)
    }
    window.location.href = `./index.html#/${url}?${query.join('&')}`
  } else {
    window.location.href = `./index.html#/${url}`
  }
}
/**
 * 指定字符串 溢出显示省略号
 * @param {String} str
 * @param {Number} num
 */
export const getSubStringSum = (str = '', num = 1) => {
  let newStr
  if (str) {
    str = str + ''
    if (str.trim().length > num) {
      newStr = str.trim().substring(0, num) + '...'
    } else {
      newStr = str.trim()
    }
  } else {
    newStr = ''
  }
  return newStr
}
/**
 * 生成uuid
 * @param {number} len 生成指定长度的uuid
 * @param {number} radix uuid进制数
 */
export function uuid(len, radix) {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  let uuid = [],
    i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}
/**
 * 生成指定格式的时间
 * @param {*} timeStemp 时间戳
 * @param {*} flag 格式符号
 */
export function formatTime(timeStemp, flag) {
  let time = new Date(timeStemp)
  let timeArr = [time.getFullYear(), time.getMonth() + 1, time.getDate()]
  return timeArr.join(flag || '/')
}
/**
 * 避免了进行删除数组某一项时，都要进行查找位置再删除的重复工作。
 * 1.先判断数组长度，如果数组是空的，则没必要进行删除操作
   2.用 indexOf 方法查找到元素在数组中的位置，如果找到返回元素所在的位置下标，如果不存在，则返回-1
   3.index>-1 代表存在数组中，则调用 splice 进行删除，并返回删除的元素组成的数组，也就是 splice 的返回值。
 * @export remove
 * @param {*} arr 目标数组
 * @param {*} item 指定删除项
 * @returns 
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/* 数组去重 */
export const unique = (arr) => {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  return [...new Set(arr)]
}

/* Vue源码中用到的工具函数 */
/* 创建一个被冻结的空对象 */
export const emptyObject = Object.freeze({})

/**
 *  判断是否是 undefined 或 null
 *  在源码中很多地方会判断一个值是否被定义，所以这里直接抽象成一个公共函数。
    传入任意值，返回是一个布尔值。
 * @export isUndef  
 * @param {*} v
 * @returns
 */
export function isUndef(v) {
  return v === undefined || v === null
}

/**
 *
 * 判断是否不是 undefined 和 null
 * @export isDef
 * @param {*} v
 * @returns
 */
export function isDef(v) {
  return v !== undefined && v !== null
}
/**
 *
 * 判断是否是基础类型数据
 * 在js中提供了两大类数据类型：
   1.原始类型（基础类型）：String、Number、Boolean、Null、Undefined、Symbol
   2.对象类型：Object、Array、Function
 * @param {*} value
 * @returns
 */
function isPrimitive(value) {
  return (
    typeof value === 'string' || typeof value === 'number' || typeof value === 'symbol' || typeof value === 'boolean'
  )
}
/**
 *
 * 判断是否是一个 Promise 对象
 * 当一个对象存在then方法，并且也存在catch方法，可以判定为Promise 对象。
 * @export isPromise
 * @param {*} val
 * @returns
 */
export function isPromise(val) {
  return isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function'
}

function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}
/**
 *
 * 递归判断一个对象是否和另个一个对象完全相同
 * 判断两个对象是否相同，主要是判断两个对象包含的值都是一样的，如果包含的值依然是个对象，则继续递归调用判断是否相同。
 * 1.判断两个值是否相同，无论是原始类型还是对象类型，如果相同，则直接返回true。
   2.如果两个都会对象，则分为两种情况，数组和对象。
    *.都是数组，则保证长度一致，同时调用 every 函数递归调用函数，保证每一项都一样
    *是时间对象，则保证时间戳相同
    *是对象，则先取出 key 组成的数组，两者 key 的个数要相同；再递归调用比较 value 值是否相同
    *以上都不满足，直接返回false
  3.如果两者都不是对象，转成字符串后进行比较。
  4.以上都不满足，直接返回false

  let a1 = [1,2,3,{a:1,b:2,c:[1,2,3]}];
  let b1 = [1,2,3,{a:1,b:2,c:[1,2,3]}];
  console.log(looseEqual(a1,b1)); // true
  
  let a2 = [1,2,3,{a:1,b:2,c:[1,2,3,4]}];
  let b2 = [1,2,3,{a:1,b:2,c:[1,2,3]}];
  console.log(looseEqual(a2,b2)); // false
 * @export looseEqual
 * @param {*} a
 * @param {*} b
 * @returns true / false
 */
export function looseEqual(a, b) {
  // 如果是同一个对象，则相同
  if (a === b) return true
  // 判断是否是对象
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  // 两者都是对象
  if (isObjectA && isObjectB) {
    try {
      // 判断是否是数组
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      // 两者都是数组
      if (isArrayA && isArrayB) {
        // 长度要一样，同时每一项都要相同，递归调用
        return (
          a.length === b.length &&
          a.every((e, i) => {
            return looseEqual(e, b[i])
          })
        )
      } else if (a instanceof Date && b instanceof Date) {
        // 如果都是时间对象，则需要保证时间戳相同
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        // 两者都不是数组，则为对象
        // 拿到两者的key值，存入数组
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        // 属性的个数要一样，递归的判断每一个值是否相同
        return (
          keysA.length === keysB.length &&
          keysA.every((key) => {
            return looseEqual(a[key], b[key])
          })
        )
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    // 两者都不是对象
    // 转成字符串后，值是否一致
    return String(a) === String(b)
  } else {
    return false
  }
}
