const userService = require('../service/user');
const retCode = require('../utils/retcode')

class UserController {
  async profile(ctx) {
    const res = await userService.profile();
    ctx.body = res.data;
  }

  /**
   * 登录
   * @param  {object} ctx   上下文
   * @return {object}       结果
   */
  async login(ctx) {
    let form = ctx.request.body

    const args = {
      username: form.username,
      userpass: form.password,
      auth:form.auth,
    }

    let result = {
      code: retCode.Success,
      data: null
    }

    //验证非空
    if (!args.username || !args.userpass) {
      ctx.body = {
        status: retCode.ArgsError,
        statusText: '参数错误',
        currentAuthority: 'guest',
      };
    } else {

      let userResult = await userService.getByUserName(args)

      if (userResult.data.length == 0) {
        ctx.body = {
          status: retCode.UserNotExist,
          statusText: '用户名不存在',
          currentAuthority: 'guest',
        };
        return
      }


      if (userResult.data[0].password != args.userpass) {  //密码错误
        ctx.body = {
          status: retCode.UsernameOrPasswordError,
          statusText: '密码错误',
          currentAuthority: 'guest',
        };
        return
      }
      if (userResult.data[0].status=='1'){
        ctx.body = {
          status: retCode.UserNotAuth,
          statusText: '该用户已经停用',
          currentAuthority: 'guest',
        };
        return
      }
      if (userResult.data[0].status=='2'){
        ctx.body = {
          status: retCode.UserNotAuth,
          statusText: '该用户已经锁定',
          currentAuthority: 'guest',
        };
        return
      }

      let userResultAuth = userResult.data[0].auth.split(",")

      if (userResultAuth.indexOf(args.auth) < 0) {  //没有相应登录权限
        ctx.body = {
          status: retCode.UserNotAuth,
          statusText: '没有登录' + args.auth + "权限",
          currentAuthority: 'guest',
        };
        return
      }
      ctx.body = {
        status: retCode.Success,
        statusText: '登录成功',
        currentAuthority: 'app1',
        userInfo: userResult.data[0]
      };
    }
  }

  /**
   * 注册
   * @param  {object} ctx   上下文
   * @return {object}       结果
   */
  async register(ctx) {
    let form = ctx.request.body

    const args = {
      username: form.name,
      userpass: form.passwd
    }

    let result = {
      code: retCode.Success,
      data: null
    }

    //验证非空
    if (!args.username || !args.userpass) {
      ctx.body = {
        status: retCode.ArgsError,
        statusText: '参数错误',
        currentAuthority: '0',
      };
    } else {

      ctx.body = {
        status: retCode.Success,
        statusText: '插入注册数据成功',
        currentAuthority: 'user',
      };
    }
  }


  async logout(ctx) {
    ctx.body = {
      status: 200,
      statusText: 'ok',
      currentAuthority: 'guest',
    };
  }


}

module.exports = new UserController();
