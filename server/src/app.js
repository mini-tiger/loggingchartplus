const Koa = require('koa');

const path = require('path');
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const respond = require('koa-respond');
const logger = require('koa-logger');
const serve = require('koa-static');

const FuncController = require('./controller/func');
var schedule = require('node-schedule');
const app = new Koa();
const router = new Router();
const routerCrud = new Router();
const Buss = require('./utils/business');
const Business = Buss.Business;

const port = process.env.PORT || 3007;

require('./router')(router);
require('./crud/router')(routerCrud);


//定时任务
function scheduleCronstyle(){
  schedule.scheduleJob('30 * * * * *', function(){
      // console.log('scheduleCronstyle:' + new Date());
      FuncController.execTask();
  });
}

if (Business.getip("192.168.40.113")){
}

const { historyApiFallback } = require('koa2-connect-history-api-fallback')

app
  .use(cors())
  .use(logger())
  .use(bodyParser())
  .use(helmet())
  .use(respond())
  .use(historyApiFallback({ whiteList: ['api','crud','qxwjm','task'] }))
  .use(router.routes())
  .use(routerCrud.routes())
  .use(router.allowedMethods())
  .use(serve(path.join(process.cwd(), '../client/build')))
  .listen(port, () => {
  });

