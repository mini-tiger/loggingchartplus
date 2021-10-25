const retCode = require('./retcode');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
let OSS = require('ali-oss');
const fs =require('fs');

let client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAIFUK1Mbl4QWYg',
  accessKeySecret: 'Naxt6s55oL0PyWnGIhmgT16NSjoD70',
  bucket: 'api-project'
});


async function put(fileName, filePath) {
  let data = {};
  try {
    let result = await client.put(fileName, filePath);
    data.error = null;
    data.data = result.url;
    return data
  } catch (e) {
    data.error = e;
    return data
  }
}


function uploadToAli(ctx) {
  const req = ctx.req;
  const res = ctx.res;
  let busboy = new Busboy({headers: req.headers});
  return new Promise((resolve, reject) => {
    let result = {
      status: retCode.Success,
      statusText: '操作成功',
      data: {}
    };
    busboy.on('file', async function (fieldName, file, filename, encoding, mimetype) {
      let filePath = path.join(os.tmpdir(), path.basename(filename));
      // 写临时文件
      await file.pipe(fs.createWriteStream(filePath));
      let data = await put(filename, filePath);
      if (data.error == null) {
        result.data = data.data;
        // 删除临时文件
        fs.unlink(filePath,(item)=>{
          console.log(item)
        });
        resolve(result);
      } else {
        result.status = retCode.Fail;
        result.statusText = data.error;
        fs.unlink(filePath,(item)=>{
          console.log(item)
        });
        reject(result)
      }
    });
    req.pipe(busboy);
  })
}


module.exports = {
  uploadToAli,
};
