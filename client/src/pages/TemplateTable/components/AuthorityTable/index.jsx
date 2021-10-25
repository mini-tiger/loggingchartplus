import React, {Component} from 'react';
import DataBinder from '@icedesign/data-binder';
import {Table, Button, Input, Select, Switch, NumberPicker, Dialog, Range, Message,Tab} from '@alifd/next';
import {SketchPicker} from 'react-color'
import styles from './index.module.scss';
import config from '../../../../../config'
import ResultTable from './ResultTable'
import {IsNumber,compareZh} from '../../../../utils/tools'
@DataBinder({
    findModel: {
        method: 'post',
    },
    saveTemplate: {
        method: 'post',
    },
    delTemplate: {
        method: 'post',
    },
    count: {
        method: 'post',
    }
})
export default class Index extends Component {
    static displayName = 'Index';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.SelectData=[]
        this.state = {
            AllModelList: [],
            modelList: [],
            currentTempList: [],
            templateName: "",
            templateNameList: [],
            taskResultObj:{},
            visibleColor: false,
            currentIndex: 0,
            currentModelId: "",
            tpvisible: false,
            add: false,  //新建 未保存状态
            selectAllRecords: [],
            tab2disable:true,
            addbtn:true,
        };
        this.addplus = false;
        this.tpname = ""; //新建模板名称
        this.renderCell = this.renderCell.bind(this);
        this.saveTemplate = this.saveTemplate.bind(this);
        this.addTemplate = this.addTemplate.bind(this);
        this.onChangeTempName = this.onChangeTempName.bind(this);
        this.onChangeSelect = this.onChangeSelect.bind(this)
    }

    componentDidMount() {
        // 初始化配置-取当前任务,并跳转到详情页
        let allm = [];
        let _this=this
        this.props.updateBindingData('findModel', {
            url: '/' + config.urlSuffix + '/api/findModel',
            data: {}
        }, (item) => {
            item.data.map(data => {
                allm[data["_id"]] = data
            });
            console.log(allm)
            this.setState({
                AllModelList: allm,
            })
        });

        this.props.updateBindingData('findModel', {
            url: '/' + config.urlSuffix + '/api/findModelGroup',
            data: {}
        }, (item) => {
            item.data.map(data => {
                data["value"] = data._id;
                data["label"] = data._id
            });
            // console.log(item.data)
            this.setState({
                modelList: item.data.sort(compareZh("label")),
            })
        })
    }

    saveTemplate() {
        let currentModel = {};
        let url = '/' + config.urlSuffix + '/api/saveTemplate'
        currentModel = this.state.AllModelList[this.state.currentModelId];
        // console.log(currentModel);

        //数据库中数据不包含tempList则 更新，包含则新建

        let n = 0;
        // console.log(currentModel);
        // console.log(this.state.modelList);
        this.state.modelList.map(function (v, i) { //如果不止一个模板
            if (v.label == currentModel.label) {
                n = v.tempName.length
            }
        });

        if ( this.state.add) {
            currentModel["tempList"] = this.state.currentTempList
            currentModel["tempName"] = this.tpname;
            // delete currentModel._id;
            currentModel["taskResultObj"] = this.state.taskResultObj
            currentModel["value"]=currentModel._id;
            url = '/' + config.urlSuffix + '/api/saveTemplatecallback'
        } else {
            currentModel["tempList"] = this.state.currentTempList
            currentModel["taskResultObj"] = this.state.taskResultObj
            currentModel["tempName"] = this.tpname != "" ? this.tpname : currentModel["tempName"];
        }

        console.log(currentModel);
        console.log(this.state.taskResultObj)
        // console.log(url)
        this.props.updateBindingData('saveTemplate', {url: url, data: currentModel}, (item) => {

            if (item.status == 200) {
                Message.success('保存成功');
                location.reload()
            }
        })
    }


    //保存任务配置
    delTemplate = () => {
        let currentModel = this.state.AllModelList[this.state.currentModelId];
        let url = '/' + config.urlSuffix + '/api/delTemplate'
        if (this.state.currentModelId == "" || this.state.add || this.state.templateName == "") {
            Message.success("删除失败")
            return
        } else {
            //xxx 模型对应不止一个模板 删除记录，对应一个，删除 tempList,tempName字段
            let _this = this;
            // let n = 0;

            // this.state.modelList.map(function (v, i) { //如果不止一个模板
            //     if (v.label == currentModel.label) {
            //         n = v.tempName.length
            //     }
            // });


                // currentModel = {};
                // currentModel["_id"] = this.state.currentModelId
                // url = '/' + config.urlSuffix + '/api/delTemplate'


            this.props.updateBindingData('delTemplate', {url: url, data: currentModel}, (item) => {
                if (item.status == 200) {
                    Message.success("删除成功");
                    location.reload()
                    _this.setState({
                        currentTempList: [],
                        templateName: '',
                    })
                } else {
                    Message.success("删除失败")
                }
            })
        }

    };

    tpok = () => {
        if (this.tpname == "") {
            Message.success("模板名称错误")
            return
        } else {
            let _this = this
            let l = this.state.templateNameList;
            // console.log(l)
            l.unshift({label: this.tpname, value: this.tpname})
            this.setState({
                templateNameList: l,
                tpvisible: false,
                templateName: this.tpname
            }, function () {
                _this.callback();
                _this.saveTemplate() // xxx 新建模板 先 保存
                if (_this.addplus){ //另存为
                    // _this.saveTemplate()
                }
            })
        }

    };

    tpclose = () => {
        this.setState({
            tpvisible: false
        })
    };

    handletn = (value) => {

        this.tpname = value

    };


    addTemplate(plus) {
        if (this.state.currentModelId == "") {
            Message.success("没有选中模型")
            return
        }
        this.setState({
            add: true,
        });

        //设置模板名称
        this.setState({
            tpvisible: true
        });
        if (plus) {
            this.addplus = plus
        }

    }
    saveTempTaskResult=(params)=>{
        console.log("saveTempTaskResult",params)
        let taskResultObj=this.state.taskResultObj
        if (taskResultObj.hasOwnProperty(params["_id"])){
            taskResultObj[params["_id"]]={_id:params["_id"],model_name:params["model_id"],
                QuxianDict:params["QuxianDict"],show_model_field:params["show_model_field"]}
        }else{
            console.log("NotFound",params)
            console.log(this.state.AllModelList)
        }


        console.log(taskResultObj)
            this.setState({
                taskResultObj:taskResultObj
            })
        console.log(taskResultObj)
    };

    saveSelectData=(params,AlldatasourceKey)=>{
        let taskResultObj=this.state.taskResultObj;
        let tmptaskResultOjb={}
        console.log(taskResultObj)
        console.log(params)
        let _this=this
        // xxx 只保留用户 在选择框选中的， 后面保存到数据库中
        params.map(function (v,i) {
            if (taskResultObj.hasOwnProperty(v)){
                tmptaskResultOjb[v]=taskResultObj[v]
            }else{
                // console.log(AlldatasourceKey)
                // console.log(v)
                tmptaskResultOjb[v]=AlldatasourceKey[v]
            }
        })
        this.setState({
            taskResultObj:tmptaskResultOjb
        })

    };

    initSelectData=(currentid)=>{
        if (currentid ==undefined){


        }else{
            if (Object.keys(this.state.AllModelList).length >0){
                if (this.state.AllModelList[currentid].hasOwnProperty("taskResultObj")){
                    this.setState({
                        taskResultObj:this.state.AllModelList[currentid]["taskResultObj"]
                    })
                }
            }
        }

    }



    addTemplateRow = () => {
        let dataList = this.state.currentTempList;

        if (dataList.length == 0) {
            dataList=[]
            let param = {};
            param["id"] = 1;
            param["zbmc"] = "";
            param["unit"] = "";
            param["min"] = 0;
            param["max"] = 0;
            param["log"] = false;
            param["grid"] = true;
            param["direction"] = false;
            param["lineColor"] = "#0ff";
            param["lineWeight"] = 1;
            param["lineType"] = true;
            param["wayIndex"] = 1;

            dataList.push(param)
            // Message.error("没有选择模板")
        } else {
            let model = this.state.AllModelList[this.state.currentModelId]
            let inParams = "DEPTH," + model.inparamslist + "," + model.outparamslist
            let arrParams = inParams.split(",");

            let param = {};
            param["id"] = (dataList[dataList.length - 1]).id + 1;
            param["zbmc"] = "";
            param["unit"] = "";
            param["min"] = 0;
            param["max"] = 0;
            param["log"] = false;
            param["grid"] = true;
            param["direction"] = false;
            param["lineColor"] = "#0ff";
            param["lineWeight"] = 1;
            param["lineType"] = true;
            param["wayIndex"] = 1;

            dataList.push(param)

        }

        this.setState({
            currentTempList: dataList
        })
    }


    callback = () => {

        let model = this.state.AllModelList[this.state.currentModelId]
        let inParams = "DEPTH," + model.inparamslist + "," + model.outparamslist
        let arrParams = inParams.split(",");
        let tempData = [];
        for (var i = 0; i < arrParams.length; i++) {
            let param = {};
            param["id"] = i + 1;
            param["zbmc"] = arrParams[i];
            param["unit"] = "";
            param["min"] = 0;
            param["max"] = 0;
            param["log"] = false;
            param["grid"] = true;
            param["direction"] = false;
            param["lineColor"] = "#0ff";
            param["lineWeight"] = 1;
            param["lineType"] = true;
            param["wayIndex"] = 1;
            tempData.push(param)
        }
        this.setState({
            currentTempList: tempData,
            addbtn:false
        })

    }

    onChangeTempName(value, actionType, item) {
        // console.log(value, actionType, item)
        this.setState({
            templateName: value,
            currentModelId: value,
        });

        this.initSelectData(value)
        this.getcurrentTempList(item)
    }

    onChangeSelect(value, actionType, item) {
        let _this = this;
        console.log(item)
        if (!item.tempName[0].hasOwnProperty("label") || item.tempName[0]["label"] == "") { // 模型下 还 没有模板
            this.setState({
                currentModelId: item.tempName[0]["value"],
                currentTempList: [],
                templateNameList: [],
                templateName: "",
            });
            Message.success("请新建模板")
        } else {

            this.setState({
                currentModelId: item.tempName[0]["value"],
                templateNameList: item.tempName,
                templateName: item.tempName.length > 0 ? item.tempName[0] : "",
                currentTempList: []
            });
            this.getcurrentTempList(item.tempName[0]);
            this.initSelectData(item.tempName[0]["value"])
        }

        if (item.tempName[0]["value"] !=""){
            this.setState({
                tab2disable:false
            })
        }


    }

    getcurrentTempList = (obj) => {
        let currentTempListTmp=[]
        this.props.updateBindingData('findModel', {
            url: '/' + config.urlSuffix + '/api/findModel',
            data: {_id: obj["value"]}
        }, (item) => {
            if (item.status == 200) {
                if (item.data.length >0) {
                    if (item.data[0].hasOwnProperty("tempList")){
                        if (item.data[0]["tempList"].length >0){
                            currentTempListTmp=item.data[0].tempList
                            this.setState({
                                currentTempList: currentTempListTmp,
                                addbtn:false
                            })
                        }
                    }

                }
                console.log(obj)
                console.log(currentTempListTmp);

                // console.log(this.state)
                if (currentTempListTmp.length==0){
                    // currentTempListTmp=this.genTempList(item.data)
                    this.callback()
                }
            }
        })
    };
    genTempList=(modeldata)=>{
        console.log(modeldata)
        let currentTempListTmp=[]
        let l=modeldata[0]["inparamslist"].split(",");

        l.push(modeldata[0]["outparamslist"]);

        l.map(function (v,i) {
            let obj={id:i,
                zbmc:v,
                wayIndex:Math.floor(Math.random()*10),
                min:0,
                max:0,
                lineType:true,
                lineColor:"#0ff"
            };
            currentTempListTmp.push(obj)
        })
        console.log(currentTempListTmp)
        return currentTempListTmp

    }


    handleClick = (rowIndex) => {
        this.setState({
            visibleColor: true,
            currentIndex: rowIndex
        })
    };

    handleClose = () => {
        this.setState({visibleColor: false})
    };

    handleChange = (rowIndex, fieldName, value) => {
        let dataList = this.state.currentTempList
        if (fieldName == "lineColor") {
            dataList[rowIndex].lineColor = value.hex;
        } else {
            dataList[rowIndex][fieldName] = value;
        }
        this.setState({currentTempList: dataList})
    };

    renderCell(fieldName, value, rowIndex) {
        if (fieldName == "lineType") {
            return <Switch defaultChecked={value} style={{width: '100%'}} checkedChildren="折线图" unCheckedChildren="面积图"
                           onChange={this.handleChange.bind(this, rowIndex, fieldName)}/>;
        } else if (fieldName == "direction") {
            return <Switch defaultChecked={value} size="small" checkedChildren="左" unCheckedChildren="右"
                           onChange={this.handleChange.bind(this, rowIndex, fieldName)}/>;
        } else if (fieldName == "log" || fieldName == "grid") {
            return <Switch defaultChecked={value} size="small"
                           onChange={this.handleChange.bind(this, rowIndex, fieldName)}/>;
        } else if (fieldName == "lineColor") {
            return (
                <div style={{width: '80px', height: '14px', borderRadius: '2px', backgroundColor: value}}
                     onClick={this.handleClick.bind(this, rowIndex)}/>
            );
        } else if (fieldName == "unit") {
            return <Input value={value} maxLength={8} style={{width: '100%'}}
                          onChange={this.handleChange.bind(this, rowIndex, fieldName)}/>;
        } else if (fieldName == "min" || fieldName == "max") {
            return <NumberPicker value={value} precision={6}
                                 onChange={this.handleChange.bind(this, rowIndex, fieldName)}/>;
        } else if (fieldName == "wayIndex" || fieldName == "lineWeight") {
            return <Range min={1} max={8} setp={1} defaultValue={value} marks={7} marksPosition="below"
                          style={{marginBottom: '0px', marginTop: '20px', width: '100%'}}
                          onChange={this.handleChange.bind(this, rowIndex, fieldName)}/>;
        } else if (fieldName == "del") {

            // console.log(fieldName, value) // del, id值
            return <Button type="secondary" className={styles.submitButton} onClick={this.delCol.bind(this, value)}>
                删除
            </Button>

        } else if (fieldName == "zbmc") {
            return <Input value={value} maxLength={8} style={{width: '100%'}}
                          onChange={this.handleChange.bind(this, rowIndex, fieldName)}/>;
        }
    }

    delCol = (value) => {
        let dataList = []
        this.state.currentTempList.map(function (v, i) {
            if (v.id != value) {
                // console.log(v)
                dataList.push(v)
            }
        });
        // console.log(dataList)

        this.setState({currentTempList: dataList})
    };

    onAddTpl= (selectAllRecords) => {
        console.log(selectAllRecords)

    };


    render() {


        return (
            <div>
                <div className={styles.tableFilter}>
                    <div className={styles.title}>测井图模板配置管理</div>
                    <div className={styles.filter}>
                        <div className={styles.filterItem}>
                            <span className={styles.filterLabel}>模型名称：</span>
                            <Select className={styles.selectWidth} dataSource={this.state.modelList}
                                    onChange={this.onChangeSelect}/>
                        </div>
                        <div className={styles.filterItem}>
                            <span className={styles.filterLabel}>模板名称：</span>
                            {/*<Input onChange={this.onChangeTempName} value={this.state.templateName}/>*/}
                            <Select className={styles.selectWidth} value={this.state.templateName}
                                    dataSource={this.state.templateNameList} onChange={this.onChangeTempName}/>
                        </div>
                        <Button type="primary" className={styles.submitButton} onClick={this.addTemplate}>
                            新建模板
                        </Button>
                        <Button type="secondary" className={styles.submitButton} onClick={this.saveTemplate}>
                            保存模板
                        </Button>
                        {/*<Button type="secondary" className={styles.submitButton} onClick={this.addTemplate.bind(true)}>*/}
                            {/*另存为模版*/}
                        {/*</Button>*/}
                        <Button type="secondary" className={styles.submitButton} onClick={this.delTemplate}>
                            删除模板
                        </Button>
                    </div>
                </div>

                <Dialog
                    title="请输入模板名称"
                    visible={this.state.tpvisible}
                    children={(<div>
                        <Input onChange={this.handletn}/>{this.state.tpnameerr}
                    </div>)}
                    onOk={this.tpok}
                    onCancel={this.tpclose}
                    onClose={this.tpclose}
                >
                </Dialog>


                <div className={styles.tableContainer}>
                    <Tab>
                        <Tab.Item title={"原型"} key={1}>
                    <Dialog
                        title="请选择Color" footer={false}
                        visible={this.state.visibleColor}
                        onClose={this.handleClose}>
                        <SketchPicker color={this.state.color}
                                      onChange={this.handleChange.bind(this, this.state.currentIndex, 'lineColor')}/>
                    </Dialog>

                    <Table
                        dataSource={this.state.currentTempList}
                        // onSort={this.handleSort}
                        hasBorder={false}
                        className="custom-table"
                    >
                        <Table.Column width={60} align="center" title="序列" dataIndex="id" lock/>
                        <Table.Column width={100} align="center" title="测井曲线" dataIndex="zbmc"
                                      cell={this.renderCell.bind(this, "zbmc")}/>
                        <Table.Column width={200} align="center" title="图道" dataIndex="wayIndex"
                                      cell={this.renderCell.bind(this, "wayIndex")}/>
                        <Table.Column width={100} align="center" title="单位" dataIndex="unit"
                                      cell={this.renderCell.bind(this, "unit")}/>
                        <Table.Column width={100} align="center" title="最小值" dataIndex="min"
                                      cell={this.renderCell.bind(this, "min")}/>
                        <Table.Column width={100} align="center" title="最大值" dataIndex="max"
                                      cell={this.renderCell.bind(this, "max")}/>
                        <Table.Column width={100} align="center" title="取对数" dataIndex="log"
                                      cell={this.renderCell.bind(this, "log")}/>
                        <Table.Column width={100} align="center" title="线色" dataIndex="lineColor"
                                      cell={this.renderCell.bind(this, "lineColor")}/>
                        <Table.Column width={100} align="center" title="线型" dataIndex="lineType"
                                      cell={this.renderCell.bind(this, "lineType")}/>
                        <Table.Column width={200} align="center" title="线宽" dataIndex="lineWeight"
                                      cell={this.renderCell.bind(this, "lineWeight")}/>
                        <Table.Column width={100} align="center" title="网格" dataIndex="grid"
                                      cell={this.renderCell.bind(this, "grid")}/>
                        <Table.Column width={100} align="center" title="方向" dataIndex="direction"
                                      cell={this.renderCell.bind(this, "direction")}/>
                        <Table.Column width={100} align="center" title="删除" dataIndex="id"
                                      cell={this.renderCell.bind(this, "del")}/>
                    </Table>

                    <Button type="secondary" disabled={this.state.addbtn} className={styles.submitButton} onClick={this.addTemplateRow}>新增 </Button>
                        </Tab.Item>
                        <Tab.Item title={"曲线结果"} key={2} disabled={this.state.tab2disable}>
                            <ResultTable
                                currentModel={this.state.AllModelList[this.state.currentModelId]}
                                currentModelId={this.state.currentModelId}
                                saveTempTaskResult={this.saveTempTaskResult}
                                saveSelectData={this.saveSelectData}/>
                        </Tab.Item>
                    </Tab>
                        </div>
            </div>
        );
    }
}
