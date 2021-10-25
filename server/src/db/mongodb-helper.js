// mongodb 操作包
const mongodb = require('mongodb').MongoClient;
//let host="http://www.zhichiwangluo.com/index.php?"
let host="http://162.14.19.86/index.php?"
const request = require('request');

//配置文件
const config = require('../config/config');

// 根据状态判断是否有用户名
let state = null;

if(config.MONGODB.username!=''&&config.MONGODB.password!=''){// 有用户名密码
    state = true;
}else{// 没有用户名密码
    state = false;
};
// console.log(state)

// 定义基本类
class app{
    // 多次连接共享实例对象
    static getInstance(){
        if(!app.instance){
            app.instance = new app();
        };
        // 简化性能提升
        return app.instance;
    }

    //默认初始化执行方法
    constructor(){
        // 存放mongodb连接后的对象
        this.dbClient = '';
        // 初始化连接数据库
        this.connect()
    };

    // 连接
    connect(){
        if(state){// 有用户名密码
            return new Promise((resolve,reject) => {
                if(!this.dbClient){
                    let url='mongodb://'+config.MONGODB.username+':'+config.MONGODB.password+'@'+config.MONGODB.address+':'+config.MONGODB.port+'/'+config.MONGODB.database+'?authMechanism=DEFAULT';
                    mongodb.connect(url,{
                        useNewUrlParser:true,useUnifiedTopology: true
                    },(err,client) => {
                        if(!err){
                            this.dbClient = client.db(config.MONGODB.database);
                            resolve(this.dbClient);
                        }else{
                            reject(err);
                        };
                    });
                }else{
                    resolve(this.dbClient);
                };
            });
        }else{// 没有用户名密码
            return new Promise((resolve,reject) => {
                if(!this.dbClient){
                    mongodb.connect('mongodb://'+config.MONGODB.address+':'+config.MONGODB.port+'/',{
                        useNewUrlParser:true,
                        useUnifiedTopology: true
                    },(err,client) => {
                        if(!err){
                            this.dbClient = client.db(config.MONGODB.database);
                            resolve(this.dbClient);
                        }else{
                            reject(err);
                        };
                    });
                }else{
                    resolve(this.dbClient);
                };
            });
        };
    };

    // 添加
    add(tableName,json){
        return new Promise((resolve,reject) =>{
            this.connect().then(db => {
                db.collection(tableName).insertOne(json,(err,result) => {
                    if(!err){
                        resolve(result);
                        return;
                    };
                    reject(err);
                });
            });
        });
    };
    // 添加
    insert(tableName,json){
        return new Promise((resolve,reject) =>{
            this.connect().then(db => {
                db.collection(tableName).insert(json,(err,result) => {
                    if(!err){
                        resolve(result);
                        return;
                    };
                    reject(err);
                });
            });
        });
    };

    delCollect(tableName){
      return new Promise((resolve,reject) => {
        this.connect().then(db => {
          db.dropCollection(tableName,function(err,result)  {
            if(!err){
              resolve(result);
              return;
            };
            // reject(err);
            resolve(err);
          });
        });
      });
    }

    // 删除
    remove(tableName,json){
        return new Promise((resolve,reject) => {
            this.connect().then(db => {
                db.collection(tableName).removeOne(json,(err,result) => {
                    if(!err){
                        resolve(result);
                        return;
                    };
                    reject(err);
                });
            });
        });
    };

    // 更新
    update(tableName,condition,json){
        return new Promise((resolve,reject) => {
            this.connect().then(db => {
                db.collection(tableName).updateOne(condition,{
                    $set:json
                },(err,result) => {
                    if(!err){
                        resolve(result);
                        return;
                    };
                    reject(err);
                });
            });
        });
    };

  updateMany(tableName,condition,json){
    return new Promise((resolve,reject) => {
      this.connect().then(db => {
        db.collection(tableName).updateMany(condition,{
          $set:json
        },(err,result) => {
          if(!err){
            resolve(result);
            return;
          };
          reject(err);
        });
      });
    });
  };


