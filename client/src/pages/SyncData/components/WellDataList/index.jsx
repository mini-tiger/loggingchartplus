import React, {Component} from 'react';
import IceContainer from '@icedesign/container';
import {Grid,Cascader,Loading,Input,Button,Message} from '@alifd/next';
import CustomTable from './CustomTable';

import styles from './index.module.scss'
import DataBinder from '@icedesign/data-binder';
import config from '../../../../../config'
import {IsNumber} from "../../../../utils/tools";

const {Row, Col} = Grid;


const statusArray = [
    {type: "default", label: "编辑"},
    {type: "primary", label: "待处理"},
    {type: "info", label: "处理中"},
    {type: "success", label: "处理完毕"}
]

@DataBinder({
    syncwell: {
        method: 'post',
    },
})
export default class SyncDataList extends Component {
    static displayName = 'WellDataList';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            label:"",
            defaultvalue:"",
            isLoading:false,
            wellnum:""

        };
        this.onLoadData=this.onLoadData.bind(this)
    }


    componentDidMount() {
        // this.fetchData();
    }


    onLoadData(value, data, extra) {
        // console.log(value, data, extra);
        this.setState({
            label: extra.selectedPath.map(d => d.label).join(' / ')
        });

    }
    inputchange=(value)=>{
        // console.log(rowvalue)
        console.log(value)
        this.setState({
            wellnum:value
        })

        //
    };

    inputsave=(value)=>{
        // console.log(rowvalue)
        let _this=this;
        console.log(this.state.wellnum)
        this.props.updateBindingData('syncwell', {url: '/' + config.urlSuffix + '/api/syncwelldata', data: {wellnum:this.state.wellnum}}, (item) => {
            if (item.status==200){
                this.setState({
                    isLoading:false
                },function () {
                    Message.success("保存成功")

                })

            }else{
                Message.success("保存失败")
                _this.setState({
                    isLoading:false
                })
            }

        });
        //
    };
    render() {

        return (
            <IceContainer className={styles.container}>
                <Loading
                    fullScreen
                    visible={this.state.isLoading}
                />
                <h4 className={styles.title}>手动同步数据源:{this.state.label}</h4>
                <Row wrap>
                    <Col l="24">
                    井号:    <Input  onChange={this.inputchange} />
                        <Button onClick={this.inputsave} >同步</Button>
                    </Col>

                </Row>
            </IceContainer>
        );
    }
}

