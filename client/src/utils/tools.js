export default function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

export function AsyncSleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


export function IsNumber(val){

  var regPos = /^[0-9]+(.[0-9]{1,8})?$/; //判断是否是数字。

  if(regPos.test(val) ){
    return true;
  }else{
    return false;
  }

}

export function compareZh(prototype){
  return function (a,b) {
    let value1=a[prototype]
    let value2=b[prototype];
    if (value2==undefined || value1 ==undefined){
      return 0
    }else{
      return value1.localeCompare(value2)
    }
  }
}
