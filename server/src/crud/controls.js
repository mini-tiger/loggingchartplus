const retCode = require('../utils/retcode');
const CrulService = require('./service');
const MockController = require('./data');
const Buss = require('../utils/business');
const Business = Buss.Business;
const redisHelper = require('../db/redis-helper');
const fs = require('fs');
const iconv = require('iconv-lite');
const path = require('path');
const send = require('koa-send');
const {uploadFile, dataCheckAndSave} = require('../utils/upload');
const csvjson = require('csvjson');
const csv = require('csvtojson');
const {uploadToAli} = require('../utils/uploadToAli');
const ApiController = require('../cmdb/controls');
const Json2csvParser = require('json2csv').Parser;
const {mkdirsSync, mkdirs} = require('../utils/mkdir');
const mongooseAPI = require('./mongoos');

async function sendFile(ctx, filename) {
  await send(ctx, filename);
}

class CrudController {
  async getCrudAPI(ctx) {
    let args = {};
    let queryObj = ctx.query;
    for (let querykey in queryObj) {
      // console.log(queryObj[querykey]);
    }
    args.apipath = ctx.params.urlpath;
    args.apimethod = ctx.method;
    let methodList = args.apipath.split("/");
    // console.log('methodList', methodList);

    //查询此API是否存在
    let crud_field = "crud_field"; // 导入导出需要调用字段信息，固定CrulService.getCrudBase("crud_field"))
    let key = "CRUD_" + methodList[0]; // redis的key

    //let crud = await Business.Redis_getORset(key, CrulService.getCrudBase(methodList[0]));
    let crud = await mongooseAPI.getCrudBase(methodList[0]);

    if (!crud.result) {
      ctx.body = {
        status: retCode.Fail,
        statusText: 'API未找到',
        data: {},
      };
    } else {
      if (methodList[1] == "config") {
        let initConfig = await mongooseAPI.initConfig(crud.fields);
        //判断是否crud_field
        /*
        if (methodList[0] == 'crud_field') {
          //获取crud_table
          let crudFilterConfig = await MockController.crudFilterConfig();
          initConfig.filterConfig = crudFilterConfig;
        }
        */
        ctx.body = {
          status: retCode.Success,
          statusText: 'API已经找到',
          data: {
            tableinfor: {
              base: crud.base,
              fields: crud.fields,
              //fieldConfig: initConfig.formConfig,
              //filterConfig: initConfig.filterConfig,
              //columnsConfig: initConfig.colunmConfig,
              dictConfig: initConfig.dictConfig,
            }
          },
        };
      } else if (methodList[1] == "unInit") {
        let unInitResult = await MockController.unInitTable();
        ctx.body = {
          status: retCode.Success,
          statusText: '查询成功',
          data: unInitResult,
        };
      } else if (methodList[1] == "new") {
        let crudParam = ctx.request.body;
        //判断是否数据库已经创建数据表
        let checkResult = await MockController.checkTable(crudParam);
        if (!checkResult) {
          ctx.body = {
            status: retCode.Fail,
            statusText: '请先在数据库创建相关数据表',
            data: {},
          };
        } else {
          //从数据库读取表结构，初始化到crud_field
          let crudResult = await MockController.initCrudConfig(crudParam);
          if (!checkResult) {
            ctx.body = {
              status: retCode.Fail,
              statusText: '初始化模块数据异常或已初始化过数据',
              data: {},
            };
          } else {
            ctx.body = {
              status: retCode.Success,
              statusText: '操作成功',
              data: ctx.request.body
            };
          }
        }
      } else if (methodList[1] == "create") {
        let crudParam = {
          table_name: methodList[0],
          params: ctx.request.body,
        };
        //判断是否存在重复记录
        // let recordCount = await MockController.unique(crudParam, crud.fields);
        // if (recordCount > 0) {
        //   ctx.body = {
        //     status: retCode.Fail,
        //     statusText: '唯一索引重复记录',
        //     data: {},
        //   };
        // } else {
        let crudResult = await mongooseAPI.create(crudParam, crud.fields);
        redisHelper.redis.del(key);
        ctx.body = {
          status: retCode.Success,
          statusText: '操作成功',
          data: crudResult
        };
        // }
      } else if (methodList[1] == "update") {
        let crudParam = {
          table_name: methodList[0],
          params: ctx.request.body,
        };
        //判断是否存在重复记录
        if (crudParam.params < 2) {
          ctx.body = {
            status: retCode.Fail,
            statusText: '参数错误',
            data: {}
          };
          return
        }
        let crudResult = await mongooseAPI.update(crudParam, crud.fields);
        redisHelper.redis.del(key); // 异步删除
        ctx.body = {
          status: retCode.Success,
          statusText: '操作成功',
          data: crudResult
        };

      } else if (methodList[1] === "createUpdate") {
        let crudParam = {
          table_name: methodList[0],
          params: ctx.request.body,
        };
        if (Object.keys(crudParam.params).length === 0) {
          ctx.body = {
            status: retCode.Fail,
            statusText: '操作失败，参数不能为空',
            data: {}
          };
          return
        }
        let unique = '';
        crud.fields.map((obj) => {
          if (obj.unique_index == 1) {
            unique = obj.field_id
          }
        });
        if (!crudParam.params.hasOwnProperty(unique) || !unique) {
          ctx.body = {
            status: retCode.Fail,
            statusText: '操作失败，无唯一id',
            data: {}
          };
          return
        }
        let params = {};
        params[unique] = crudParam.params[unique];
        let readParams = {
          table_name: crudParam.table_name,
          params: params
        };

        let crudReadList = await mongooseAPI.read(readParams, crud.fields);
        if (crudReadList && crudReadList.hasOwnProperty('total')) {
          if (crudReadList.total === 0) {
            let crudResult = await mongooseAPI.create(crudParam, crud.fields);
            redisHelper.redis.del(key);
            ctx.body = {
              status: retCode.Success,
              statusText: '创建成功',
              data: crudResult
            };
            return
          } else if (crudReadList.total === 1) {
            let crudResult = await mongooseAPI.update(crudParam, crud.fields);
            redisHelper.redis.del(key); // 异步删除
            ctx.body = {
              status: retCode.Success,
              statusText: '更新成功',
              data: crudResult
            };
            return
          } else {
            ctx.body = {
              status: retCode.Fail,
              statusText: '操作失败，数据不唯一，无法更新，请联系管理员',
              data: {}
            };
            return
          }

        } else {
          ctx.body = {
            status: retCode.Fail,
            statusText: '操作失败，查询错误，请联系管理员',
            data: {}
          };
          return
        }


      } else if (methodList[1] === "delete") {
        let crudParam = {
          table_name: methodList[0],
          params: ctx.request.body,
        };
        let unique = '';
        crud.fields.map((obj) => {
          if (obj.unique_index == 1) {
            unique = obj.field_id
          }
        });
        if (!crudParam.params.hasOwnProperty(unique) || !unique) {
          ctx.body = {
            status: retCode.Fail,
            statusText: '操作失败，无唯一id',
            data: {}
          };
          return
        }
        let crudResult = await MockController.delete(crudParam, unique);
        ctx.body = {
          status: retCode.Success,
          statusText: '操作成功',
          data: crudResult
        }


      } else if (methodList[1] == "read") {
        let crudParam = {
          table_name: methodList[0],
          params: ctx.request.body,
        };

        let crudReadList = await mongooseAPI.read(crudParam, crud.fields);

        ctx.body = {
          status: retCode.Success,
          statusText: '操作成功',
          data: crudReadList
        };
      } else if (methodList[1] == "downtpl") {
        let crudParam = {
          table_name: crud_field,
          params: ctx.request.body,
        };
        crudParam.params.page = 1;
        crudParam.params.pagesize = 1000;


        let crud = await CrulService.getCrudBase(crud_field);
        let crudReadList = await MockController.readFields(crudParam, crud.fields);

        let fileName = crudParam.params.table_id + ".csv";


        mkdirsSync("server/tpls/");
        let filePath = path.join("server/tpls/", fileName);
        let data = await fs.statSync("server/tpls/");
        if (!data.isDirectory()) {
          fs.mkdirSync(fileDir)
        }

        let fields = [];
        let field_name = {};
        let field_type = {};
        for (let i = 0; i < crudReadList.dataList.length; i++) {
          let tmp = crudReadList.dataList[i];
          if (tmp.table_id == methodList[0]) {
            fields.push(tmp.field_id);
            field_name[tmp.field_id] = tmp.field_name;
            field_type[tmp.field_id] = tmp.field_type
          }

        }
        let file_data = [field_name, field_type];
        // console.log(file_data)


        const json2csvParser = new Json2csvParser({fields, delimiter: ','});
        const csv = json2csvParser.parse(file_data);

        var newcsv = iconv.encode(csv, 'GBK');

        fs.writeFile(filePath, newcsv, function (err) {
          if (err){
            // console.log(err);
          }
        });
        await send(ctx, filePath);

      } else if (methodList[1] == "exportData") {
        let crudParam = {
          table_name: crud_field,
          params: ctx.request.body,
        };
        crudParam.params.page = 1;
        crudParam.params.pagesize = 1000;

        let crud = await CrulService.getCrudBase(crud_field);
        let crudReadList = await MockController.readFields(crudParam, crud.fields);
        let fileName = crudParam.params.table_id + ".csv";
        // console.log(crudParam.params.table_id)
        let args = {table: crudParam.params.table_id, max: 6000};

        let exportdata = await CrulService.getExportData(args); // 提取数据库中数据

        let filePath = path.join("server/exportData/", fileName);
        await fs.stat("server/exportData/", function (err, stat) {
          if (err) {
            fs.mkdirSync("server/exportData/")
          }
        });

        let fields = [];
        let field_name = {};
        let field_type = {};

        for (let i = 0; i < crudReadList.dataList.length; i++) {
          let tmp = crudReadList.dataList[i];
          if (tmp.table_id == methodList[0]) {
            fields.push(tmp.field_id);
            field_name[tmp.field_id] = tmp.field_name;
            field_type[tmp.field_id] = tmp.field_type
          }
        }
        // console.log(exportdata.data)

        let file_data = [field_name, field_type]; //所有数据 写入一个列表
        exportdata.data.map(function (v, i) {
          file_data.push(v)
        })

        const json2csvParser = new Json2csvParser({fields});
        const csv = json2csvParser.parse(file_data);

        var newcsv = iconv.encode(csv, 'GBK'); // 转换编码 适应中文
        // console.log(filePath)
        fs.writeFile(filePath, newcsv, function (err) {
          if (err) {
            // console.log(err);
          }
        });
        await send(ctx, filePath);

      } else if (methodList[1] == "uploadCsv") {

        /*
        1.保存上传的数据流为本地csv文件
        2.解析CSV文件，转换为对象
        3. 将对象一行一行插入数据库，获取返回结果，返回前台
        * */

        let result = {success: false};
        let serverFilePath = "server/uploadcsv/";

        let crudParam = {
          table_name: methodList[0],
          params: ctx.request.body,
        };

        // 上传文件事件
        result = await uploadFile(ctx, {
          fileType: 'album',
          path: serverFilePath,
          // callback:dataCheckAndSave,
        });

        if (result.success) {  // 上传成功
          crudParam.params.table_id = result.uploadfilenameArr[0]; // 自定义参数
          crudParam.params.page = 1;
          crudParam.params.pagesize = 1000;


          let crud = await CrulService.getCrudBase(crud_field);
          let crudReadList = await MockController.read(crudParam, crud.fields);
          // console.log(crudReadList)

          if (crudReadList.total == 0) { // 代表没有上传文件名，对应的表名的记录
            ctx.body = {
              status: retCode.Fail,
              statusText: '上传成功，操作失败',
              data: {}
            };
          } else {
            let DataResult = await dataCheckAndSave(result, crudReadList); // 上传成功后 解析 CSV，检测数据
            // console.log(DataResult)

            if (DataResult.status) {
              ctx.body = {
                status: retCode.Success,
                statusText: '上传成功，操作成功',
                data: {
                  result: DataResult,
                }
              }
            } else {
              ctx.body = {
                status: retCode.Fail,
                statusText: DataResult.message,
                data: {
                  result: DataResult.message,
                }

              };
            }
          }
        } else {
          ctx.body = result
        }

      } else if (methodList[1] === "uploadImage") {
        ctx.body = await uploadToAli(ctx);
      } else if (methodList[1] === "cmdbApi") {
        ctx.body = await ApiController.POST(ctx);
      }
    }
  }

}

module.exports = new CrudController();
