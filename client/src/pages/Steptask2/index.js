import React, {Component} from 'react';
import DataBinder from '@icedesign/data-binder';
import SimpleTransferUpload from './components/SimpleTransferUpload';
import V5 from '../V5';
import IceContainer from '@icedesign/container';
import {
    Divider,
    Progress,
    NumberPicker,
    Step,
    Button,
    Loading,
    Tab,
    Pagination,
    Grid,
    Input,
    Select,
    Transfer,
    Message,
    Notification,
    Typography,
    Table,
    Form,
    Checkbox
} from '@alifd/next';
import styles from './index.module.scss';
import IcePanel from '@icedesign/panel';
import IceLabel from '@icedesign/label';

const {H1, H2, H3, H4, Paragraph, Text} = Typography;
const {Item: StepItem} = Step;
const {Group: ButtonGroup} = Button;
const {Row, Col} = Grid;
import Filter from './components/Filter'
import axios from 'axios';
import qs from 'querystring';
import {IsNumber} from '../../utils/tools'
import config from '../../../config'

const FormItem = Form.Item
const {Group: CheckboxGroup} = Checkbox
const formItemLayout = {
    labelCol: {
        fixedSpan: 10
    },
    wrapperCol: {
        span: 14
    }
}

function getParams(url) {
    try {
        var index = url.indexOf('?');
        url = url.match(/\?([^#]+)/)[1];
        var obj = {}, arr = url.split('&');
        for (var i = 0; i < arr.length; i++) {
            var subArr = arr[i].split('=');
            var key = decodeURIComponent(subArr[0]);
            var value = decodeURIComponent(subArr[1]);
            obj[key] = value;
        }
        return obj;

    } catch (err) {
        return null;
    }
}

export function PageSizeList() {
    return [10, 20, 50, 100, 200, 1000];

}

const statusArray = [
    {type: "default", label: "编辑"},
    {type: "primary", label: "待处理"},
    {type: "info", label: "处理中"},
    {type: "success", label: "处理完毕"}
]

const preDictArray = [
    "非储层", "隔夹层", "干层", "含油水层", "含气水层", "潜力层", "可疑油气层", "差气层", "差油气层", "油水同层", "气水同层", "油气层", "气层"
];
const fclist = [
    {
        value: "泥质含量",
        label: "泥质含量小于等于:"
    },
    {
        value: "含水饱和度",
        label: "含水饱和度小于等于:"
    },
    {
        value: "孔隙度",
        label: "孔隙度大于等于:"
    },
    {
        value: "渗透率",
        label: "渗透率大于等于:"
    }
]
@DataBinder({
    getYT: {
        method: 'post',
    },
    getModel: {
        method: 'post',
    },
    getwellflist: {
        method: 'post',
    },
    getJH: {
        method: 'post',
    },
    getidxlist: {
        method: 'post',
    },
    saveTask: {
        method: 'post',
    },
    getTask: {
        method: 'post',
    },
    findQxByTask: {
        method: 'post',
    },
    findByTaskDepth: {
        method: 'post',
    },
    getTaskResult: {
        method: 'post',
    },
    tablesave: {
        method: 'post',
    },
})
export default class Steptask2 extends Component {

    constructor(props) {
        super(props);
        this.hisTask = false;
        this.initmin = 0;
        this.initmax = 0;
        this.chartData = {dataList: []};
        this.datalistModify=[];
            this.state = {
                tab3visible:true,
                fclistchecked: {},
                fcsill:{},
                activeKey: 1,
                model_paramslist: [],
                nextdisable: false,
                explist: ['泥质含量', '孔隙度', '渗透率', '饱和度', '识别'],
                taskuser: "admin",
                taskrole: "admin",
                share: 0,
                resultpage: false,
                DialogVisible: false,
                visibleChart: false,
                nummax: 0,
                nummin: 0,
                chartmin: 0,
                chartmax: 0,
                loglist: [],
                temp: "",
                model_name: "",
                tempList: [],
                mss: "", // 合规性检查日志
                changenum: false,
                taskResult: false,
                checklistload: false,
                defaultQX: {temp: "", min: 0, max: 0},
                isLoading: false,
                chartData: {
                    configList: [],
                    dataList: [],
                    sectionData: []
                },
                percentnum: 0,
                tabelcolumns: [],
                currentStep: 0,
                stepDisplay: ['block', 'none', 'none', 'none', 'none'],
                QXWJMValue: "",
                modeltype: '',
                ytList: [],
                wellnolist: [],
                wellflist: [],
                modellist: [],
                checkedlist: [],
                qxwjmlist: [],
                taskList: [],
                percent: 0,
                task_qxwjm: '',
                params: {
                    status: '0',
                    tasktitle: '',
                    taskdec: '',
                    yqtbm: '',
                    wellname: '',
                    qxwjm_list: '',
                    model_id: '',
                    model_config: {},
                    loglist: [],
                    checkedlist: [],
                    qxwjmlist: [],
                    expvalue: ''
                },
                section: {
                    Pagination: {
                        current: 1,
                        pageSize: 10,
                        total: 10
                    },
                    dataSource: []
                },
                detail: {
                    Pagination: {
                        current: 1,
                        pageSize: 10,
                        total: 10
                    },
                    dataSource: [],

                },
                tableDetailLoading: false
            };
        this.handleYTChange = this.handleYTChange.bind(this);
        this.handleJHChange = this.handleJHChange.bind(this);
        this.handleModelChange = this.handleModelChange.bind(this);
        this.isIncludes = this.isIncludes.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.next = this.next.bind(this);
        this.handleQXChange = this.handleQXChange.bind(this);
        this.renderDict = this.renderDict.bind(this);
        this.renderIndex = this.renderIndex.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.sectionPagination = this.sectionPagination.bind(this);
        this.detailPagination = this.detailPagination.bind(this);
    }

    titleChange = (tasktitle) => {
        let params = this.state.params;
        params['tasktitle'] = tasktitle;
        this.setState({params: params});
    };

    messageChange = (taskdec) => {
        let params = this.state.params;
        params['taskdec'] = taskdec;
        this.setState({params: params});
    };
    onClose = reason => {
        // console.log(reason);
        this.setState({
            DialogVisible: false
        });
    };

    //保存任务配置
    saveTask() {
        // console.log(this.state.params);
        let p = this.state.params
        p["taskuser"] = this.state.taskuser;
        p["taskrole"] = this.state.taskrole;
        p["share"] = this.state.share.toString();
        //初始化页面配置-取油田配置
        this.props.updateBindingData('saveTask', {
            url: '/' + config.urlSuffix + '/api/saveTask',
            data: this.state.params
        }, (item) => {
            if (item.data.result.nModified === undefined) {
                this.setState({
                    params: item.data.ops[0]
                })
            }

        })
    }

    next = () => {
        // console.log(this.state.params);

        if (this.state.currentStep == 3) {
            this.setState({
                currentStep: 4,
            })
        }


        //判断title和message 是否为空
        if (this.state.currentStep == 2) {
            if (this.state.params.tasktitle == "" || this.state.params.taskdec == "") {
                return;
            } else if (this.state.params.status == "0") {
                //保存数据
                this.saveTask();
            }
        } else if (this.state.currentStep == 0) {
            if (this.state.params.model_id == "" || this.state.params.yqtbm == "" || this.state.params.wellname == "") {
                return
            } else if (this.state.qxwjmlist.length == 0) {
                Notification.open({
                    title: '操作提醒',
                    content: '请确认选择一组测井曲线文件名.',
                    duration: 1500,
                    type: "error"
                });
                return;
            } else if (this.state.params.status == "0") {
                //保存数据
                let params = this.state.params;
                let zbstr = this.state.qxwjmlist.join(',')
                params['qxwjm_list'] = zbstr;

                this.setState({params: params});
                // this.saveTask();

                //校验曲线数据字段是否满足模型输入参数
                //let params=this.state.params;
                let model_inparams = this.state.model_config.inparamslist

                let model_paramslist = model_inparams.split(',');
                this.setState({
                    model_paramslist
                })
                //判断曲线参数是否符号模型输入参数
                // this.state.qxwjmlist.map(qxwjm => {
                //     //查询曲线指标列表
                //     let filter = {};
                //     filter['QXWJM'] = qxwjm;
                //     //this.setState({params:params});
                //     let url = '/' + config.urlSuffix + '/api/getidxlist';
                //     this.props.updateBindingData('getidxlist', {url: url, data: filter}, (item) => {
                //         let loglist = this.state.loglist;
                //         let checkedlist = this.state.checkedlist;
                //         let zblist = item.data;
                //         let zbstr = zblist.join(',');
                //         let loginfo = {
                //             title: qxwjm
                //         }
                //         //判断模型输入参数是否在曲线指标中
                //         //
                //         // let sm = new Set(model_paramslist)
                //         // let sz = new Set(zblist)
                //         // console.log(sm)
                //         // console.log(sz)
                //
                //         // console.log(ss)
                //         if (this.isIncludes(zblist, model_paramslist)) {
                //             loginfo['type'] = 'success';
                //             loginfo['content'] = '曲线指标与模型参数符合';
                //             //设置验证通过的曲线名称
                //             checkedlist.push(qxwjm)
                //             this.setState({checkedlist: checkedlist})
                //         } else {
                //             loginfo['type'] = 'error';
                //             loginfo['content'] = '曲线指标(' + zbstr + ')与模型参数(' + model_inparams + ')不匹配';
                //             let diffList = model_paramslist.filter(function (v) {
                //                 return zblist.indexOf(v)==-1
                //             });
                //             loginfo['diffstr']=diffList.join(",");
                //             console.log(loginfo)
                //         }
                //         loglist.push(loginfo)
                //         this.setState({loglist: loglist})
                //     });
                // })

            }
        } else if (this.state.currentStep == 3) {
            //更新任务状态
            let params = this.state.params;
            params['loglist'] = this.state.loglist;// 检测日志
            params['qxwjmlist'] = this.state.qxwjmlist;// 待检测曲线列表
            params['checkedlist'] = this.state.checkedlist;// 通过检测的曲线列表
            params['status'] = '1';//任务启动
            this.setState({params: params});
            this.saveTask();
            Notification.open({
                title: '操作提醒',
                content: '任务启动，系统自动计算相关数据，可能持续较长时间... ...',
                duration: 2000,
                type: "notice"
            });
        }
        let stepDisplay = this.state.stepDisplay;
        stepDisplay[this.state.currentStep] = 'none'
        stepDisplay[this.state.currentStep + 1] = 'block'


        if (this.state.checkedlist.length > 0 && stepDisplay[3] == 'block') {
            // console.log(this.state)
            this.TimeoutCallback(this.returnTaskResult, 5000)
            this.TimeoutCallback(this.getTaskDetail, 5000)
        }


        const s = this.state.currentStep + 1;
        this.setState({
            currentStep: s > 4 ? 4 : s,
            stepDisplay: stepDisplay
        });
        if (s == 1) {
            this.setState({
                nextdisable: true
            })
        }

    };

    prevdisable = () => {
        if (this.state.resultpage) {
            if (this.state.currentStep === 3) {
                return true
            }
            if (this.state.currentStep === 4) {
                return false
            }

        } else {
            if (this.state.params.status != "0") {
                return true
            }

        }
        return false
    }
    prev = () => {
        if (this.state.currentStep === 4) {
            this.setState({
                currentStep: 3
            })
        }
        if (this.state.params.status != "0" && !this.state.resultpage) {
            return
        }
        let stepDisplay = this.state.stepDisplay;
        stepDisplay[this.state.currentStep] = 'none'
        stepDisplay[this.state.currentStep - 1] = 'block'

        const s = this.state.currentStep - 1;

        this.setState({
            currentStep: s < 0 ? 0 : s,
            stepDisplay: stepDisplay
        });
    };

    componentDidMount() {

        let modellist = []
        //初始化页面配置-取油田配置
        this.props.updateBindingData('getYT', {url: '/' + config.urlSuffix + '/crud/oil_field_config/read'}, (item) => {
            let list = item.data.dataList;
            let list1 = [];
            list.map(data => {
                //if (data.yqtmc == '普光气田') {
                data['label'] = data.yqtmc;
                data['value'] = data.yqtbm;
                list1.push(data)
                //}

            })
            // console.log(list1)
            this.setState({
                ytList: list1
            })
        })


        //初始化页面配置-取模型配置
        this.props.updateBindingData('getModel', {
            url: '/' + config.urlSuffix + '/crud/model_config/read',
            data: {status: "1", pagesize: 100}
        }, (item) => {
            let list = item.data.dataList
            list.map(data => {
                data['label'] = data.model_name;
                data['value'] = data.id;
            })
            let _this = this;

            this.setState({
                modellist: list
            }, function () {
                _this.urlparms(list)
            })
        });

    }

    urlparms = (modellist) => {

        let param = this.props.location.search;
        let urlparams = getParams(param)
        let model_name = "";

        //判断新建任务或历史任务
        if (urlparams['id'] != '' && urlparams['id'] != undefined) {
            let filter = {
                _id: urlparams['id']
            };
            this.hisTask = true
            this.TimeoutCallback(this.returnTaskResult, 100) // xxx 历史记录 获取曲线文件 结果

            this.setState({
                isLoading: true
            });

            this.props.updateBindingData('getTask', {
                url: '/' + config.urlSuffix + '/api/findTask',
                data: filter
            }, (item) => {
                let stepDisplay = this.state.stepDisplay;
                // console.log(stepDisplay)
                if (item.data[0].hasOwnProperty("model_config")) {
                    if (item.data[0]["model_config"]["model_name"].indexOf("回归") != -1) {
                        this.setState({
                            modeltype: "none"
                        })
                    }
                }

                if (item.data[0]["status"] == "3") {
                    this.setState({
                        resultpage: true
                    })
                }
                stepDisplay[0] = 'none'
                stepDisplay[3] = 'block'
                // console.log(item);
                model_name = item.data[0]["model_config"]["model_name"];
                this.setState({
                    params: item.data[0],
                    currentStep: 3,
                    stepDisplay: stepDisplay,
                    model_name: item.data[0]["model_config"]["model_name"]
                });
                let templist = [];
                let modellistFilter = [];
                modellist.map(function (v, i) {
                    if (model_name == v.model_name && v.hasOwnProperty("id")) {
                        templist.push({label: v["tempName"], value: v["_id"]})
                        modellistFilter.push(v)
                    }
                });
                if (modellistFilter.length ==0 ){
                    Message.error("数据异常")
                    this.props.history.go(-1)
                    return
                }else{

                    if (!modellistFilter[0].hasOwnProperty("_id")){
                        Message.error("数据异常")
                        this.props.history.go(-1)
                        return
                    }

                }
                let defaultQX = {temp: modellistFilter[0]["_id"]};

                this.defaultQX = defaultQX
                this.setState({
                    tempList: templist,
                    defaultQX: defaultQX,
                    isLoading: false
                })
            })

        }
    };

    getTaskDetail = () => {
        let param = this.props.location.search;
        let urlparams = getParams(param)
        let filter = {
            "_id": this.state.params._id == undefined ? urlparams["id"] : this.state.params._id,
        };

        this.props.updateBindingData('getTask', {
            url: '/' + config.urlSuffix + '/api/findTask',
            data: filter
        }, (item) => {
            // let stepDisplay = this.state.stepDisplay;
            // console.log(stepDisplay)
            if (item.data[0].hasOwnProperty("model_config")) {
                if (item.data[0]["model_config"]["model_name"].indexOf("回归") != -1) {
                    this.setState({
                        modeltype: "none"
                    })
                }
            }

            if (item.data[0]["status"] == "3") {
                this.setState({
                    resultpage: true
                })
            }

            let model_name = item.data[0]["model_config"]["model_name"];
            this.setState({
                params: item.data[0],
                currentStep: 3,
                // stepDisplay: stepDisplay,
                model_name: item.data[0]["model_config"]["model_name"]
            });
            let templist = [];
            let modellistFilter = [];
            this.state.modellist.map(function (v, i) {
                if (model_name == v.model_name) {
                    templist.push({label: v["tempName"], value: v["_id"]})
                    modellistFilter.push(v)
                }
            });
            let defaultQX = {temp: modellistFilter[0]["_id"]};


            this.defaultQX = defaultQX
            this.setState({
                tempList: templist,
                defaultQX: defaultQX,

            })
        })

    };


    //查询油气田名称
    getOilField = (id) => {
        let label = ""
        this.state.ytList.map((item) => {
            if (item.yqtbm == id) {
                label = item.yqtmc;
            }
        })
        return label
    };
    //查询模型名称
    getModelConfig = (id) => {
        let label = ""
        this.state.modellist.map((item) => {
            if (item.id == id) {
                label = item.model_name;
            }
        })
        return label
    };

    //选择模型
    handleExpChange = (value, actionType, item) => {
        // console.log(value)
        // console.log(item)
        let params = this.state.params;
        // console.log(this.state.params)
        params['expvalue'] = value;
        // params['model_config'] = item;
        this.setState({
            params: params,
        });
    }

    //选择模型
    handleModelChange(value, actionType, item) {
        let params = this.state.params;
        params['model_id'] = value;
        params['model_config'] = item;
        this.setState({
            params: params,
            model_config: item
        });
    }

    //选择油田
    handleYTChange(value, actionType, item) {
        let params = this.state.params;
        params['yqtbm'] = value;
        params['yqt'] = item;
        this.setState({params: params});
        //查询油田下井号
        let url = '/' + config.urlSuffix + '/api/getJH';
        this.props.updateBindingData('getJH', {url: url}, (item) => {
            this.setState({
                wellnolist: item.data,
            });
        });
    }


    handleJHChange(value) {
        this.setState({
            wellflist:[]
        })
        let params = this.state.params;
        params['wellname'] = value;
        this.setState({params: params});
        let url = '/' + config.urlSuffix + '/api/getwellflist';
        console.log(value)
        this.props.updateBindingData('getwellflist', {url: url, data: {JH: value}}, (item) => {
            item.data.map(data => {
                this.checkJHQxwjm(data)
            });
        });
    }

    checkJHQxwjm=(qxwjm)=>{
        let filter = {};
        filter['QXWJM'] = qxwjm;
        let model_inparams = this.state.model_config.inparamslist
        let model_paramslist = model_inparams.split(',');
        let url = '/' + config.urlSuffix + '/api/getidxlist';
        let _this=this
        this.props.updateBindingData('getidxlist', {url: url, data: filter}, (item) => {
            let zblist = item.data;
            if (this.isIncludes(zblist, model_paramslist)){
                let t=this.state.wellflist
                t.push({label:qxwjm,value:qxwjm})
                this.setState({
                    wellflist:t
                })
            }

        });
    }

    //判断一个数组是不是包含另一个数组
    isIncludes(parentArr, childrenArr) {
        let tempArrLength = Array.from(new Set([...parentArr, ...childrenArr])).length
        return tempArrLength === parentArr.length || tempArrLength === childrenArr.length
    }

    getStatusLabel(value) {
        if (value == undefined) return
        let index = Number(value)
        let item = statusArray[index]
        return item.label
    }

    getStatusType(value) {
        if (value == undefined) return
        let index = Number(value)
        let item = statusArray[index]
        return item.type
    }

    //拖动曲线名
    handleChange = (value, data, extra) => {
        console.log(value);
        if (value.length > 1 || value.length == 0) {
            this.setState({
                nextdisable: true
            })
            Message.error("请选择一个曲线文件名")
        }

        if (value.length == 1) {
            this.setState({
                nextdisable: false
            })
        }

        this.setState({qxwjmlist: value})
    };

    handleChangeSingle = (value, actionType, item) => {
        let _this = this

        this.setState({
            QXWJMValue: value,
        });
        let filter = {
            QXWJM: value,
            taskID: this.state.params._id,
            JH: this.state.params.wellname,
        };

        this.props.updateBindingData('findByTaskDepth', {
            url: '/' + config.urlSuffix + '/api/findByTaskDepth',
            data: filter
        }, (item) => {
            // let dq = this.state.defaultQX;
            this.chartData = {dataList: []}
            let _this = this
            if (item.status == 200) {
                this.initmin = item.data.min;
                this.initmax = item.data.max;
                this.nummins = parseInt(item.data.min);
                this.nummaxs = parseInt(item.data.max);

                this.setState({
                    // defaultQX: dq,
                    nummin: parseInt(item.data.min),
                    nummax: parseInt(item.data.max),
                    // chartmin:parseInt(item.data.min),
                    // chartmax:parseInt(item.data.max),
                    temp: this.state.tempList[0].value,
                    // min:dq["min"],
                    // max:dq["max"],
                })

            }
        })

    };

    handleChangeModle = (value, actionType, item) => {
        // console.log(value)
        // console.log(this.state.temp)
        // console.log(value)
        this.chartData = {dataList: []}
        this.setState({
            ModelId: value,
            temp: value,
        })
    }

    handleQXChange() {
        // let modeID        = this.state.params.model_config._id
        if (this.state.QXWJMValue == "") {
            Message.success("文件名为空")
            return
        }
        let modeID = this.state.ModelId == undefined ? this.state.temp : this.state.ModelId;
        let model_inparams = this.state.params.model_config.inparamslist
        let model_outparams = this.state.params.model_config.outparamslist
        let strModelParams = "DEPTH," + model_inparams + "," + model_outparams;
        let tabelcolumns = strModelParams.split(',');

        tabelcolumns.push("modify");
        tabelcolumns.push("operating");
        this.setState({
            tabelcolumns: tabelcolumns,
            visibleChart: true
        })

        let model_inparamslist = model_inparams.split(',');
        model_inparamslist.push("DEPTH");
        let filter = {
            taskID: this.state.params._id,
            zbmcList: model_inparamslist,
            JH: this.state.params.wellname,
            QXWJM: this.state.QXWJMValue,
            modeID: modeID
        };
        // console.log(filter)
        this.props.updateBindingData('findQxByTask', {
            url: '/' + config.urlSuffix + '/api/findQxByTask',
            data: filter
        }, (item) => {
            // console.log(item)
            this.chartData = item.data
            this.setState({
                chartData: item.data,
                visibleChart: false
            });
            this.sectionPagination(1);
            this.detailPagination(1);
        })
    }

    renderDict = value => {
        let result = value;
        let index = Number(value);
        if (index >= 0 && index <= 13) {
            result = preDictArray[index];
        }
        return result;
    };

    renderIndex(value, index, record) {
        let Pagination = this.state.section.Pagination
        return (Pagination.current - 1) * Pagination.pageSize + index + 1;
    }

    getTableData(dataList, current, pageSize) {
        let start = (current - 1) * pageSize
        let end = current * pageSize
        return dataList.slice(start, end);
    }

    sectionPagination(current) {
        let item = this.state.section
        item.Pagination.current = current;
        item.Pagination.total = this.state.chartData.sectionData.length;
        item.dataSource = this.getTableData(this.state.chartData.sectionData, current, item.Pagination.pageSize);
        this.setState({
            section: item
        })
    }

    detailPagination(current) {
        let _this = this;
        let item = this.state.detail
        item.Pagination.current = current;
        item.Pagination.total = this.state.chartData.dataList.length;
        item.dataSource = []
        this.setState({
            detail: item
        }, function () {
            item.dataSource = this.getTableData(this.state.chartData.dataList, current, item.Pagination.pageSize);
            console.log(item.dataSource)
            _this.setState({
                detail: item
            });
        });

    }

    handlePaginationChangeSize = (pagesize) => {
        console.log(pagesize)
        let item = this.state.detail
        item.Pagination.current = 1;
        item.Pagination.total = this.state.chartData.dataList.length;
        item.Pagination.pageSize = pagesize;
        item.dataSource = this.getTableData(this.state.chartData.dataList, 1, pagesize);
        this.setState({
            detail: item
        })
    };
    numchangemax = (value, e) => {
        // console.log(value,e);
        //
        // let dp = this.state.defaultQX
        // dp.max = value
        // this.setState({
        //     defaultQX: dp
        // })
        //
        // if (value > this.nummins && (value > this.initmin + 100 && value < this.initmax + 200)) {

        this.nummaxs = value;
        this.chartData = {dataList: []}
        this.setState({
            nummax: value,
        })
        // }


    };
    numchangemin = (value, e) => {
        // console.log(value,e)

        // let dp = this.state.defaultQX
        // dp.min = value
        // this.setState({
        //     defaultQX: dp
        // });
        //
        // let _this = this
        // if ((this.nummins < this.nummaxs) && value > (this.initmin - 100)) {
        this.nummins = value;
        this.chartData = {dataList: []}
        this.setState({
            nummin: value,
        })
        // }

    };


    actionNumChange = () => {

        let _this = this;

        if (this.state.nummax <= 0 && this.state.nummin <= 0) {
            Message.success("深度范围错误");
        } else {
            // let dp = this.state.defaultQX
            // dp.min = this.state.nummin;
            // dp.max = this.state.nummax
            this.setState({
                // defaultQX: dp,
                chartmin: this.nummins,
                chartmax: this.nummaxs
            }, function () {
                // console.log(_this.state)
            })
            if (this.state.nummin < this.state.nummax) {
                _this.handleQXChange()
            } else {
                Message.success("深度范围错误");
            }

        }

    };


    TimeoutCallback(func, timeout) {
        let _this = this;
        this.setState({
            checklistload: true
        })
        setTimeout(func, timeout)
    };

    returnTaskResult = () => {
        let param = this.props.location.search;
        let urlparams = getParams(param)

        let filter = {
            task_id: this.state.params._id == undefined ? urlparams["id"] : this.state.params._id,
            result: false,
            update: false,
            check: this.hisTask,
            // jh: this.state.params.wellname,
            // qxwjm: item,
            // header: this.state.model_config.inparamslist,
            // model: this.state.model_config.model_desc
        };
        // console.log(filter)

        // let r = "失败";
        // let t = "warning";
        // let str = "";
        let mss;
        this.props.updateBindingData('getTaskResult', {url: '/' + config.urlSuffix + '/task', data: filter}, (res1) => {
            if (res1.status == 200 && res1.data.result.length > 0) {
                mss = res1.data.result.map(function (v, index) {
                    let t = v.status == 200 ? "success" : "warning";
                    let str = v.QXWJM + "," + v.message
                    return (
                        <Message title={t} type={t} style={{marginBottom: '10px'}} key={index} closeable>
                            {str}
                        </Message>
                    );
                });
                let p = this.state.params
                p["status"] = 3
                this.setState({
                    taskResult: true,
                    params: p
                })
            } else {
                mss = this.state.checkedlist.map(function (v, index) {
                    let str = v + "失败"
                    return (
                        <Message title={"warning"} type={"warning"} style={{marginBottom: '10px'}} key={index}
                                 closeable>
                            {str}
                        </Message>
                    );
                })
            }
            this.setState({
                mss: mss,
                checklistload: false
            })
        })


    };

    inputchange=(rowvalue,value)=>{
        // console.log(rowvalue)
        // console.log(value)
        if (value.length <= 2){
            return
        }
        if (value==undefined || isNaN(parseFloat(value)) || !IsNumber(value)) { //没有改变数值
            Message.error("数值不能初始化")
            return
        }
        this.datalistModify[rowvalue["_id"]]=parseFloat(value)
        console.log(this.datalistModify)
        // this.modify=value;
        //
    };

    tableinput=(value1,index,record)=>{
        return (
            <Input  defaultValue={record["modify"]} onChange={this.inputchange.bind(this,record)} />
        )

    };


    inputsave=(record)=>{
        // console.log(record);
        // console.log(this.modify);
        // console.log(!IsNumber(this.modify))

        this.setState({
            tableDetailLoading:true
        })
        // console.log(this.state);
        // record=Object.assign(record,{modify:parseFloat(this.modify)});
        let filter={
            taskID:this.state.params._id,
            data:this.datalistModify,
            JH: this.state.params.wellname,
            QXWJM: this.state.QXWJMValue,
        };
        console.log(filter);
        let _this=this;
        this.props.updateBindingData('tablesave', {url: '/' + config.urlSuffix + '/api/saveTable', data: filter}, (item) => {
            if (item.status==200){
                this.setState({
                    tableDetailLoading:false
                },function () {
                    Message.success("保存成功")

                })

            }else{
                Message.success("保存失败")
                _this.setState({
                    tableDetailLoading:false
                })
            }
            this.datalistModify=[]

        });

    };

    tablebtn=(value,index,record)=>{
        return (
            <Button onClick={this.inputsave} >保存</Button>
        )
    };

    FormSubmit = (values) => {
        // console.log(this.state.model_paramslist)
        // console.log(values)
        let falile = false
        this.state.model_paramslist.map(function (v, i) {
            if (!values.hasOwnProperty(v)) {
                Message.error("请填写映射名称:" + v);
                falile = true;
            }
        });
        if (falile == false) {
            //提交完整 进入下个阶段
            this.setState({
                activeKey: 2
            })
        }

    };


    tab2FormSubmit = (values) => {
        // console.log(this.state.model_paramslist)
        console.log(values);
        let _this=this
        if (!values.hasOwnProperty("minthickness") ){
            Message.error("请填写最小厚度")
            return
        }

        if (values.hasOwnProperty("minthickness")){
            if (values["minthickness"]==""){
                Message.error("请填写最小厚度")
                return
            }else{
                this.minthickness=values["minthickness"]
                delete values["minthickness"]
            }
        }
        if (Object.keys(values).length <1){
            Message.error("至少填写一项分层门槛")
        }else{
            console.log(values);
            let tmpfc={}
            Object.keys(values).map(function (v,i) {
                if (v.includes("小于等于")){
                   let vv=v.replace("小于等于","")
                    tmpfc[vv]=values[v]
                }
                if (v.includes("大于等于")){
                    let vv=v.replace("大于等于","")
                    tmpfc[vv]=values[v]
                }
            });
            console.log(tmpfc)
            this.setState({
                fcsill:values,
                tab3visible:false,
                fclistchecked:tmpfc
            },function () {
                console.log(_this.state.fclistchecked)
                _this.setState({
                    activeKey:3
                })
            })
        }

    };

    tab3FormSubmit = (values) => {
        console.log(this.state.fclistchecked)
        console.log(values)

        let falile = false

       Object.keys(this.state.fclistchecked).map(function (v, i) {
            if (!values.hasOwnProperty(v)) {
                Message.error("请填写映射名称:" + v);
                falile = true;
            }else{
                if (values[v]==""){
                    Message.error("请填写映射名称:" + v);
                    falile = true;
                }
            }


        });

        if (falile == false) {
            //提交完整 进入下个阶段
            this.setState({
                nextdisable: false
            })
        }

    };
    render() {
        const {currentStep, ytList, wellnolist, wellflist, modellist, loglist, percent, task_qxwjm} = this.state;
        console.log(currentStep)
        console.log(this.state.stepDisplay)
        return (
            <IceContainer title="测井解释任务步骤" className="adaptationContainer">
                <Step shape="arrow" current={currentStep}>
                    <StepItem title="步骤1:选择井与模型"/>
                    <StepItem title="步骤2:设置"/>
                    <StepItem title="步骤3:任务信息"/>
                    <StepItem title="步骤4:测井解释"/>
                    <StepItem title="步骤5:解释成果"/>
                </Step>
                <div style={{display: this.state.stepDisplay[2]}}>
                    <IceContainer>
                        <Row style={{marginBottom: '20px'}}>
                            <Col xxs="5" s="5" l="2">
                                任务名称
                            </Col>
                            <Col s="14" l="14">
                                <Input state={this.state.params.tasktitle == "" ? "error" : "success"}
                                       disabled={this.state.params.status == "0" ? false : true}
                                       name="tasktitle"
                                       style={{width: '100%'}}
                                       maxLength={50}
                                       hasLimitHint
                                       value={this.state.params.tasktitle}
                                       onChange={this.titleChange}
                                       placeholder="请输入标题"
                                />
                            </Col>
                        </Row>

                        <Row style={{marginBottom: '20px'}}>
                            <Col xxs="5" s="5" l="2">
                                任务描述
                            </Col>
                            <Col s="14" l="14">
                                <Input.TextArea state={this.state.params.taskdec == "" ? "error" : "success"}
                                                disabled={this.state.params.status == "0" ? false : true}
                                                name="taskdec"
                                                style={{width: '100%'}}
                                                maxLength={500}
                                                hasLimitHint
                                                value={this.state.params.taskdec}
                                                onChange={this.messageChange}
                                                rows={6}
                                                placeholder="请输入内容"/>
                            </Col>
                        </Row>

                    </IceContainer>
                </div>

                <div style={{display: this.state.stepDisplay[0]}}>
                    <Tab shape="wrapped" tabPosition="left">
                        <Tab.Item title="数据库调用" key="1">
                            <IceContainer>
                                <IceContainer style={{display: 'flex', justifyContent: 'flex-start'}}>
                                    <Select state={this.state.params.expvalue == "" ? "error" : "success"}
                                            disabled={this.state.params.status == "0" ? false : true}
                                            value={this.state.params.expvalue}
                                            placeholder="请选择解释目标" label="解释目标" dataSource={this.state.explist}
                                            onChange={this.handleExpChange} size='large' style={{width: 400}}/>
                                    <Select state={this.state.params.model_id == "" ? "error" : "success"}
                                            disabled={this.state.params.status == "0" ? false : true}
                                            value={this.state.params.model_id}
                                            placeholder="请选择模型" label="模型" dataSource={modellist}
                                            onChange={this.handleModelChange} size='large' style={{width: 400}}/>
                                    <Select state={this.state.params.yqtbm == "" ? "error" : "success"}
                                            disabled={this.state.params.status == "0" ? false : true}
                                            value={this.state.params.yqtbm}
                                            placeholder="请选择油田名称" label="油气田" dataSource={ytList}
                                            onChange={this.handleYTChange} size='large' style={{width: 200}}/>
                                    <Select state={this.state.params.wellname == "" ? "error" : "success"}
                                            disabled={this.state.params.status == "0" ? false : true}
                                            value={this.state.params.wellname}
                                            placeholder="请选择井号" label="井号" dataSource={wellnolist}
                                            onChange={this.handleJHChange} size='large' style={{width: 300}}/>
                                </IceContainer>
                                <Transfer className="adaptationTransferContainer"
                                          disabled={this.state.params.status == "0" ? false : true}
                                          listStyle={{width: '420px', height: '192px'}}
                                          dataSource={wellflist}
                                          titles={['待选测井曲线文件名', '已选测井曲线文件名']}
                                          onChange={this.handleChange}
                                />
                            </IceContainer>
                        </Tab.Item>
                    </Tab>
                </div>
                <div style={{display: this.state.stepDisplay[1]}}>
                    <Tab shape="wrapped" tabPosition="top" activeKey={this.state.activeKey}>
                        <Tab.Item title="曲线名映射" key="1">
                            <IceContainer>
                                <Form {...formItemLayout}>
                                    <FormItem label={"模型中的曲线"}>
                                        <p>文件中的曲线</p>
                                    </FormItem>

                                    {this.state.model_paramslist.map(function (v, i) {
                                        return (<FormItem label={v}>
                                            <Input name={v} placeholder={v}/>
                                        </FormItem>)
                                    })}
                                    <Form.Submit onClick={this.FormSubmit}>提交字典</Form.Submit>
                                </Form>
                            </IceContainer>
                        </Tab.Item>
                        <Tab.Item title="输入分层门槛" key="2">
                            <IceContainer>
                                <Form {...formItemLayout}>
                            {/*<CheckboxGroup value={this.state.fclistchecked} dataSource={fclist}/>*/}
                                    {fclist.map(function (vv,i) {
                                        return (<FormItem label={vv.label}>
                                            <Input name={vv.label} placeholder={vv.value}/>
                                        </FormItem>)
                                    })}
                                    <FormItem label={"最小厚度"}>
                                        <Input name={"minthickness"} placeholder={"最小厚度"}/>
                                    </FormItem>

                                    <Form.Submit onClick={this.tab2FormSubmit}>提交确定</Form.Submit>
                                </Form>
                            </IceContainer>
                        </Tab.Item>
                        <Tab.Item title="门槛值曲线映射" key="3">
                                <IceContainer>
                                    <Loading visible={this.state.tab3visible}>
                                        <Form {...formItemLayout}>
                                            <FormItem label={"门槛值曲线"}>
                                                <p>文件中的曲线</p>
                                            </FormItem>

                                            {Object.keys(this.state.fclistchecked).map(function (v, i) {
                                                return (<FormItem label={v}>
                                                    <Input name={v} placeholder={v}/>
                                                        <Divider/>
                                                </FormItem>
                                                )
                                            })}
                                            <Form.Submit onClick={this.tab3FormSubmit}>提交</Form.Submit>
                                        </Form>
                                    </Loading>
                                </IceContainer>
                        </Tab.Item>
                    </Tab>

                </div>

                <div style={{display: this.state.stepDisplay[3]}}>
                    <IcePanel style={{height: '400px', 'overflow-x': 'auto'}}>
                        <IcePanel.Header>
                            <H4>
                                任务名称:{this.state.params.tasktitle}
                                <IceLabel status="primary">{this.getOilField(this.state.params.yqtbm)} </IceLabel>
                                <IceLabel status="success">{this.state.params.wellname}</IceLabel>
                                <IceLabel
                                    status={this.getStatusType(this.state.params.status)}>{this.getStatusLabel(this.state.params.status)}</IceLabel>
                            </H4>
                        </IcePanel.Header>
                        <IcePanel.Body>
                            <IceLabel status="success">{this.state.params.model_config.model_name}</IceLabel>
                            任务简述：{this.state.params.taskdec}
                        </IcePanel.Body>
                        <IcePanel.Header>
                            合规性检查
                        </IcePanel.Header>
                        <Loading visible={this.state.checklistload} fullScreen={true} tip="正在加载曲线任务结果... ... "/>
                        <IcePanel.Body>
                            {this.state.mss}

                        </IcePanel.Body>

                    </IcePanel>
                </div>


                <div style={{display: this.state.stepDisplay[4]}} className="IcePanelContainer-4">
                    <IcePanel>
                        <IcePanel.Header>
                            <H4>
                                任务名称:{this.state.params.tasktitle}
                                <IceLabel status="primary">{this.getOilField(this.state.params.yqtbm)} </IceLabel>
                                <IceLabel status="success">{this.state.params.wellname}</IceLabel>
                                <IceLabel
                                    status={this.getStatusType(this.state.params.status)}>{this.getStatusLabel(this.state.params.status)}</IceLabel>
                            </H4>
                        </IcePanel.Header>
                        <IcePanel.Body>
                            <IceLabel status="success">{this.state.params.model_config.model_name}</IceLabel>
                            任务简述：{this.state.params.taskdec}
                        </IcePanel.Body>
                        <IcePanel.Header>
                            曲线解释成果
                        </IcePanel.Header>
                        <IcePanel.Body>

                            <IceContainer>
                                {/*<IceContainer  style={{display: 'flex',justifyContent: 'flex-start'}}>*/}
                                <IceContainer>
                                    <Filter
                                        params={this.state.params}
                                        // defaultQX={this.state.defaultQX}
                                        min={this.state.nummin}
                                        max={this.state.nummax}
                                        handleChangeSingle={this.handleChangeSingle}
                                        handleChangeModle={this.handleChangeModle}
                                        tempList={this.state.tempList}
                                        numchangemin={this.numchangemin}
                                        numchangemax={this.numchangemax}
                                        actionNumChange={this.actionNumChange}
                                        isLoading={this.state.isLoading}
                                        initmax={this.initmax}
                                        initmin={this.initmin}
                                        temp={this.state.temp}
                                    />

                                </IceContainer>
                                <IceContainer>
                                    <Tab shape="wrapped" tabPosition="top">
                                        <Tab.Item title="测井解释成果图" key="1">
                                            <Loading visible={this.state.visibleChart}
                                                     fullScreen={this.state.visibleChart} tip="正在加载曲线... ... "/>
                                            <div style={{height: '2000px', overflowY: 'auto'}}>
                                                <V5 data={this.chartData}
                                                    nummin={this.nummins}
                                                    nummax={this.nummaxs}
                                                    initmim={this.initmin}
                                                    initmax={this.initmax}
                                                /></div>
                                        </Tab.Item>
                                        <Tab.Item title="测井解释成果表" key="3" style={{
                                            display: this.state.modeltype
                                        }}>
                                            <Table fixedHeader maxBodyHeight={600}
                                                   dataSource={this.state.section.dataSource}>
                                                <Table.Column width={200} title="井号" dataIndex="JH"/>
                                                <Table.Column width={300} title="曲线文件名" dataIndex="QXWJM"/>
                                                <Table.Column width={60} title="层号" dataIndex="QXWJM"
                                                              cell={this.renderIndex}/>
                                                <Table.Column width={150} title="深度区间(米)" dataIndex="sectionDepth"/>
                                                <Table.Column width={100} title="厚度(米)" dataIndex="plyDepth"/>
                                                {/*<Table.Column title="油气水解释结论" dataIndex="predict"*/}
                                                              {/*cell={this.renderDict}/>*/}
                                            </Table>
                                            <Pagination
                                                current={this.state.section.Pagination.current}
                                                pageSize={this.state.section.Pagination.pageSize}
                                                total={this.state.section.Pagination.total}
                                                onChange={this.sectionPagination}
                                            />
                                        </Tab.Item>
                                        <Tab.Item title="曲线明细数据" key="4">
                                            <Loading
                                                fullScreen
                                                visible={this.state.tableDetailLoading}
                                            />
                                            <Table fixedHeader maxBodyHeight={600}
                                                   dataSource={this.state.detail.dataSource}>
                                                {
                                                    this.state.tabelcolumns.map((item, index) => {
                                                        if (item == "modify") {
                                                            return (
                                                                <Table.Column key={index} title={item}
                                                                              cell={this.tableinput}/>
                                                            );
                                                        } else if (item == "operating") {
                                                            return (
                                                                <Table.Column key={index}
                                                                              cell={this.tablebtn}
                                                                              title={item} dataIndex={item}/>
                                                            );
                                                        } else {
                                                            return (
                                                                <Table.Column key={index} title={item}
                                                                              dataIndex={item}/>
                                                            );
                                                        }

                                                    })
                                                }
                                            </Table>
                                            <Pagination
                                                current={this.state.detail.Pagination.current}
                                                pageSize={this.state.detail.Pagination.pageSize}
                                                total={this.state.detail.Pagination.total}
                                                onChange={this.detailPagination}
                                                pageSizeSelector={"filter"}
                                                pageSizeList={PageSizeList()}
                                                onPageSizeChange={this.handlePaginationChangeSize}

                                            />
                                        </Tab.Item>
                                    </Tab>
                                </IceContainer>
                            </IceContainer>

                        </IcePanel.Body>
                    </IcePanel>
                </div>

                <div className={styles.buttonGroup}>
                    <ButtonGroup>
                        <Button
                            onClick={this.prev}
                            type="primary"
                            disabled={this.prevdisable()}
                        >
                            上一步
                        </Button>
                        <Button onClick={this.next}

                                type="primary"
                                disabled={currentStep === 4 || this.state.nextdisable}>下一步
                        </Button>
                    </ButtonGroup>
                </div>
            </IceContainer>
        );

    }
}


