import axios from 'axios'

import { Message } from '@alifd/next';
const qs = require('qs')

export async function requestData(args) {
  let res = await axios({
    url: args.url,
    method: args.method,
    data: qs.stringify(args.params),
  });
  try {
    return new Promise((resolve, reject) => {
      // console.log(res)
      if (res.status == 200) {
        resolve(res.data)
      } else {
        reject(res.statusText)
      }
    })
  } catch (err) {
    Message.toast.error(args.url + "err: " + err)
    console.log(err)
  }
}
