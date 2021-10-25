const redisHelper = require('../db/redis-helper');
const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址

class Business {
  async Redis_getORset(key, callback) {
    let Result = {}
    let redisResult = await redisHelper.RedisDB.get(key, function (err, result) {

      return result;
    }).catch(err => {
      // console.log("err:", err)
    });
    if (redisResult != null) { // 从redis 取
      Result = JSON.parse(redisResult)
      return Result
    } else {
      Result = await callback;
      redisHelper.RedisDB.set(key, JSON.stringify(Result), function (err, res) {
        // console.log(" set :", err, res);
      });
      return Result
    }

  }
  getip(trueip){
    let IPAdress = '';
    for(var devName in interfaces){
      var iface = interfaces[devName];
      for(var i=0;i<iface.length;i++){
        var alias = iface[i];
        if(alias.family === 'IPv4'
          && alias.address !== '127.0.0.1' && !alias.internal){
          IPAdress = alias.address;
          if (IPAdress == trueip){
            return true
          }
        }
      }
    }
    return false
  }
  isIncludes(parentArr, childrenArr) {
    let tempArrLength = Array.from(new Set([...parentArr, ...childrenArr])).length
    return tempArrLength === parentArr.length || tempArrLength === childrenArr.length
  }

  getlimit(num,limit){
    let n = num/limit;
    let limits=[];
    for (let i=0;i<=n;i++){
      limits.push(i*limit)
    }
    limits.push(num)
    // console.log(limits)
    return limits
  }

  formatObj(list) {
    let listobj=[]
    for (let ii of list){
      listobj.push({label:ii,value:ii})
    }
    return listobj
  }

}




module.exports = {
  Business: new Business(),

};

