const inspect = require('util').inspect
const path = require('path')
const fs = require('fs')
const Busboy = require('busboy')
const iconv = require('iconv-lite');
const CrulModel = require('../crud/model');

/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
}

/**
 * 获取上传文件的后缀名
 * @param  {string} fileName 获取上传文件的后缀名
 * @return {string}          文件后缀名
 */
function getSuffixName(fileName) {
  let nameList = fileName.split('.')
  return nameList
}

function uploadJar(ctx, options) {
  let req = ctx.req
  let res = ctx.res
  let busboy = new Busboy({headers: req.headers})

  // 获取类型
  // let fileType = options.fileType || 'common'
  let filePath = options.path
  let callback = options.callback
  let mkdirResult = mkdirsSync(filePath)

  return new Promise((resolve, reject) => {
    console.log('文件上传中...')
    let result = {
      success: false,
      formData: {},
    }

    // 解析请求文件事件
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      // console.log(fieldname) //上传类型 默认file
      // console.log(file) // 上传文件名
      console.log(filename) // 上传文件名
      let filenameArr = getSuffixName(filename)
      // let fileName = Math.random().toString(16).substr(2) + '.' + filenameArr[filenameArr.length - 1]
      let fileName=filename
      let _uploadFilePath = path.join(filePath, fileName)
      let saveTo = path.join(process.cwd(), _uploadFilePath)

      console.log(saveTo)
      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(saveTo))

      // 文件写入事件结束
      file.on('end', function () {
        console.log('文件上传成功！')
        result.success = true
        result.message = '文件上传成功'
        result.saveFile = saveTo
        result.uploadfilenameArr = filenameArr
        result.filename = fileName
        resolve(result)
        // callback(saveTo)
      })
    })

    // 解析结束事件
    busboy.on('finish', function () {
      console.log('文件上传结束')
      // resolve(result)
    })

    // 解析错误事件
    busboy.on('error', function (err) {
      console.log('文件上传出错')
      result.success = true
      result.message = '文件上传出错'
      // reject(result)
      resolve(result)
    })

    req.pipe(busboy)
  })

}

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}
 */
function uploadFile(ctx, options) {
  let req = ctx.req
  let res = ctx.res
  let busboy = new Busboy({headers: req.headers})

  // 获取类型
  // let fileType = options.fileType || 'common'
  let filePath = options.path
  let callback = options.callback
  let mkdirResult = mkdirsSync(filePath)

  return new Promise((resolve, reject) => {
    console.log('文件上传中...')
    let result = {
      success: false,
      formData: {},
    }

    // 解析请求文件事件
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
      // console.log(fieldname) 上传类型 默认file
      // console.log(file) // 上传数据 流
      // console.log(filename) // 上传文件名
      let filenameArr = getSuffixName(filename)
      let fileName = Math.random().toString(16).substr(2) + '.' + filenameArr[filenameArr.length - 1]
      let _uploadFilePath = path.join(filePath, fileName)
      let saveTo = path.join(process.cwd(), _uploadFilePath)

      console.log(saveTo)
      // 文件保存到制定路径
      file.pipe(fs.createWriteStream(saveTo))

      // 文件写入事件结束
      file.on('end', function () {
        console.log('文件上传成功！')
        result.success = true
        result.message = '文件上传成功'
        result.saveFile = saveTo
        result.uploadfilenameArr = filenameArr
        result.filename = fileName
        resolve(result)
        // callback(saveTo)
      })
    })

    // 解析表单中其他字段信息
    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      console.log('表单字段数据 [' + fieldname + ']: value: ' + inspect(val));
      result.formData[fieldname] = inspect(val);
    });

    // 解析结束事件
    busboy.on('finish', function () {
      console.log('文件上传结束')
      // resolve(result)
    })

    // 解析错误事件
    busboy.on('error', function (err) {
      console.log('文件上传出错')
      result.success = true
      result.message = '文件上传出错'
      // reject(result)
      resolve(result)
    })

    req.pipe(busboy)
  })

}

async function dataCheckAndSave(result, crudReadList) {
  // fs.readFile(result.saveFile, {encoding: 'binary'}, function (err, data) {
  //   return new Promise((resolve, reject) => {
  //     if (err) {
  //       resolve(err)
  //     } else {
  //       resolve(begin(result,data,crudReadList))
  //     }
  //   })
  // });
  let data = fs.readFileSync(result.saveFile, {encoding: 'binary'});
  // console.log(result)
  let srcfullcols = await CrulModel.getfullCols(result.uploadfilenameArr[0]); // 提取实际表中的列

  let srctablecol = srcfullcols.map(function (v, i) { // 格式化表中的列为数组
    return v.Field
  });
  // console.log(srctablecol)
  return await beginImport(result, srctablecol, data, crudReadList)
}

