export function getAuthority() {
  return localStorage.getItem('ice-pro-authority') || 'admin';
}

export function setAuthority(authority) {
  return localStorage.setItem('ice-pro-authority', authority);
}
export function getUserInfor() {
  return localStorage.getItem('userinfor') ;
}

export function setUserInfor(userinfor) {
  return localStorage.setItem('userinfor', JSON.stringify(userinfor));
}

export function removeUserItem() {
  return localStorage.removeItem('userinfor');
}
