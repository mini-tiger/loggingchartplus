class Cookie {
  constructor(name) {
    this.name = name;
  }
  // todo 单条不能超过4096字节， 一共不能超过50条
  async setCookie(value, expiredays, max) { // 数据，过期天数，是否永不过期
    let cookieValue;

    if (typeof (value) === 'object') {
      cookieValue = JSON.stringify(value);
    } else {
      cookieValue = value;
    }
    const data = new Date();

    if (max) {
      data.setFullYear(9999)
    } else {
      data.setDate(data.getDate() + expiredays);
    }
    // console.log(cookieValue)
    // console.log(data)
    // let a=`${this.name}=${escape(cookieValue)
    //   }${(expiredays == null) ? '' : `;expires=${data.toGMTString()}`};path=/`;
    // console.log(a)
    // document.cookie = a;
    document.cookie = encodeURIComponent(this.name) + "=" + encodeURIComponent(cookieValue) + "; expires=" + data.toUTCString()
  }

  getCookie() {
    if (document.cookie.length > 0) {
      let startIndex = document.cookie.indexOf(`${this.name}=`);
      if (startIndex !== -1) {
        startIndex = startIndex + this.name.length + 1;
        let endIndex = document.cookie.indexOf(';', startIndex);
        if (endIndex === -1) {
          endIndex = document.cookie.length;
        }
        return unescape(document.cookie.substring(startIndex, endIndex));
      }
    }
    return null;
  }

  delCookie() { // 删除cookies key 设置为0秒后过期
    // console.log('delete');
    // const exp = new Date();
    // exp.setTime(exp.getTime() - 1);
    // document.cookie = `${this.name}=0;expires=-1`;
    this.setCookie(0, -10)
  }
}


// export function getItem(sKey) {
//   return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
// }
//
// export function setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure) {
//   if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
//     return false;
//   }
//   var sExpires = "";
//   if (vEnd) {
//     switch (vEnd.constructor) {
//       case Number:
//         sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
//         break;
//       case String:
//         sExpires = "; expires=" + vEnd;
//         break;
//       case Date:
//         sExpires = "; expires=" + vEnd.toUTCString();
//         break;
//     }
//   }
//   document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
//   return true;
// }
//
// export function removeItem(sKey, sPath, sDomain) {
//   if (!sKey || !this.hasItem(sKey)) {
//     return false;
//   }
//   document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
//   return true;
// }

export function hasItem(sKey) {
  return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
}

export function keys() {
  var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
  for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
    aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
  }
  return aKeys;
}


export default (
  Cookie
)

