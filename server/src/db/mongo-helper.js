const config = require('../config/config');
const MongoClient = require('mongodb').MongoClient;

let url = "mongodb://" + config.MONGODB.user + ":" + config.MONGODB.password + "@" + config.MONGODB.host + ":" + config.MONGODB.port + "/"+config.MONGODB.db;

class MongoHelper {
  async find(obj, table) {
    return new Promise((resolve, reject) => {
      try {
        MongoClient.connect(url,{useNewUrlParser: true}, (err,db) =>{
          if (err){
            reject(err)
          }
          let dbo=db.db(config.MONGODB.db);
          dbo.collection(table).find(obj).toArray(function (err,result) {
            if (err){
              reject(err)
            }
            resolve(result);
            db.close()
          })
        })
      } catch (e) {
        reject(e)

      }

    })

  }
}
module.exports = new MongoHelper();
