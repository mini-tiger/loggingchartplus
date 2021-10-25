
import moment from 'moment';

export function PageSizeList() {
    return [10, 20, 50, 100, 200,1000];

}

export function QuxianDict() {
    return [{label:"泥质含量",value:"泥质含量"},
        {label:"孔隙度",value:"孔隙度"},
        {label:"渗透率",value:"渗透率"},
        {label:"含水饱和度",value:"含水饱和度"}]
}

export function jTableWidth(value) {
    let rplat = 300;
    let arrlen = 0;
    if (value && value.constructor == Array) {
        arrlen = value.length;
    }
    switch (true) {
        case arrlen <= 7 :
            rplat = 100;
            break;
        case arrlen <= 20:
            rplat = 150;
            break;
        case arrlen <= 50:
            rplat = 200;
            break;
        case arrlen <= 100:
            rplat = 400;
            break;
        default:
            rplat = 400;
    }

    return rplat;

}

export function getCurrentUnix() {
    let time = new Date();
    return moment(time).valueOf();
}

export function getCurrentDateTime() {
    let time = new Date();
    return moment(time).format("YYYY-MM-DD HH:mm:ss")
}

export function jTableColWidth(value) {
    let l = value.length;
    if (value.includes("作业")){
        return 100
    }
    if (value.includes("操作")){
        return 150
    }
    if (value.includes("订单编号")){
        return 100
    }
    if (value.includes("时间") ){
        return 100
    }
    if (value.includes("应用程序") || value.includes("吞吐") ){
        return 80
    }
    if (value.includes("数据") ){
        return 80
    }

    let  rplat =10;
    switch (true) {
        case l <= 6:
            rplat = 80;
            break;
        case l <= 8:
            rplat = 100;
            break;
        case l <= 10:
            rplat = 150;
            break;
        case l >10:
            rplat = 180;
            break
        default:
            rplat = 20;
    }
    console.log(value,value.length,rplat);

    return rplat;

}
