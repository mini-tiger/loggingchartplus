const path = require('path')
const fs = require('fs')
const Json2csvParser = require('json2csv').Parser;
const {mkdirsSync, mkdirs} = require('./mkdir');
const iconv = require('iconv-lite');
const json2csv = require('json2csv');
const util = require('util');

class JsonTocsv {
  // 数组 每个元素是对象 ,skip跳过 的列,生成文件路径
  async ListObjConvert(json,skip,filename,code,actfield="") {
    if (json.length ==0){
      return {result:false}
    }

    // 创建目录文件
    let basicDir= path.dirname(filename);
    let basicFilename = path.basename(filename);
    mkdirsSync(basicDir);

    let data = await fs.statSync(basicDir);
    if (!data.isDirectory()) {
      fs.mkdirSync(basicDir)
    }

// 提取列 并删除需要跳过的列
    let fields=[];
    Object.keys(json[0]).map(function (v,i) {
      if (!skip.includes(v) && v !="DEPTH"){
        fields.push(v)
      }
    });
    if (Object.keys(json[0]).includes("DEPTH")){
      fields.unshift("DEPTH")
    }
    if (actfield!=""){
      fields.push(actfield)
    }
    console.log(fields)
    // console.log(fields)

    //
    // let file_data = [field_name, field_type];
    // // console.log(file_data)
    //
    const json2csvParser = new Json2csvParser({fields, delimiter: ','});
    const csv = json2csvParser.parse(json);

    // let csv = json2csv({data:json,fields:fields});
    var newcsv = iconv.encode(csv, code);
    // console.log(filePath)
    fs.writeFile(filename, newcsv, function (err) {
      if (err){
        console.log(err)
        return {result:false}
      }
    });
    json=[];
    return {result:true}
  }

  getCurrDatTime() {
    //判断是否有正在处理的任务
    //let count1= await mongodbHelper.find("task",{status:"2"});
    let currTime = new Date();
    let d = currTime.toLocaleDateString();
    let t = currTime.toLocaleTimeString('en-US', {hour12: false});
    // console.log(d, t);
    let currDateTime = util.format("%s %s", d, t)
    // let count1 = 1;
    // if (count1 > 0) {
    //   console.log(util.format('%s,正在处理任务，退出定时任务', currDateTime));
    //   return;
    // }
    return currDateTime
  }
}

module.exports = new JsonTocsv();
