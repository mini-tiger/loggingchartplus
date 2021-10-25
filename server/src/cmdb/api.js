const request = require('request');


class Api {
  async Post(url, body) {
    return new Promise((resolve, reject) => {
      request({
        method: "POST",
        url: url,
        header:
          {
            'content-type': 'application/json',
          },
        body: body
      }, function (err, res, body) {
        resolve(body)
      })
    })
  }
  async GET(url,body){
    return new Promise((resolve, reject) => {
      request({
        method: "GET",
        url: url,
        header:
          {
            'content-type': 'application/json',
          },
        body: body
      }, function (err, res, body) {
        resolve(body)
      })
    })
  }
  // 封装一个post请求方法
  async newpost(url, data){
    // 这里需要判断 data 数据类型，因为自定义菜单和图片上传的数据格式有异，会导致报错
    return new Promise((resolve, reject) => {
        var form = {
            url: url
        }
        if (typeof data == 'string') {
            form.body = data // 如果数据格式为字符，则菜单数据通过 body 提交给接口
        } else {
            form.formData = data // 否则数据通过 formData 提交给接口（这里指的是上传图片接口）
        }
        request.post(form, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                //console.log('post request success')
                resolve(body)
            } else {
                // console.log('post request fail', error)
            }
        })
    })
  }

}

module.exports = new Api();
