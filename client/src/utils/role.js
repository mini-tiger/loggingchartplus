// use localStorage to store the authority info, which might be sent from server in actual project.
import {requestData} from './request';
import config from "../../config"
export async function getRole(userInfo) {

  let params = {park: "xxxx"};
  if (userInfo.hasOwnProperty('role') && userInfo['role']) {
    let role = userInfo.role;
    if (role == 'admin') {
      return {}
    }
    if (role == 'office') {
      let param = {};
      param.url = '/' +config.urlSuffix+'/crud/park_parking/read';
      param.method = 'post';
      param.params = {company_id: userInfo.office};
      let value = [];
      let item = await requestData(param);
      if (item.status === 200) {
        if (item.hasOwnProperty('data') && item.data.hasOwnProperty('dataList')) {
          let parks = item.data.dataList.map((obj, index) => {
            return obj.id
          });
          value = parks
        }
      }
      return {park_id: {key: 'in', value: value}}
    }
    if (role == 'park') {
      return {'park_id': userInfo.park}
    }
  }
  return params;
}

