export function Format (value, format) {
  var that = new Date(value)
  var date = {
    'M+': that.getMonth() + 1,
    'd+': that.getDate(),
    'h+': that.getHours(),
    'm+': that.getMinutes(),
    's+': that.getSeconds(),
    'q+': Math.floor((that.getMonth() + 3) / 3),
    'S+': that.getMilliseconds()
  }
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (that.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
    }
  }
  return format
}

export function isURL (strUrl) {
  var strRegex = /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+.[A-Za-z0-9]+[/=?%\-&_~`@[\]':+!]*([^<>""])*$/
  var re = new RegExp(strRegex)
  return re.test(strUrl)
}
export function imgUrlFun (str) {
  var data = ''
  str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function (match, capture) {
    data = capture
  })
  return data
}
export function getSimpleText (html) {
  html = html.replace(/&nbsp;/g, '')
  var re1 = new RegExp('<.+?>', 'g')
  var msg = html.replace(re1, '')
  return msg
}
export function sliceKey (word) {
  let index = word.lastIndexOf('/')
  let end = word.length
  let k = word.substring(index + 1, end)
  return k
}
export function formatText (v, TEXT_LIMIT = 100) {
  var eng = 0
  var china = 0
  var length = 0
  if (v.length <= 68) {
    return v
  }
  for (var i = 0; i < v.length; i++) {
    if ((eng / 2) + china >= TEXT_LIMIT && length === 0) {
      length = eng + china
    }
    if (v.charCodeAt(i) > 127 || v.charCodeAt(i) === 94) {
      china++
    } else {
      eng++
    }
  }
  if ((china + eng / 2) > TEXT_LIMIT + 10) {
    v = v.slice(0, length) + '...'
  }
  return v
}
export function getCookie (cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) !== -1) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}
