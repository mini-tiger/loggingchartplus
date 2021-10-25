const MockController = require('./mock');
const ApiController = require('../cmdb/api');
const retCode = require('../utils/retcode')
const mongodbHelper = require('../db/mongodb-helper');
const JsonTocsv = require('../utils/jsonTocsv');
let mongoose = require('mongoose');
const fs = require('fs');
const process = require('process');
const path = require('path');
const util = require('util');
const config = require('../config/config')
const archiver = require('archiver');
const urlencode = require('urlencode')
const send = require('koa-send');
const Buss = require('../utils/business');
const Business = Buss.Business;
var callfile = require('child_process')
const {uploadJar, dataCheckAndSave} = require('../utils/upload');

class FuncController {
  //获取某油田下井号
  async getJH(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    let list = await mongodbHelper.distinct("petrol_raw", "JH", {});
    ctx.body = {
      status: 200,
      statusText: 'search data from getJH mongodb ok',
      data: list,
    }
  }

  async getwellqxlist(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;

    let listdata = [];
    let jhlist = await mongodbHelper.distinct("petrol_raw", "JH", {});
    for (var i of jhlist) {
      // let tmpobj={}
      let obj = {label: i, value: i};
      let qxlist = await mongodbHelper.distinct("petrol_raw", "QXWJM", {JH: i});
      // console.log(Business.formatObj(list))
      let objqxlist=[];
      for (var qi of qxlist){
        let objqx={label:qi,value:qi}
        let list = await mongodbHelper.distinct("petrol_raw", "ZBMC", {QXWJM:qi});
        objqx["children"] = Business.formatObj(list)
        objqxlist.push(objqx)
      }
      obj["children"]=objqxlist
      listdata.push(obj)
    }


    ctx.body = {
      status: 200,
      statusText: 'search data from getwellflist mongodb ok',
      data: listdata,
    }
  }

  //获取某油田下井号的曲线列表

  async getwellflist(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    let list = await mongodbHelper.distinct("petrol_raw", "QXWJM", params);
    ctx.body = {
      status: 200,
      statusText: 'search data from getwellflist mongodb ok',
      data: list,
    }
  }

  //获取某曲线下指标列表
  async getidxlist(ctx) {
    console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    let list = await mongodbHelper.distinct("petrol_raw", "ZBMC", params);
    ctx.body = {
      status: 200,
      statusText: 'search data from getidxlist mongodb ok',
      data: list,
    }
  }

  //删除
  async delData(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    if (!params.hasOwnProperty("tableid")) {
      ctx.body = {
        status: 400,
        statusText: 'not found tableid',
      };
      return
    }

    let tableid = params["tableid"];
    delete params.tableid;

    if (Object.keys(params).length == 0) {
      ctx.body = {
        status: 400,
        statusText: 'not found field',
      };
      return
    }

    if (params.hasOwnProperty("_id")) {
      params['_id'] = mongoose.Types.ObjectId(params["_id"])
    }
    let result = await mongodbHelper.remove(tableid, params);
    ctx.body = {
      status: 200,
      statusText: 'del mongodb ok',
      data: result,
    }
  }

  //删除collect
  async delCollect(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    if (!params.hasOwnProperty("tableid")) {
      ctx.body = {
        status: 400,
        statusText: 'not found tableid',
      };
      return
    }

    let tableid = params["tableid"];


    let result = await mongodbHelper.delCollect(tableid);
    ctx.body = {
      status: 200,
      statusText: 'del mongodb ok',
      data: result,
    }
  }

