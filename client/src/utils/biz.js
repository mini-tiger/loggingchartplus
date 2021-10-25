// use localStorage to store the authority info, which might be sent from server in actual project.

export function getbiz() {
  if (localStorage.hasOwnProperty('BizName')){
    return localStorage.getItem('BizName') ;
  }else{
    return 'ALL'
  }

}

export function setBiz(biz) {
  localStorage.removeItem('BizName')
  return localStorage.setItem('BizName', biz);
}
