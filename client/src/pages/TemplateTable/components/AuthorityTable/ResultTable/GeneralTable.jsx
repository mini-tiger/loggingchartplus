import React, {Component} from 'react';
import {Grid,Loading} from '@alifd/next';
import IceContainer from '@icedesign/container';
import ContainerTitle from './components/ContainerTitle';
import ContractTable from './components/ContractTable';
import SearchFilter from './components/SearchFilter';
import SearchHistory from './components/SearchHistory';
import DataBinder from '@icedesign/data-binder';
import {Message,Select,Step,Button,Checkbox} from '@alifd/next';
// import {getPermissionItem, getUserInfor} from '../../../utils/authority';
// import {getNavPermission} from '../../../utils/getPermission';
import config from '../../../../../../config'
const {Row, Col} = Grid;
import axios from 'axios';
import CustomForm from "./components/CustomForm";
import UploadRestltDialog from "./components/UploadResultDialog"

import commonstyles from './GeneralTable.scss'
import Cookie from "../../../../../utils/cookies";
import {Collapse} from '@alifd/next';
import styles from "../../../../Steptask2/index.module.scss";
const {Item: StepItem} = Step;
const Panel = Collapse.Panel;
const {Group: ButtonGroup} = Button;
import {jTableWidth, PageSizeList,QuxianDict} from "../../../../../utils/vars";
import ResultTable from "../index";
const cookies_expires = 10 * 365;
const crudAPI = 'crud_user';
@DataBinder({
    configData: {
        method: 'post',
    },
    read: {
        method: 'post',
    },
    update: {
        method: 'post',
    },
    delete: {
        method: 'post',
    },
    getGroupByCol: {
        method: 'post'
    }
})
export default class GeneralTable extends Component {
    static displayName = 'GeneralTable';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        // let userinfo = JSON.parse(getUserInfor());
        this.crudAPI="task";
        this.selectData=[]
        this.state = {
            userinfo: {},
            crudAPI: '',
            config: {},
            base: {table_name: 'CRUD Template'},
            fields: [],
            Alldatasource: [],
            datasource:[],
            dictConfig: [],
            isLoading: false,
            isShow: false,
            value: {},
            record: {},
            dataSuccess: false,
            pathname: '',
            change_cols: [],
            cookies_obj: {},
            show_fields: [],
            filter_fields: [],
            cookie_col: [],
            cookie_col_all: [],
            selectAllRecords: [],
            selectedRowKeys: [],
            pagesize: 10,
            page: 1,
            current: 1,
            orderValues: [],
            SelectRows:{},
            currentStep:0,
            stepDisplay :['block','none'],
            selectAllData:[],
            selectData:[],
            selectvisiable:true,
            AlldatasourceKey:{}


        };
        this.disableInput=["wellname","model_id","_id","tasktitle","oil_field"]
        this.fetchData = this.fetchData.bind(this);
        this.fetchDataPage = this.fetchDataPage.bind(this);
        this.setRecord = this.setRecord.bind(this);
        this.submitData = this.submitData.bind(this);
        this.getDictLabel = this.getDictLabel.bind(this);
        this.getDictMultipleByArray = this.getDictMultipleByArray.bind(this);
        this.getDictMultipleByStr = this.getDictMultipleByStr.bind(this);
        // this.getPermission=this.getPermission.bind(this);
    }

    componentDidMount() {
        //初始化页面配置
        let pathname = this.crudAPI

        console.log(this.props.currentModel)
        if (this.props.currentModelId==""){
            Message.show("没有选择模板")
            return
        }
        this.updateData(pathname);
        // this.getGroupByCol()
    }

    componentWillReceiveProps() {
        let pathname = this.crudAPI
        if (!!this.state.pathname && this.state.pathname != pathname) {
            this.setState({
                value: {}
            });
            this.updateData(pathname);
        }
    }


    // 页面权限跳转
    getPermission = (pathname) => {
        let buttonDisable = true;
        let selectButtonDisable = true;
        let methodList = pathname.split("/");
        let crudAPI = methodList[3];
        let permission = JSON.parse(getPermissionItem());
        let res = getNavPermission(crudAPI, "perm", permission);
        if (!res) {
            this.props.history.push("/message/result/fail");
        } else {
            let res1 = getNavPermission(crudAPI, "crud", permission);
            if (res1) {
                buttonDisable = false;
                selectButtonDisable = false;
            } else {
                let res2 = getNavPermission(crudAPI, "select", permission);
                if (res2) {
                    selectButtonDisable = false;
                }
            }
        }
        return {buttonDisable, selectButtonDisable}
    };

    updateData(pathname) {
        let methodList = pathname.split("/");
        console.log('methodList', methodList);
        let crudAPI = this.crudAPI;
        this.setState({
            crudAPI: crudAPI,
            pathname: pathname
        });
        //初始化页面配置
        let url = '/' + config.urlSuffix + '/crud/' + crudAPI + '/config';
        let _this = this;

        let operation = {
            display: 1, // 增加操作表头
            field_id: "show_model_field",
            field_name: "选择显示列",
            field_type: "VARCHAR2",
            input_type: "Select",
            required_display: 1,
            required_filter: 0,
            required_input: 1,
            relation_data:"show_model_field"
            // table_id: "HF_BACKUPDETAIL",
        };
        let operation1 = {
            display: 1, // 增加操作表头
            field_id: "QuxianDict",
            field_name: "映射的曲线",
            field_type: "VARCHAR2",
            input_type: "Select",
            required_display: 1,
            required_filter: 0,
            required_input: 1,
            relation_data:"QuxianDict"
            // table_id: "HF_BACKUPDETAIL",
        };
        this.props.updateBindingData('configData', {url: url}, (item) => {
            // 获取不到curd模版，直接返回
            if (item.status === undefined || item.status !== 200) {
                _this.setState({
                    cookies_obj: {},
                    cookie_col_all: [],
                    cookie_col: [],
                    show_fields: [],
                    filter_fields: [],
                });
                return
            }
            let fields=item.data.tableinfor.fields;
            // console.log(operation)
            fields.push(operation)
            fields.push(operation1)
            let dictConfig=item.data.tableinfor.dictConfig
            dictConfig["QuxianDict"]=QuxianDict();
            dictConfig["show_model_field"]=[];

            this.setState({
                base: item.data.tableinfor.base,
                fields: fields,
                dictConfig: item.data.tableinfor.dictConfig,
                isLoading: false,
            }, function () {
                // let dataSuccess = false
                let change_cols = [];
                let cookies_obj = {};
                let show_fields = [];
                let filter_fields = [];
                let cookie_col_all = [];

                _this.state.fields.map(col => {
                    if (col.required_display == '1') {
                        show_fields.push(col);
                        if (col.display == '1') {
                            cookie_col_all.push(col.field_id)
                        }
                    }
                    if (col.required_filter == '1') {
                        filter_fields.push(col);
                    }
                });

                cookies_obj.col_key = crudAPI + "_col_select";
                cookies_obj.col_cookie = new Cookie(cookies_obj.col_key);
                // this.col_key = col_key,
                //   this.col_cookie = col_cookie,
                let cookie_col = JSON.parse(cookies_obj.col_cookie.getCookie()) || cookie_col_all;
                _this.setState({
                    cookies_obj: cookies_obj,
                    // change_cols: change_cols,
                    cookie_col_all: cookie_col_all,
                    cookie_col: cookie_col,
                    show_fields: show_fields,
                    filter_fields: filter_fields

                }, function () {
                    _this.setState({
                        dataSuccess: true
                    })
                })
            });
        });
        this.fetchData();
    }

    fetchData = (p, update) => {
        console.log(p);
        let params = Object.assign({}, p);

        if (!update) {
            // 过滤查询条件
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    const element = params[key];
                    if (element === "" || !element) {
                        delete params[key]
                    } else {
                        // moment类型数据
                        if (typeof (element.format) == 'function') {
                            // params[key] = element.format("YYYY-MM-DD HH:mm:ss");
                            params[key] = element.valueOf();

                        } else if (element instanceof Array) {
                            let v = '', time = [];
                            element.map((n, i) => {
                                if (typeof (n.format) == 'function') {
                                    // time.push(n.format("YYYY-MM-DD HH:mm:ss"));

                                    time.push(n.valueOf());
                                }
                            });

                            // 时间区间类型
                            if (time.length === 2) {
                                params[key] = {
                                    key: 'between',
                                    value: {
                                        st: time[0],
                                        et: time[1]
                                    }
                                }
                            }
                            if (time.length === 0) {
                                delete params[key]
                            }


                        } else if (key === 'page') {
                            params = params
                            this.setState({
                                current: params['page']
                            })
                        } else if (key === 'pagesize') {
                            params = params
                        } else if (key === 'IP') {
                            params = params
                        } else if (key === 'BIANMA') {
                            params = params
                        } else {
                            params[key] = {
                                key: 'like',
                                value: element
                            }
                        }
                    }
                }
            }
        } else {
            params = p;
        }
        let pathname = window.location.hash.substring(1);
        let methodList = pathname.split("/");
        let crudAPI = this.crudAPI;
        this.setState({
            crudAPI: crudAPI,
            datasource: [],
            isLoading: true,
            selectedRowKeys: []
        });
        params["page"]=1
        params["pagesize"]=10
        //初始化页面配置
        let url = '/' + config.urlSuffix + '/crud/' + crudAPI + '/read';
        this.props.updateBindingData('read', {url: url, data: params}, (item) => {
            if (item.status==200){
                // let datasource={}
                let dd=[];
                let dkey={}
                let selectAllData=[]
                item.data.dataList.map(function (v,i) {
                    let tmp=v
                    tmp["model_id"]=v["model_config"]["model_name"];
                    // let data=[]
                    // v["model_config"]["tempList"].map(function (vv,i) {
                    //     data.push({label:vv["zbmc"],value:vv["_id"]})
                    // });

                    // tmp["show_model_field"]=data
                    // tmp["QuxianDict"]=QuxianDict()
                    dd.push(tmp); // 第二步的表格数据整理
                    dkey[v["_id"]]=tmp
                    selectAllData.push({label:v["tasktitle"],value:v["_id"]}) //第一步中下拉菜单全部数据

                });
                let datasource=item.data;
                datasource["dataList"]=dd;

                this.selectData=Object.keys(this.props.currentModel["taskResultObj"])
                // console.log(this.selectData)
                // console.log(selectAllData)
                let _this=this
                this.props.saveSelectData(this.selectData)
                this.setState({
                    value: params,
                    Alldatasource: datasource,
                    AlldatasourceKey:dkey,
                    datasource:datasource,
                    isLoading: false,
                    selectAllData:selectAllData,
                    selectData:this.selectData
                },function () {
                    _this.setState({

                        selectvisiable:false
                    })
                });
            }


        });
    };
    //查询字典值
    getDictLabel = (dict_type, key,row) => {
        // console.log(dict_type,key,row)
        if (dict_type=="show_model_field"){
            return key
        }
        let label = '';
        let dict = this.state.dictConfig[dict_type];
        for (let item of dict) {
            if (item.value == key) {
                label = item.label;
                break;
            }
        }
        return label;
    };

    //查询字典值
    getDictMultipleByArray = (dict_type, key) => {
        let label = '';
        for (let item of key) {
            label = label + ',' + this.getDictLabel(dict_type, item)
        }
        return label.substring(1);
    };

    getDictMultipleByStr = (dict_type, key) => {
        if (key) {
            let label = '';
            let keyList = key.toString().split(",");
            for (let item of keyList) {
                label = label + ',' + this.getDictLabel(dict_type, item)
            }
            return label.substring(1);
        }

    };

    // 下载模版
    downloadTpl = (crud) => {
        let table_id = {};
        let file = "";
        if (crud) {
            file = this.state.value.table_id;
            table_id = {table_id: this.state.value.table_id}
        } else {
            file = crudAPI;
            table_id = {table_id: crudAPI}
        }
        let url = '/crud/' + this.state.crudAPI + '/downtpl';
        axios({
            url: url,
            method: 'post',
            responseType: 'blob',
            data: table_id
        }).then(function (res) {
            var blob = new Blob([res.data], {type: res.headers['content-type']});
            var downloadElement = document.createElement('a');
            var href = window.URL.createObjectURL(blob); //创建下载的链接
            downloadElement.href = href;
            downloadElement.download = file + ".csv"; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
        })
    };

    //下载文件
    exportData = (crud) => {
        let table_id = {};
        let file = "";
        if (crud) {
            file = this.state.value.table_id;
            table_id = {table_id: this.state.value.table_id}
        } else {
            file = this.state.crudAPI;
            table_id = {table_id: this.state.crudAPI}
        }
        let url = '/crud/' + this.state.crudAPI + '/exportData';
        axios({
            url: url,
            method: 'post',
            responseType: 'blob',
            data: {
                "page": 1,
                "pagesize": 6000,
                ...this.state.value
            }
        }).then(function (res) {
            let blob = new Blob([res.data], {type: res.headers['content-type']});
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob); //创建下载的链接
            let fileName = res.headers['content-disposition'].split("=")[1];
            downloadElement.href = href;
            // downloadElement.download = file + "_row_6000.csv"; //下载后文件名
            downloadElement.download = fileName; //下载后文件名
            document.body.appendChild(downloadElement);
            downloadElement.click(); //点击下载
            document.body.removeChild(downloadElement); //下载完成移除元素
            window.URL.revokeObjectURL(href); //释放掉blob对象
        })
    };

    beforeUpload = (info) => {
        // 上传文件前
        this.setState({
            isLoading: true
        });
        console.log('beforeUpload : ', info);
        // return true
    };

    UploadonChange = (info) => {
        // 上传文件改变
        console.log('onChange : ', info);
    };

    UploadonSuccess = (info) => {
        console.log('onSuccess : ', info);
        if (info.response.status == 200) {
            UploadRestltDialog('上传返回', info.response)
        } else {
            UploadRestltDialog('上传出错', info.response)
        }
        this.setState({
            isLoading: false
        });
        this.fetchData(this.state.value, true)
    };

    // 切换页面
    fetchDataPage(current) {
        let params = {};
        if (this.state.value !== undefined) {
            params = this.state.value;
        }
        params['page'] = current;
        this.setState({
            value: params,
            current: current
        });
        this.fetchData(params, true);
    };

    fetchDataPageChangeSize = (pagesize) => {
        let params = {};
        if (this.state.value !== undefined) {
            params = this.state.value;
        }
        params['pagesize'] = pagesize;
        params['page'] = 1;

        this.setState({
            value: params,
            pagesize: pagesize,
            page: 1
        });
        this.fetchData(params, true);
    };

    handleClick = (e) => {
        if (this.state.isShow) {
            this.setState({
                isShow: false
            })
        }
    };

    setRecord = (record) => {
        console.log('setRecord', record);
        // console.log(record.value)
        let data=[]
        record.value["model_config"]["tempList"].map(function (vv,i) {
            data.push({label:vv["zbmc"],value:vv["zbmc"]})
        });
        let dc=this.state.dictConfig
        dc["show_model_field"]=data
        this.setState({
            dictConfig:dc
        })

        this.setState({
            record: record,
            isShow: true
        })
    };

    submitData = (params) => {
        console.log(params)
        if (this.props.currentModelId == "" || this.props.currentModelId==undefined){
            Message.show("没有可用的模板")
            return
        }

        if (!params.hasOwnProperty("QuxianDict")){
            Message.show("没有选择映射的曲线")
            return
        }
        if (!params.hasOwnProperty("show_model_field")){
            Message.show("没有选择显示的列名")
            return
        }

        // console.log(this.state.datasource);
        let datasource=this.state.datasource;
        this.state.datasource.dataList.map(function (v,i) {
            // console.log(v["_id"])
            if (v["_id"]==params["_id"]){
                delete datasource.dataList[i]
                datasource.dataList.push(params)
            }

        })
        this.setState({
            datasource:datasource
        });
        // console.log(datasource)
        this.props.saveTempTaskResult(params)


    };


    // 修改页面中，新增
    submitAddData = (params) => {
        //判断操作类型
        let method = 'create';
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const element = params[key];
                if (!!element) {
                    if (typeof (element.format) == 'function') {
                        // params[key] = element.format("YYYY-MM-DD HH:mm:ss");
                        params[key] = element.valueOf();
                    } else if (Array.isArray(element)) {
                        let keyvalue = element.toString();
                        if (keyvalue.substr(0, 1) == ",") {     // 删除第一个字符
                            keyvalue = keyvalue.slice(1);
                        }
                        params[key] = keyvalue;
                    }
                }
            }
        }
        let url = '/crud/' + this.state.crudAPI + '/' + method;
        // 增加用户信息
        if (this.state.userinfo.length > 0) {
            params["userInfo"] = this.state.userinfo[0];
        } else {
            params["userInfo"] = {}
        }
        this.props.updateBindingData('update', {url: url, data: params}, (item) => {
            if (item.status == '200') {
                Message.success('提交成功');
            } else {
                Message.success('提交失败:' + item.statusText);
            }
            this.fetchData(this.state.value, true)
        });
    };


    onchange_cols = (value) => {
        // const {show_fields} = this.state;
        this.setState({
            cookie_col: value
            // cookie_col:value
        })
    };

    // 全选
    onSelectAll = (selectedRowKeys, records) => {
        this.setState({
            selectAllRecords: records,
            selectedRowKeys: selectedRowKeys
        })

    };

    //
    onAddTpl= () => {

        // this.props.onAddTpl(SelectRows)
    };

    // 关闭编辑弹窗
    setShow = () => {
        this.setState({
            isShow: "",
        });

    };

    // 关联订单
    getGroupByCol = () => {
        let url = '/api/HF_BILL/groupby';
        let params = {groupbycol: "BIANMA"};
        this.props.updateBindingData('getGroupByCol', {url: url, data: params}, (item) => {
                if (item.status === 200) {
                    this.setState({
                        orderValues: item.datalist.map((obj) => {
                            return {label: obj, value: obj}
                        })
                    })
                }
            }
        )
    };

        // 第二步中 select
    // handleSelectchange(id,col,value,at,records){
    //     console.log(value);
    //     // console.log(at)
    //     // console.log(records)
    //     console.log(id)
    //     console.log(col)
    //     let data=[];
    //     let _this=this
    //     _this.state.datasource.map(function (v,i) {
    //         if (v["_id"]==id){
    //             v[col.field_id]=value
    //         }
    //         data.push(v)
    //
    //     })
    //     console.log(data)
    //     _this.setState({
    //         datasource:data
    //     })
    // };



    // 第一步中 select
    SelectChange =(value,actiontype,item)=>{
        console.log(value)
        console.log(actiontype)
        console.log(item)
        this.selectData=value

    };

    prev = () => {
        let _this=this
        if (_this.state.currentStep === 1) {
            this.setState({
                currentStep:0,
                stepDisplay:["block","none"],
            })
        }
    };

    next = () => {
        // console.log(this.state.params);
        console.log(this.state.datasource)
        let _this=this
        if (_this.state.currentStep === 0) {
            let dl=[];
            _this.state.Alldatasource.dataList.map(function (v,i) {
                if (_this.selectData.includes(v["_id"])){
                    let tmp=v;
                    // console.log(_this.props.currentModel);
                    // console.log(_this.props.currentModelId)
                    if (_this.props.currentModel["taskResultObj"].hasOwnProperty(v["_id"])){
                        v["QuxianDict"]=_this.props.currentModel["taskResultObj"][v["_id"]]["QuxianDict"];
                        v["show_model_field"]=_this.props.currentModel["taskResultObj"][v["_id"]]["show_model_field"]
                    }

                    // v["show_model_field"]=_this.props.currentModel["taskResultObj"][v["_id"]]["show_model_field"];
                    // console.log(tmp)
                    dl.push(tmp)
                }
            });
            console.log(dl);
            // this.props.saveSelectData()
            this.props.saveSelectData(this.selectData,this.state.AlldatasourceKey)
            _this.setState({
                currentStep: 1,
                stepDisplay:["none","block"],
                selectData:this.selectData,
                datasource:{page:1,pageSize:20,dataList:dl}
            })

        }
    }
    render() {

        const {
            base, dictConfig, isLoading, isShow, datasource, fields,
            record, userinfo, show_fields, filter_fields, cookies_obj, change_cols, selectedRowKeys, dataSuccess, cookie_col
        } = this.state;
        // console.log(datasource)
        // 权限控制
        // let permission = this.getPermission(this.props.location.pathname);

        // console.log(permission);
        // if (permission === undefined && permission && permission === {}) {
        //     permission.buttonDisable = true;
        //     permission.selectButtonDisable = true
        // }
        let rowRecord = record;
        if (rowRecord.value !== undefined) {
            fields.map((item, index) => {
                if (item.input_type === 'Checkbox') {
                    let valueStr = rowRecord.value[item.field_id];
                    let valueArray = [];
                    if (Array.isArray(valueStr)) {
                        valueArray = valueStr;
                    } else {
                        valueArray = valueStr.split(',');
                    }
                    delete rowRecord.value[item.field_id];
                    rowRecord.value[item.field_id] = valueArray;
                }
            });
        }
        let values = Object.assign({}, rowRecord.value); // 浅拷贝




        let m
        if (this.state.selectAllData.length>0 ){
            m= (<Select mode={"multiple"} showSearch
                        style={{width:300}}
                        defaultValue={this.state.selectData}
                        // defaultValue={["abc"]}
                        dataSource={this.state.selectAllData}
                        // dataSource={[{label:"111",value:"abc"}]}
                        onChange={this.SelectChange}/>)

        }


        return (
            <div>

            <Row className="table-display-page" wrap>
                {/*<Col onClick={this.handleClick}>*/}
                        {/*<ContainerTitle title={base.table_name}/>*/}

                        <IceContainer title="模板任务结果添加步骤" className="adaptationContainer">
                            <Step shape="arrow" current={this.state.currentStep}>
                                <StepItem title="步骤1:选择历史任务"/>
                                <StepItem title="步骤2:选择显示列"/>
                            </Step>
                            <Loading visible={this.state.selectvisiable} >
                            <div style={{display: this.state.stepDisplay[0]}}>
                                <IceContainer>
                                    <Row style={{marginBottom: '20px'}}>
                                        <Col xxs="5" s="5" l="2">
                                            已添加的历史任务:
                                        </Col>
                                        <Col s="14" l="14">
                                            {m}


                                        </Col>
                                    </Row>

                                </IceContainer>
                            </div>
                            </Loading>
                            <div style={{display: this.state.stepDisplay[1] , padding: '20px'}}>
                                <IceContainer>
                            {/*<Collapse accordion>*/}
                            {/*<Panel title={'搜索'}>*/}
                            {/*<SearchFilter*/}
                                {/*fields={filter_fields}*/}
                                {/*dictConfig={dictConfig}*/}
                                {/*pagesize={this.state.pagesize}*/}
                                {/*page={this.state.page}*/}
                                {/*fetchData={this.fetchData}*/}
                                {/*setRecord={this.setRecord}*/}
                                {/*downloadTpl={this.downloadTpl}*/}
                                {/*exportData={this.exportData}*/}
                                {/*beforeUpload={this.beforeUpload}*/}
                                {/*UploadonChang={this.UploadonChange}*/}
                                {/*UploadonSuccess={this.UploadonSuccess}*/}
                                {/*CurrentTable={crudAPI}*/}
                                {/*uploadUrl={"/crud/HF_BILL/importexcel"}*/}
                                {/*selectButtonDisable={false}*/}
                                {/*buttonDisable={false}*/}
                                {/*orderValues={this.state.orderValues}*/}
                            {/*/>*/}
                            {/*</Panel>*/}
                            {/*</Collapse>*/}
                            <Col>
                            <ContractTable
                                isLoading={isLoading}
                                fields={show_fields}
                                current={this.state.current}
                                datasource={datasource}
                                setRecord={this.setRecord}
                                fetchDataPage={this.fetchDataPage}
                                fetchDataPageChangeSize={this.fetchDataPageChangeSize}
                                getDictLabel={this.getDictLabel}
                                getDictMultipleByStr={this.getDictMultipleByStr}
                                tableName={crudAPI}
                                dataSuccess={dataSuccess}
                                cookies_expires={cookies_expires}
                                userinfo={userinfo}
                                cookies_obj={cookies_obj}
                                cookie_col_all={this.state.cookie_col_all}
                                // change_cols={change_cols}
                                cookie_col={cookie_col}
                                onchange_cols={this.onchange_cols}
                                onSelectAll={this.onSelectAll}
                                onAddTpl={this.onAddTpl}
                                buttonDisable={false}
                                selectedRowKeys={selectedRowKeys}
                                handleSelectchange={this.handleSelectchange}

                            />
                            </Col>
                                    <Col className={'sider ' + (isShow ? 'active' : '')}>
                                        <SearchHistory
                                            method={rowRecord.method}
                                            value={values}
                                            fields={fields}
                                            dictConfig={dictConfig}
                                            setShow={this.setShow}
                                            submitData={this.submitData}
                                            disableInput={this.disableInput}
                                            // submitAddData={this.submitAddData}
                                        />

                                    </Col>
                                </IceContainer>
                        </div>

                {/*</Col>*/}

                            <div className={styles.buttonGroup}>
                                <ButtonGroup>
                                    <Button
                                        onClick={this.prev}
                                        type="primary"
                                        disabled={this.state.currentStep===0}
                                    >
                                        上一步
                                    </Button>
                                    <Button onClick={this.next}

                                            type="primary"
                                            disabled={this.state.currentStep === 1 }>下一步
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </IceContainer>

            </Row>
            </div>
        );
    }
}
