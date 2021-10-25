import React, {Component} from 'react';
import {Grid, Icon, Button, Notification, Loading,Dialog} from '@alifd/next';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import {Link} from 'react-router-dom';
import DataBinder from '@icedesign/data-binder';

const {Row, Col} = Grid;
import axios from 'axios';
import {Message} from '@alifd/next';
import config from '../../../config'

const props = {
    component: 'a',
    href: '/' +config.urlSuffix+'/DataCollection/Steptask2?id=',
    target: '_self'
};

const statusArray = [
    {type: "default", label: "未完成"},
    {type: "primary", label: "待处理"},
    {type: "info", label: "处理中"},
    {type: "success", label: "处理完毕"}
]
@DataBinder({
    getTask: {
        method: 'post',
    },
    getOilFieldConfig: {
        method: 'post',
    },
    getModelConfig: {
        method: 'post',
    },
    del: {
        method: 'post',
    },
})
export default class Service extends Component {
    static displayName = 'Service';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            taskList: [],
            oilFieldConfig: [],
            modelConfig: [],
            downLoading: false,
        };
        this.getOilField = this.getOilField.bind(this);
        this.getModelConfig = this.getModelConfig.bind(this);
    }

    componentDidMount() {
        //初始化配置-取当前任务
        let p={};
        // let p={"$or":[{taskuser:"admin"},{share:"1"}]};
        this.props.updateBindingData('getTask', {url: '/' +config.urlSuffix+'/api/findTask',data:p}, (item) => {
            this.setState({
                taskList: item.data
            })
        });
        //初始化油田数据
        this.props.updateBindingData('getOilFieldConfig', {url: '/' +config.urlSuffix+'/crud/oil_field_config/read'}, (item) => {
            this.setState({
                oilFieldConfig: item.data.dataList
            })
        });
        //初始化模型数据
        this.props.updateBindingData('getModelConfig', {url: '/' +config.urlSuffix+'/crud/model_config/read',data:{page:1,pageSize:100}}, (item) => {
            this.setState({
                modelConfig: item.data.dataList
            })
        })
    }

    //查询油气田名称
    getOilField = (id) => {
        let label = ""
        this.state.oilFieldConfig.map((item) => {
            if (item.yqtbm == id) {
                label = item.yqtmc;
            }
        })
        return label
    };
    //查询模型名称
    getModelConfig = (id) => {
        let label = ""
        this.state.modelConfig.map((item) => {
            if (item.id == id) {
                label = item.model_name;
            }
        })
        return label
    };

    exportdata_download = (filename) => {
        // console.log(filename)
        let _this = this;
        axios({
            url: '/' +config.urlSuffix+'/api/getDownloadFile',
            method: 'post',
            responseType: 'blob',
            data: {filename: filename},
            // header:{'Access-Control-Allow-Origin':'*'}
        }).then(function (res) {
            // console.log(res) // 不能使用多线程下载工具
            _this.setState({
                downLoading: false
            });
            if (res.status == 200) {
                // let rd=res.headers["content-disposition"]
                // let filename=rd.split("filename=");
                // if (filename.length <=1){
                //   Message.success('下载错误');
                //   return
                // }
                // console.log(filename[1])
                var blob = new Blob([res.data], {type: res.headers['content-type']});
                var downloadElement = document.createElement('a');
                var href = window.URL.createObjectURL(blob); //创建下载的链接
                downloadElement.href = href;
                downloadElement.download = filename; //下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); //点击下载
                document.body.removeChild(downloadElement); //下载完成移除元素
                window.URL.revokeObjectURL(href); //释放掉blob对象
            } else {
                Message.success('下载错误');
            }

        })

    };
    delDialog=(item)=>{
        Dialog.confirm({
            title: "请确认删除",
            content: "",
            onOk: () => {
                this.del(item);
            }
        });
    };

    del = (item) => {
        // console.log(item);
        let p = {tableid: "task", "_id": item["_id"]};
        this.props.updateBindingData('del', {url: '/' +config.urlSuffix+'/api/delData', data: p}, (res) => {
            if (res.status == 200) {

                p = {tableid: "taskResult_" + item["_id"]};

                this.props.updateBindingData('del', {url: '/' +config.urlSuffix+'/api/delCollect', data: p}, (res) => {
                    if (res.status == 200) {
                        location.reload();
                    }
                })
            }

        });
    };
    FusionLink = (item) => {
        // console.log(statusArray[item.status].label)
        // console.log(item.status)
        if (statusArray[item.status].label == "处理完毕") {
            return (
                <div>

                    <Link
                        to={'/' +config.urlSuffix+'/DataCollection/Steptask?id=' + item._id}
                        style={{...styles.link, ...styles.line}}
                    >
                        <Icon type="office" size="small" style={styles.icon}/>{' '}
                        项目状态:<IceLabel style={{backgroundColor: "#fff",color:"#333",borderStyle:"solid",borderWidth:"1px",borderColor:"#c4c6cf" }}
                        status={statusArray[item.status].type}>{statusArray[item.status].label}</IceLabel>
                    </Link>
                    {/*<Link to="/home" style={styles.link}>*/}
                    {/*<Icon type="box" size="small" style={styles.icon} />*/}
                    {/*成果分享*/}
                    {/*</Link>*/}
                </div>
            )
        } else {
            return (
                <div>
                    <Icon type="office" size="small" style={styles.icon}/>{' '}
                    项目状态:<IceLabel style={{backgroundColor: "#fff",color:"#333",borderStyle:"solid",borderWidth:"1px",borderColor:"#c4c6cf" }}
                    status={"default"}>{statusArray[item.status].label}</IceLabel>
                </div>
            )
        }
    };
    exportdata = (item) => {
        // console.log(item);
        let _this = this;
        this.setState({
            downLoading: true
        });
        let url = '/' +config.urlSuffix+'/api/getdownloadzip';

        this.props.updateBindingData('getTask', {url: url, data: item}, (result) => {
            // console.log(result);
            if (result.status == 200) {
                // let f =encodeURI(result["data"]["filename"]);
                let f = decodeURI(result["data"]["filename"])
                // console.log(f)
                this.exportdata_download(f);
            } else {
                Message.success('下载错误');
                _this.setState({
                    downLoading: false
                })
            }

        });
    };

    render() {
        //const mockData = getData2();
        const mockData = this.state.taskList;

        return (
            <div className="adaptationContainer">
                <Loading tip="加载中" style={{display: 'block'}} visible={this.state.downLoading} shape="fusion-reactor">
                    <div style={{margin: '20px 0', textAlign: 'right',}}>
                        <Button
                            style={{marginRight: '50px'}}
                            {...props}
                        >
                            创建任务
                        </Button>

                        {/*
      <Button type="primary" onClick={this.handleClick}>
        授权管理
      </Button>
      */}

                        <Row wrap gutter="20">
                            {mockData.map((item, index) => {
                                return (
                                    <Col className="adaptation-iceContainer-wrapper" l="12" key={index}>
                                        <IceContainer style={styles.container}>
                                            <div style={styles.body}>
                                                <h5 style={styles.name} >{this.getOilField(item.yqtbm)}:{item.tasktitle}</h5>
                                                <p style={styles.desc}>{item.taskdec}</p>
                                                <div style={styles.tag}>{this.getModelConfig(item.model_id)}</div>
                                            </div>
                                            <div style={styles.footer}>

                                                {this.FusionLink(item)}

                                                    <Button
                                                            style={styles.button}
                                                            onClick={this.exportdata.bind(this, item)}
                                                        // disabled={this.props.buttonDisable}
                                                    >
                                                        成果导出
                                                    </Button>


                                                <Button
                                                        style={styles.button}
                                                        onClick={this.delDialog.bind(this, item)}
                                                    // disabled={this.props.buttonDisable}
                                                >
                                                    删除任务
                                                </Button>

                                            </div>
                                        </IceContainer>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                </Loading>
            </div>
        );
    }
}

const styles = {
    container: {
        padding: '0',
        border: '1px solid #f0f0f0',
    },
    body: {
        padding: '20px',
        height: '120px',
        position: 'relative',
        borderBottom: '1px solid #f0f0f0',
    },
    name: {
        margin: '0',
        padding: '0',
        height: '28px',
        lineHeight: '28px',
        fontSize: '16px',
        color: '#0d1a26',
        textAlign: 'left'
    },
    desc: {
        fontSize: '14px',
        color: '#697b8c',
        margin: '12px 0',
        textAlign: 'left'
    },
    tag: {
        background: 'rgb(244, 244, 244)',
        color: 'rgb(102, 102, 102)',
        position: 'absolute',
        right: '20px',
        top: '20px',
        padding: '4px 12px',
        textAlign: 'center',
        borderRadius: '50px',
        fontSize: '12px',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    link: {
        height: '56px',
        lineHeight: '56px',
        color: '#314659',
        cursor: 'pointer',
        textDecoration: 'none',
        width: '50%',
        textAlign: 'center',
    },
    line: {
        borderRight: '1px solid #f0f0f0',
    },
    icon: {
        marginRight: '5px',
    },
};