async function beginImport(result, srctablecol, data, crudReadList) {
  // console.log(err,data)
  try {
    var buf = Buffer.from(data, 'binary');
    var str = iconv.decode(buf, 'GBK');
    // console.log(str)
    // console.log(crudReadList)
    let tmpobj = {}
    crudReadList.dataList.map(function (v, i) { // 转换格式 方便匹配使用
      tmpobj[v.field_id] = {
        default_value: v.default_value,
        field_type: v.field_type,
        unique_index: v.unique_index
      }
    });
    // console.log(tmpobj)
    // let dbDataFusion = []
    let uploadData = str.toString().split(/\r\n/); // 去除上传文件中 第二行 第三行，是列的中文与类型，剩下列名与数据
    uploadData.splice(1, 2)

    let totalsuccess = 0
    let totalerr = {}
    // console.log(uploadData)
    fieldsList = uploadData[0].split(',') // csv 第一列为列名不用循环
    // console.log(fieldsList.length)
    // console.log(srctablecol.length)
    // console.log(srctablecol)
    // console.log(fieldsList)
    if (srctablecol.length != fieldsList.length){
      let Result = {}
      Result.message = "csv 中列数量与实际表中不一致"
      Result.status = false
      return Result
    }
    let srcColSet=new Set(srctablecol)
    let fieldColSet =new Set(fieldsList)

    let differenceSet = new Set([...srcColSet].filter(x => !fieldColSet.has(x))); // 两个集合差集
    if (differenceSet.size > 0){
      let Result = {}
      Result.message = "csv 中列名与实际表有差异"
      Result.status = false
      return Result
    }
    console.log(differenceSet)

    for (let row = 1; row < uploadData.length; row++) { // 这里循环的是 行
      let tmpdata = uploadData[row].split(','); // 每一行数据的数组
      // console.log(tmpdata);
      let args = {};
      args.fields = []; // 插入数据的列
      args.value = [];// 插入数据 的数据
      args.table = result.uploadfilenameArr[0]
      // console.log(args)
      if (tmpdata.length != fieldsList.length) { // 数据长度与列头长度不一样，跳过
        totalerr["No." + (row + 3) + "行"] = "数据长度与列头长度不一样(包括空行)";
        continue
      } else {
        for (let col = 0; col < tmpdata.length; col++) {  // 循环匹配列 这里循环的是行中的列

          let _tmpdefaultvalue = tmpobj[fieldsList[col]].default_value;
          let _tmptype = tmpobj[fieldsList[col]].field_type;

          if (tmpdata[col] == null || tmpdata[col] == "" || tmpdata == " ") {
            if (tmpobj.hasOwnProperty(fieldsList[col])) {
              if (_tmpdefaultvalue != null && _tmpdefaultvalue != "auto") {
                tmpdata[col] = _tmpdefaultvalue
                args.fields.push(fieldsList[col])
                args.value.push(tmpdata[col])
              }
            }
          } else {
            args.fields.push(fieldsList[col])
            args.value.push(tmpdata[col])
          }
        }
        const data = await CrulModel.insertData(args);
        // console.log(Object.keys(data))
        // console.log(data.sqlMessage)
        // console.log(row+3,data.sqlMessage!=undefined)
        // console.log(row+3,isNaN(data.sqlMessage))
        // console.log(data)
        if (data.sqlMessage != undefined) {
          totalerr["No." + (row + 3) + "行"] = data.sqlMessage
        } else {
          if (data.affectedRows > 0) {
            totalsuccess += 1
          } else {
            totalerr["No." + (row + 3) + "行"] = "没有影响行数+1"
          }
        }


      }
    }
    let insertResult = {}
    insertResult.errObj = totalerr
    insertResult.successNum = totalsuccess
    insertResult.status = true
    return insertResult
  } catch (e) {

    let insertResult = {}
    insertResult.message = e.toString()
    insertResult.status = false
    return insertResult
  }
}

module.exports = {
  uploadFile,
  dataCheckAndSave,
  uploadJar
}
