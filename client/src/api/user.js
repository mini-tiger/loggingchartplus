/**
 * 通过 JavaScript 的形式模拟静态接口
 * 这样做的目的是可以直接打包出来部署在线上而不依赖后端或者 mock 接口
 */
import config from "../../config"
import {requestData} from '../utils/request'

export async function login(params) {
  const {password, username,auth} = params;
  let data = {};

  let args = {}
  args.url = '/' +config.urlSuffix+'/api/login';
  args.method = "POST"
  args.params = {username: username, password: password,auth:auth}

  let response = await requestData(args);

  if (response.status == 200) {
    data = await {
      status: 200,
      statusText: 'ok',
      userInfo:response.userInfo,
      currentAuthority: 'admin',
    };
  } else {
    data = await {
      status: 401,
      statusText:response.statusText,
      currentAuthority: 'guest',
    }
  }

  return {data};
}

export async function postUserRegister() {
  const data = await {
    status: 200,
    statusText: 'ok',
    currentAuthority: 'user',
  };
  return {data};
}

export async function postUserLogout() {
  const data = await {
    status: 200,
    statusText: 'ok',
    currentAuthority: 'guest',
  };
  return {data};
}