    // save
    save(tableName,json){
        return new Promise((resolve,reject) => {
            this.connect().then(db => {
                db.collection(tableName).save(json, (err, result) => {
                    if(!err){
                        resolve(result);
                        return;
                    };
                    reject(err);
                });
            });
        });
    };
    // 查询
    find(tableName,json){
        return new Promise((resolve,reject) => {
            this.connect().then(db => {
                let result = db.collection(tableName).find(json);
                result.toArray((err,data) => {
                    if(!err){
                        resolve(data);
                        return;
                    }
                    reject(err);
                });
            });
        });
    };
    findfield(tableName,json,field){
        return new Promise((resolve,reject) => {
            this.connect().then(db => {
                let result = db.collection(tableName).find(json,{projection:field});
                result.toArray((err,data) => {
                    if(!err){
                        resolve(data);
                        return;
                    }
                    reject(err);
                });
            });
        });
    };
  findfieldsort(tableName,json,field,sort){
    return new Promise((resolve,reject) => {
      this.connect().then(db => {
        let result = db.collection(tableName).find(json,{projection:field}).sort(sort);
        result.toArray((err,data) => {
          if(!err){
            resolve(data);
            return;
          }
          reject(err);
        });
      });
    });
  };

    findbylimit(tableName,json,skip,limit){
        return new Promise((resolve,reject) => {
            this.connect().then(db => {
                let result = db.collection(tableName).find(json,).skip(skip).limit(limit);
                result.toArray((err,data) => {
                    if(!err){
                        resolve(data);
                        return;
                    }
                    reject(err);
                });
            });
        });
    };
  findbylimitfield(tableName,json,field,skip,limit){
    return new Promise((resolve,reject) => {
      this.connect().then(db => {
        let result = db.collection(tableName).find(json,{projection:field}).skip(skip).limit(limit);
        result.toArray((err,data) => {
          if(!err){
            resolve(data);
            return;
          }
          reject(err);
        });
      });
    });
  };

    // count
    count(tableName,json){
        return new Promise((resolve,reject) => {
            this.connect().then(db => {
                db.collection(tableName).count(json,(err,result) => {
                    if(!err){
                        resolve(result);
                        return;
                    };
                    reject(err);
                });
            });
        });
    };
    // 查询唯一
    distinct(tableName,field,json){
        return new Promise((resolve,reject) => {
            this.connect().then(db => {
                db.collection(tableName).distinct(field,json,(err,result) => {
                    if(!err){
                        resolve(result);
                        return;
                    };
                    reject(err);
                });
            });
        });
    };

  // 分组统计
  aggregate(tableName,json){
    return new Promise((resolve,reject) => {
      this.connect().then(db => {
        let result = db.collection(tableName).aggregate(json);
        result.toArray((err,data) => {
          if(!err){
            resolve(data);
            return;
          }
          reject(err);
        });
      });
    });
  };



  // 封装一个post请求方法
  async request_host(method,url, data){
    // 这里需要判断 data 数据类型，因为自定义菜单和图片上传的数据格式有异，会导致报错
    return new Promise((resolve, reject) => {
        var form = {
            url:host+ url
        }
        if (typeof data == 'string') {
            form.body = data // 如果数据格式为字符，则菜单数据通过 body 提交给接口
        } else {
            form.formData = data // 否则数据通过 formData 提交给接口（这里指的是上传图片接口）
        }
        if(method =="get"){
            request.get(form, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                //console.log('post request success')
                resolve(body)
            } else {
                // console.log('post request fail', error)
            }
          })
        }else{
            request.post(form, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                //console.log('post request success')
                resolve(body)
            } else {
                // console.log('post request fail', error)
            }
          })
        }

    })
  }
};
// 导出模块
module.exports = app.getInstance();