  //保存任务信息
  async saveTask(ctx) {
    // console.log('saveTask ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    if (params._id != undefined) {
      //更新操作
      let id = params._id
      params['_id'] = mongoose.Types.ObjectId(id)
    } else {
      //新增操作
      params['status'] = '0';//编辑状态
    }
    let result = await mongodbHelper.save("task", params);
    ctx.body = {
      status: 200,
      statusText: 'search data from saveTask mongodb ok',
      data: result,
    }
  }

  //保存任务信息
  async saveTable(ctx) {
    // console.log('saveTable( ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    // if (params._id != undefined) {
    //   //更新操作
    //   let id = params._id
    //   params['_id'] = mongoose.Types.ObjectId(id)
    // } else {
    //   //新增操作
    //   params['status'] = '0';//编辑状态
    // }
    let tasktable = "taskResult_" + params["taskID"];

    console.log(params)
    // console.log(params["data"]);
    for (let i of params["data"]){
      // console.log(i)
      let key=Object.keys(i)[0];
      // console.log(key)
      let find = {
        "JH": params["JH"],
        "QXWJM": params["QXWJM"],
        "taskID": params["taskID"],
        "dataAll._id": mongoose.Types.ObjectId(key)
      };
      let setjson = {"dataAll.$.modify": i[key]};

      let result = await mongodbHelper.updateMany(tasktable, find, setjson);
      console.log(find);
      console.log(setjson)
    }




    ctx.body = {
      status: 200,
      statusText: 'search data from saveTask mongodb ok',
    }
  }

  //查询任务信息
  async findTask(ctx) {
    // console.log('findTask ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    if (params._id != undefined) {
      let id = params._id
      params['_id'] = mongoose.Types.ObjectId(id)
    }
    // params={"$or":[{taskuser:"admin"},{share:"1"}]};

    let result = await mongodbHelper.find("task", params);
    ctx.body = {
      status: 200,
      statusText: 'search data from findTask mongodb ok',
      data: result,
    }
  }

  //逗号分隔字符串转换find select fields
  str2fileds(str) {
    let list = str.split(",")
    let ret = []
    list.map((value) => {
      let data = {}
      data[value] = 1
      ret.push(data)
    })
    return ret
  }

  //查询曲线数据
  async findQxByTask(ctx) {
    // console.log('findQxByTask ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    //查询曲线配置
    let filterConfig = {}
    if (params.modeID != undefined) {
      filterConfig['_id'] = mongoose.Types.ObjectId(params.modeID)
    }
    let configList = await mongodbHelper.find("model_config", filterConfig);

    //查询曲线数据
    let filterData = {
      JH: params.JH,
      QXWJM: params.QXWJM
    }
    let tableName = "taskResult_" + params.taskID;
    let dataList = await mongodbHelper.find(tableName, filterData);

    let output ="predict";
    if (configList.length >0){
      output=configList[0]["outparamslist"]
    }


    let dataAllModify = [];

    dataList[0].dataAll.map(function (v, i) {
      let tmp = {};
      tmp = Object.assign(tmp, v)
      if (tmp.hasOwnProperty(output) && !tmp.hasOwnProperty("modify")) {
        tmp["modify"] = (v[output]).toFixed(2)
      };
      dataAllModify.push(tmp)
    });

    // console.log(dataAllModify[0])
    // console.log(dataAllModify1[0])
    // console.log(dataList[0].sectionData)

    ctx.body = {
      status: 200,
      statusText: 'search data from findQxByTask mongodb ok',
      data: {
        configList: configList[0],
        dataList: dataAllModify,
        sectionData: dataList[0].sectionData,
      },
    }

  }

  async findByTaskDepth(ctx) {
    // console.log('findQxByTaskDepth ctx.request.body', ctx.request.body)
    let params = ctx.request.body;

    //查询曲线数据
    let filterData = [
      {"$match": {JH: params.JH, QXWJM: params.QXWJM}},
      {$group: {_id: 'max', min_value: {$min: "$DEPTH"}, max_value: {$max: "$DEPTH"}}}
    ];
    // console.log(filterData)

    // let params = [
    //   {"$match": {}},
    //   {$project: project},
    //   {$group: {_id: "$" + field}},
    //   {$group: {_id: null, count: {$sum: 1}}}
    // ];
    let tableName = "petrol_res";


    let dataList = await mongodbHelper.aggregate(tableName, filterData);


    let data = {min: 0, max: 0};
    if (dataList.length > 0) {
      data.min = dataList[0].min_value;
      data.max = dataList[0].max_value
    }

    ctx.body = {
      status: 200,
      statusText: 'search data from findQxByTask mongodb ok',
      data: data,
    }

  }


  async findByTaskDepthList(ctx) {
    // console.log('findQxByTaskDepthList ctx.request.body', ctx.request.body)
    let params = ctx.request.body;

    let r = {};
    for (let i = 0; i < params["QXWJMList"].length; i++) {
      //查询曲线数据
      let filterData = [
        {"$match": {JH: params.JH, QXWJM: params["QXWJMList"][i]}},
        {$group: {_id: 'max', min_value: {$min: "$DEPTH"}, max_value: {$max: "$DEPTH"}}}
      ];

      let tableName = "petrol_res";
      let dataList = await mongodbHelper.aggregate(tableName, filterData);
      let data = {min: 0, max: 0};
      if (dataList.length > 0) {
        data.min = dataList[0].min_value;
        data.max = dataList[0].max_value
      }
      ;
      r[params["QXWJMList"][i]] = data

    }


    ctx.body = {
      status: 200,
      statusText: 'search data from findQxByTask mongodb ok',
      data: r,
    }

  }

  //处理任务
  async execTask() {
    //判断是否有正在处理的任务
    let count1 = await mongodbHelper.find("task", {status: "2"});
    if (count1 > 0) {
      // console.log('正在处理任务，退出定时任务', count1);
      return;
    }

    //判断是否有有待处理的任务
    let count2 = await mongodbHelper.find("task", {status: "1"});
    if (count2 == 0) {
      // console.log('无待处理的任务，退出定时任务');
      return;
    }

    //检查task是否存在待处理任务status=1,更新为处理中status=2
    let ret = await mongodbHelper.update("task", {status: "1"}, {status: "2"});

    //查询task：status=2 处理中
    let result = await mongodbHelper.find("task", {status: "2"});
    for (var i = 0; i < result.length; i++) {
      let task = result[i]
      // console.log('schedule execTask:[' + task.tasktitle + '] at ' + new Date());
      //判断checkedlist 是否为空
      if (task.checkedlist.length > 0) {
        //查询字段列表
        let inparamslist = task.model_config.inparamslist
        let outparamslist = task.model_config.outparamslist
        //筛选字段
        let selectparams = "DEPTH," + inparamslist + "," + outparamslist
        let tmplist = inparamslist.split(",")
        let paramlist = tmplist
        let selectlist = {DEPTH: 1}
        tmplist.map((value) => {
          selectlist[value] = 1
        })

        for (var j = 0; j < task.checkedlist.length; j++) {
          let checkeditem = task.checkedlist[j];
          console.log("start exec:", checkeditem, new Date());
          //更新指标数据

          let taskResult = {
            taskID: task._id,
            JH: task.wellname,
            QXWJM: checkeditem,
            timeStart: new Date()
          }

          //定义指标数据集
          let dataAll = []
          //查询曲线数据
          let filter = {
            JH: task.wellname,
            QXWJM: checkeditem
          }
          let res = await mongodbHelper.findfield("petrol_res", filter, selectlist);
          for (var k = 0; k < res.length; k++) {
            if (k % 1000 == 0) {
              console.log("exec progrcess:", checkeditem, res.length, k, new Date());
            }
            let item = res[k]
            //参数转换字符串
            let paramTmp = {}
            paramTmp["_id"] = item["_id"]
            paramlist.map((paramName) => {
              paramTmp[paramName] = "" + item[paramName]
            })
            //调用计算API
            let postParams = {
              data: [
                paramTmp
              ],
              service: task.model_config.model_desc
            }

            let strResult = await ApiController.newpost(task.model_config.modelurl, JSON.stringify(postParams));

            //更新计算结果
            let postResult = JSON.parse(strResult)
            if (postResult.success) {
              let datastr = postResult.data
              let data = JSON.parse(datastr)
              //不再更新结果数据
              //await mongodbHelper.update("petrol_res",{_id:item._id},data);
              item = Object.assign(item, data);
            } else {
              console.log("post model api fail:", k, strResult)
            }
            dataAll.push(item)
          }
          //分段计算测井数据
          let sectionData = [];
          let beginDepth = dataAll[0].DEPTH;
          let endDepth = beginDepth;
          //四舍五入后取整
          var num = new Number(dataAll[0].predict);
          let predictDepth = num.toFixed(0);

          let countDepth = dataAll.length;
          ;
          for (var m = 1; m < countDepth; m++) {
            let dataDepth = dataAll[m];
            //四舍五入后取整
            let numTemp = new Number(dataDepth.predict);
            let predictCurrent = numTemp.toFixed(0);
            if (predictCurrent == predictDepth) {
              endDepth = dataDepth.DEPTH;
              //判断是否最后一个
              if (m == (countDepth - 1)) {
                let sectionItem = {
                  JH: task.wellname,
                  QXWJM: checkeditem,
                  sectionDepth: beginDepth + "-" + endDepth,
                  predict: predictDepth,
                  plyDepth: (endDepth - beginDepth)
                }
                sectionData.push(sectionItem);
              }
            } else {
              let sectionItem = {
                JH: task.wellname,
                QXWJM: checkeditem,
                sectionDepth: beginDepth + "-" + endDepth,
                predict: predictDepth,
                plyDepth: (endDepth - beginDepth)
              }
              sectionData.push(sectionItem);
              //设置下一区间
              beginDepth = dataAll[m].DEPTH;
              endDepth = beginDepth;
              predictDepth = predictCurrent;
            }
          }
          taskResult["sectionData"] = sectionData;
          taskResult["dataAll"] = dataAll;
          taskResult["timeEnd"] = new Date();
          let tableName = "taskResult_" + task._id;
          let save_result = await mongodbHelper.save(tableName, taskResult);
          // console.log("over exec:", checkeditem, JSON.parse(save_result), new Date());

        }
      }
    }

    //更新task：status=3 处理完毕
    await mongodbHelper.update("task", {status: "2"}, {status: "3"});
  }

  //保存曲线模版信息
  async saveTemplate(ctx) {
    console.log('ctx.request.body saveTemplate', ctx.request.body)
    let params = ctx.request.body;
    if (params._id != undefined) {
      //更新操作
      let id = params._id
      params['_id'] = mongoose.Types.ObjectId(id)
    }
    let result = await mongodbHelper.save("model_config", params);
    ctx.body = {
      status: 200,
      statusText: 'search data from saveTemplate mongodb ok',
      data: result,
    }
  }

  async saveTemplateCallback(ctx) {
    // console.log('ctx.request.body callback', ctx.request.body)
    let params = ctx.request.body;
    if (params._id != undefined) {
      //更新操作
      let id = params._id
      params['_id'] = mongoose.Types.ObjectId(id)
    }

    //xxx 不是第一次新建
    let c = await mongodbHelper.find("model_config",{"_id":params['_id']})
    // console.log(11111111111)
    if (c.length > 0 ){
      if (c[0].hasOwnProperty("value") && c[0].hasOwnProperty("tempName")){
        delete params._id
        let result = await mongodbHelper.save("model_config", params);
        params = result.ops[0];
        params["value"] = params["_id"]
        // console.log(params)
        await mongodbHelper.save("model_config", params);
        ctx.body = {
          status: 200,
          statusText: 'search data from saveTemplate mongodb ok',
          data: result,
        }
      }
    }
// console.log(222)
    // xxx 第一次保存
    let result = await mongodbHelper.save("model_config", params);

    ctx.body = {
      status: 200,
      statusText: 'search data from saveTemplate mongodb ok',
      data: result,
    }
  }
  //查询曲线模版信息
  async findTemplate(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    if (params._id != undefined) {
      let id = params._id
      params['_id'] = mongoose.Types.ObjectId(id)
    }
    let result = await mongodbHelper.find("model_config", params);
    ctx.body = {
      status: 200,
      statusText: 'search data from findTemplate mongodb ok',
      data: result,
    }
  }
  async uploadJar(ctx) {
    console.log('ctx.request.body uploadJar', ctx.request.body)
    let result = {success: false};
    let serverFilePath = "../java/schedule/model";

    result = await uploadJar(ctx, {
      fileType: 'album',
      path: serverFilePath,
    });

    ctx.body = {
      status: 200,
      data:{result:result}
    }
  }
  async delTemplate(ctx) {
    console.log('ctx.request.body delTemplate', ctx.request.body)
    let params = ctx.request.body;
    if (params._id != undefined) {
      let id = params._id
      params['_id'] = mongoose.Types.ObjectId(id)
    }

    let result={}
    let c= await mongodbHelper.count("model_config",{"model_name":params["model_name"]})
    //xxx 只有一条数据
    if (c<=1){
      delete params.tempName
      delete params.value
      delete params.tempLIst
      result=await mongodbHelper.save("model_config", params);
    }else{
      result = await mongodbHelper.remove("model_config", {"_id":params['_id']});

    }

    ctx.body = {
      status: 200,
      statusText: 'del Template mongodb ok',
      data: result,
    }
  }

  async countTemplate(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    if (params._id != undefined) {
      let id = params._id
      params['_id'] = mongoose.Types.ObjectId(id)
    }
    // console.log(params)

    let result = await mongodbHelper.count("model_config", params);
    // console.log(result)
    ctx.body = {
      status: 200,
      statusText: ' Template mongodb ok',
      data: {count: result},
    }
  }

  //查询模型信息
  async findModel(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;
    if (params._id != undefined) {
      let id = params._id
      params['_id'] = mongoose.Types.ObjectId(id)
    }
    let result = await mongodbHelper.find("model_config", params);
    ctx.body = {
      status: 200,
      statusText: 'search data from findModel mongodb ok',
      data: result,
    }
  }

  //查询模型信息
  async findModelGroup(ctx) {
    // console.log('ctx.request.body', ctx.request.body)
    let params = ctx.request.body;

    let result = await mongodbHelper.aggregate("model_config",
      [{$group: {_id: "$model_name", tempName: {$push: {label: "$tempName", value: "$_id"}}}}]);

    ctx.body = {
      status: 200,
      statusText: 'search data from findModel mongodb ok',
      data: result,
    }
  }

  async saveModelCSV(ctx) {
    let baseicTmpdir = config.TempDir;
    let list = await mongodbHelper.distinct("petrol_raw", "JH", {});
    let skipfields = ["_id"];

    for (let i = 0; i < list.length; i++) {
      let filter = {"JH": list[i]};
      let resultlen = await mongodbHelper.count("petrol_res", filter);
      if (resultlen > 800000) {
        continue
      }
      let result = await mongodbHelper.find("petrol_res", filter);
      let csvname = util.format("%s.csv", list[i]);
      let csvnameAbs = path.join(baseicTmpdir, csvname);

      let r = await JsonTocsv.ListObjConvert(result, skipfields, csvnameAbs);
      if (r) {
        // console.log(csvname + ",success")
      }
    }
  }

  async getdistinct(ctx) {

    let params = ctx.request.body;
    console.log(params)
    let list = await mongodbHelper.distinct(params["tablename"], params["field"], {});
    ctx.body = {
      status: 200,
      statusText: 'search data from findModel mongodb ok',
      data: list,
    }
  }

  async getcount(ctx) {

    let params = ctx.request.body;
    console.log(params)
    // let list = await mongodbHelper.count(params["tablename"], params["field"]);
    let list = await mongodbHelper.find(params["tablename"],{})
    // console.log(list.length)
    ctx.body = {
      status: 200,
      statusText: 'search data from findModel mongodb ok',
      data: list.length,
    }
  }

  async syncwelldata(ctx) {

    let params = ctx.request.body;
    console.log(params)
    // callfile.execFile('/usr/bin/python3 /root/apiserver/client/testarg.py',['-w', '"'+params["wellnum"]+'"'],null,function (err, stdout, stderr) {
    //
    //  console.log(err)
    //   console.log(stdout)
    //   console.log(stderr)
    //   // callback(err, stdout, stderr);
    // });

    callfile.exec('/usr/bin/python3 /root/apiserver/client/testarg.py -w' +'"'+params["wellnum"]+'"',function (err, stdout, stderr) {

      console.log(err)
      console.log(stdout)
      console.log(stderr)
      // callback(err, stdout, stderr);
    });

    ctx.body = {
      status: 200,
      statusText: 'search data from findModel mongodb ok',
      // data: list.length,
    }
  }
  async getModelCSVzip(ctx) {
    // console.log('getModelCSVzip ctx.request.body');
    // console.log(ctx.request.body)
    let baseicTmpdir = config.TempDir;
    let params = ctx.request.body;

    let tmplist = params["fields"].split(",")
    let selectlist = {DEPTH: 1, JH: 1, QXWJM: 1}
    tmplist.map((value) => { // tmplist 是需要显示的所有 列
      selectlist[value] = 1
    });
    selectlist[params["outputfields"]]=1
    console.log(selectlist)

    let csvNameFiles = [];


    let checkObj = {};
    let jhs = params["JH"];
    // 多个井号 循环以下过程
    for (let i = 0; i < jhs.length; i++) {
      let checkedQxwjmlist = []

      // 1. 找到某井号下所有的曲线文件名
      let qxwjmlist = await mongodbHelper.distinct("petrol_raw", "QXWJM", {JH: jhs[i]});
      // 2. 找到 曲线文件名 下所包含的列
      for (let qi = 0; qi < qxwjmlist.length; qi++) {
        let qxwjmfieldlist = await mongodbHelper.distinct("petrol_raw", "ZBMC", {QXWJM: qxwjmlist[qi]});  // list 是某曲线下包含的 列
        // console.log(qxwjmlist[qi], fieldlist)
        // 3. 对比 第2 步的列 与 tmplist 都包含才合格
        if (Business.isIncludes(qxwjmfieldlist, tmplist)) {
          // console.log(util.format("井号:%s,曲线文件名:%s,%s",
          //   jhs[i], qxwjmlist[qi],
          //   "符合"));
          checkedQxwjmlist.push(qxwjmlist[qi])
        } else {
          // console.log(util.format("井号:%s,曲线文件名:%s,%s",
          //   jhs[i], qxwjmlist[qi],
          //   "不符合"))
        }
      }
      checkObj[jhs[i]] = checkedQxwjmlist;
    }

    let maxrow = 300000 * 100;

    let skipfields = ["_id"];
    let result = [];
    let dataAll = [];
    for (let i = 0; i < jhs.length; i++) { // 循环井号
      let qxlist = checkObj[jhs[i]];
      for (let qi = 0; qi < qxlist.length; qi++) { // 循环井号下的曲线文件名
        let filter = {"JH": jhs[i], QXWJM: qxlist[qi]};
        let resultlen = await mongodbHelper.count("petrol_res", filter);
        // console.log("井号:" + jhs[i] + ",曲线文件名:" + qxlist[qi] + ",总行数:" + resultlen);
        if (resultlen < maxrow) {
          result = await mongodbHelper.findfield("petrol_res", filter, selectlist);
          // console.log(params["JH"][i])
          dataAll = dataAll.concat(result);
          result = [];
        }


      }
      let csvname = util.format("%s.csv", jhs[i]);

      let csvnameAbs = path.join(baseicTmpdir, csvname);

      await JsonTocsv.ListObjConvert(dataAll, skipfields, csvnameAbs, "UTF-8");
      csvNameFiles.push(csvnameAbs);
      dataAll = []
    }


    // 3.返回压缩文件
    let zipname = util.format("%s.zip", params["model_name"]);
    let zipfilenameAbs = path.join(baseicTmpdir, zipname);

    let Ziparchiver = archiver('zip');
    let output = fs.createWriteStream(zipfilenameAbs);

    Ziparchiver.pipe(output);

    csvNameFiles.map(function (v, i) {
      Ziparchiver.file(v, {'name': path.basename(v)})
    });

    await Ziparchiver.finalize();
    //删除CSV
    csvNameFiles.map(function (v, i) {
      // console.log(v)
      fs.unlink(v, function (err) {
        if (err) {
          // console.log(err)
        }

      })
    });


    ctx.body = {
      status: 200,
      data: {filename: zipname},
    };

  }


  async getModelCSV(ctx) {
    // console.log('getModelCSV ctx.request.body');
    // console.log(ctx.request.body)
    let baseicTmpdir = config.TempDir;
    let params = ctx.request.body;

    let fields = params["fields"].split(",");
    // console.log(fields)
    fields.push("JH");
    fields.push("QXWJM");
    fields.push("DEPTH");
    let s = new Set(fields);
    // console.log(s);

    let filter = {"JH": {"$in": params["JH"]}};
    // console.log(filter)
    // console.log(s)
    let resultlen = await mongodbHelper.count("petrol_res", filter);

    // console.log(resultlen)
    if (resultlen == 0) {
      ctx.body = {
        status: 400,
        statusText: 'not found table petrol_res data',
      };
      return
    }

    if (resultlen > 800000) {
      ctx.body = {
        status: 400,
        statusText: '数据大于80万行,建议减少井号',
      };
      return
    }

    let result = await mongodbHelper.findfield("petrol_res", filter, Array.from(s));
    let skipfields = ["_id"];

    let csvname = util.format("%s.csv", params["model_name"]);
    let csvnameAbs = path.join(baseicTmpdir, csvname);
    // console.log(csvnameAbs)
    let r = await JsonTocsv.ListObjConvert(result, skipfields, csvnameAbs, "UTF-8");
    if (r.result) {
      ctx.body = {
        status: 200,
        data: {filename: csvname},
      }
    }
    return
  }

  //保存曲线模版信息
  async getdownloadzip(ctx) {
    // console.log('getdownloadzip ctx.request.body');
    // console.log("_id:" + ctx.request.body["_id"]);
    //1. 提取参数
    if (!ctx.request.body.hasOwnProperty("_id")) {
      ctx.body = {
        status: 400,
        statusText: 'not found taskid',
      }
    }
    let baseicTmpdir = config.TempDir;
    // console.log(baseicTmpdir)
    //2.数据库取数据, 拼接参数
    let taskid = ctx.request.body["_id"];
    let params = {}
    params['_id'] = mongoose.Types.ObjectId(taskid)
    let result = await mongodbHelper.find("task", params);

    if (result.length == 0) {
      ctx.body = {
        status: 400,
        statusText: 'not found table task data',
      }
      return
    }
    if (!result[0].hasOwnProperty("yqtbm")) {
      ctx.body = {
        status: 400,
        statusText: 'not found table task data yqtbm',
      };
      return
    }

    let yqtbm = result[0]["yqtbm"];//油田
    let wellname = result[0]["wellname"]; //井号
    let label = result[0]["model_config"]["label"];
    let outparamslist=result[0]["model_config"]["outparamslist"];
    let d = new Date();
    let unix = util.format("%s%s%s_%s_%s", d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes());


    // console.log(yqtbm,wellname,label,unix);

    let zipfilename = util.format("%s-%s.zip", label, unix);
    zipfilename = zipfilename.replace('/^\s+|\s$/g', '');
    let zipfilenameAbs = path.join(baseicTmpdir, zipfilename)
    // console.log(zipfilenameAbs)
    let tablename = "taskResult_" + taskid;

    //xxx 只取数据中一条记录，防止多条重复记录
    // result = await mongodbHelper.findbylimit(tablename, {},0,1);
    result = await mongodbHelper.find(tablename, {});


    if (result.length == 0) {
      ctx.body = {
        status: 400,
        statusText: 'not found table taskResult_' + tablename + ' data',
        data: {}
      }
      return
    }


    let csvNameFiles = []; // csv文件列表
    let skipfields = ["_id"];
    let rebuilddataAll = [];
    let actfield=""
    let uniqArr=[];

    for (let v of result) {
      if (v.hasOwnProperty("dataAll") && !uniqArr.includes(v["QXWJM"])) {
        uniqArr.push(v["QXWJM"]); //xxx 防止多个相同的文件

        // 增加modify列
        v["dataAll"].map(function (v, i) {
          let tmp = {};
          tmp = Object.assign(tmp, v)
          if (tmp.hasOwnProperty("predict") && !tmp.hasOwnProperty("modify")) {
            tmp["modify"] = v["predict"]
          };
          if (actfield==""){
            if (tmp.hasOwnProperty(outparamslist.toUpperCase()+"act") ){
              actfield=outparamslist+"act"
            }
            if (tmp.hasOwnProperty(outparamslist.toLowerCase()+"act") ){
              actfield=outparamslist.toLowerCase()+"act"
            }
          }
          rebuilddataAll.push(tmp)
        });


        let csvname = util.format("%s-%s-%s-%s-%s.csv", yqtbm, wellname, v["QXWJM"], label, new Date().getTime());
        let csvnameAbs = path.join(baseicTmpdir, csvname);
        // console.log(csvnameAbs)
        let r = await JsonTocsv.ListObjConvert(rebuilddataAll, skipfields, csvnameAbs, 'UTF-8',actfield);
        if (r.result) {
          csvNameFiles.push(csvnameAbs)
        }
        rebuilddataAll = [];
      }
    }
    ;
    // console.log(csvNameFiles);

    // 3.返回压缩文件

    let Ziparchiver = archiver('zip');
    let output = fs.createWriteStream(zipfilenameAbs);

    Ziparchiver.pipe(output);

    csvNameFiles.map(function (v, i) {
      // console.log(v)
      Ziparchiver.file(v, {'name': path.basename(v)})
    });

    await Ziparchiver.finalize();
    // console.log(zipfilename)
    // let f = "11.zip"

    if (!fs.existsSync(zipfilenameAbs)) {
      ctx.body = {
        status: 400,
        statusText: 'not found zipfile',
        data: {}
      };
      return
    }
    let zipstats = fs.statSync(zipfilenameAbs)

    // console.log(zipstats)
    //删除CSV
    csvNameFiles.map(function (v, i) {
      // console.log(v)
      fs.unlink(v, function (err) {
        if (err) {
          // console.log(err)
        }

      })
    });
    // console.log(zipstats.size)
    if (zipstats.size > 500) {
      // let stream = fs.createReadStream(zipfilenameAbs);
      // let name=URLEncoder.encode(zipfilename,'utf-8');
      let name = urlencode.encode(zipfilename, 'UTF-8')
      // ctx.set({
      //   'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
      //   'Content-Disposition': 'attachment; filename='+name, //告诉浏览器这是一个需要下载的文件
      //   'Access-Control-Allow-Origin': '*',
      //   'Cache-Control': 'no-cache'
      // });
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: {filename: name},
      }
    } else {
      ctx.body = {
        status: 400,
        statusText: 'zipsize lt 500',
        data: {},
      }
    }
  }


  async getDownloadFile(ctx) {
    // console.log('getDownloadFile ctx.request.body', ctx.request.body);
    let baseicTmpdir = config.TempDir;

    if (ctx.request.body.hasOwnProperty("filename")) {
      let filename = ctx.request.body["filename"]
      await send(ctx, filename, {root: baseicTmpdir});
      // console.log(path.join(baseicTmpdir, filename))
      fs.unlink(path.join(baseicTmpdir, filename), function (err) {
        if (err) {
          // console.log(err)
        }

      })
    } else {
      ctx.body = {
        status: 400,
        statusText: 'not found params filename',
        data: {},
      }
    }
  }

  async getFieldCount(ctx) {
    // console.log('getFieldCount ctx.request.body', ctx.request.body);

    // 1. 提取参数
    if (!ctx.request.body.hasOwnProperty("field")) {
      ctx.body = {
        status: 400,
        statusText: 'not found field',
      };
      return
    }
    let field = ctx.request.body["field"];


    // 2. 聚合统计
    let project = {};
    project[ctx.request.body["field"]] = true;

    let params = [
      {"$match": {}},
      {$project: project},
      {$group: {_id: "$" + field}},
      {$group: {_id: null, count: {$sum: 1}}}
    ];

    // console.log(params)
    let result = await mongodbHelper.aggregate("petrol_raw", params);
    // let result1 = await mongodbHelper.distinct("petrol_raw", "JH",{});
    // console.log(result);
    // console.log(result1)
    if (result.length == 0) {
      ctx.body = {
        status: 400,
        statusText: 'not found petrol_raw',
        data: {count: 0}
      }
    } else {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: {count: result[0]["count"]}
      }

    }
  }

  async getTableCount(ctx) {
    // console.log('getTableCount ctx.request.body', ctx.request.body);
    let requet_params = ctx.request.body;

    if (!requet_params.hasOwnProperty("tablename")) {
      ctx.body = {
        status: 400,
        statusText: 'not found params tablename',
        data: {count: 0}
      };

      return
    }

    let filter = requet_params.hasOwnProperty("filter") ? requet_params["filter"] : {};
    console.log(filter)
    let result = await mongodbHelper.count(requet_params["tablename"], filter);
    ctx.body = {
      status: 200,
      statusText: 'ok',
      data: {result: result}
    };
  }

  async getIndexCount1(ctx) {
    // console.log('getIndexCount ctx.request.body', ctx.request.body);
    let request_params = ctx.request.body;
    // 1. 提取参数
    if (!ctx.request.body.hasOwnProperty("match")) {
      ctx.body = {
        status: 400,
        statusText: 'not found match',
        data: []
      };
      return
    }
    if (!ctx.request.body.hasOwnProperty("group")) {
      ctx.body = {
        status: 400,
        statusText: 'not found group',
        data: []
      };
      return
    }


    // 2. 聚合统计
    // let project= {};
    // project[ctx.request.body["field"]]=true;
    // console.log(request_params);
    let params = [
      {"$match": request_params["match"]},

      {$group: request_params["group"]}
    ];

    // console.log(params)
    let result = await mongodbHelper.aggregate("task", params);
    // let result1 = await mongodbHelper.distinct("petrol_raw", "JH",{});
    // console.log(result);
    // console.log(result1)
    if (result.length == 0) {
      ctx.body = {
        status: 400,
        statusText: 'not found data',
        data: []
      }
    } else {
      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: result
      }

    }
  }

  async getIndexCount2(ctx) {
    // console.log('getIndexCount2 ctx.request.body', ctx.request.body);
    let request_params = ctx.request.body;
    // 1. 提取参数
    if (!ctx.request.body.hasOwnProperty("match")) {
      ctx.body = {
        status: 400,
        statusText: 'not found match',
        data: []
      };
      return
    }
    if (!ctx.request.body.hasOwnProperty("group")) {
      ctx.body = {
        status: 400,
        statusText: 'not found group',
        data: []
      };
      return
    }


    // 2. 聚合统计
    let params = [
      {"$match": request_params["match"]},

      {$group: request_params["group"]}
    ];

    // console.log(params)
    let result = await mongodbHelper.aggregate("task", params);
    // let result1 = await mongodbHelper.distinct("petrol_raw", "JH",{});
    // console.log(result);

    if (result.length == 0) {
      ctx.body = {
        status: 400,
        statusText: 'not found data',
        data: []
      }
    } else {
      let findalData = [];
      let modelObj = {}
      let modelresult = await mongodbHelper.find("model_config", {});
      // console.log(modelresult);

      modelresult.map(function (v, i) {
        modelObj[v["id"]] = v
      });
      // console.log(modelObj)
      result.map(function (v, i) {
        if ((v["_id"] != '') && v["_id"]!=null && modelObj.hasOwnProperty(v["_id"]) ) {
          let tmp = {
            model: modelObj[v["_id"]]["model_name"],
            result: v["count"],
            content: modelObj[v["_id"]]["label"]
          }
          findalData.push(tmp)
        }

      });

      // console.log(findalData)

      ctx.body = {
        status: 200,
        statusText: 'ok',
        data: findalData
      }

    }
  }
}

module.exports = new FuncController();
