/*
 * 返回码
 */
const RetCode = {
    SessionExpired: -1,             //session过期

    Fail: 400,                        //失败
    Success: 200,                     //成功
    ArgsError: 2,                   //参数错误
    UserExisted: 10,                //用户已经存在
    EmailExisted: 15,               //邮箱已经存在
    PhoneExisted: 25,               //手机号已经存在
    UsernameOrPasswordError: 11,    //用户名或者密码错误      
    UserNotExist: 12,               //用户不存在
    UserNotAuth:401,//没有登录权限
};

module.exports = RetCode
