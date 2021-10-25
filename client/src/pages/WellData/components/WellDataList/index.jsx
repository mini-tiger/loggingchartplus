import React, {Component} from 'react';
import IceContainer from '@icedesign/container';
import {Grid,Cascader,Loading} from '@alifd/next';
import CustomTable from './CustomTable';

import styles from './index.module.scss'
import DataBinder from '@icedesign/data-binder';
import config from '../../../../../config'

const {Row, Col} = Grid;


const statusArray = [
    {type: "default", label: "编辑"},
    {type: "primary", label: "待处理"},
    {type: "info", label: "处理中"},
    {type: "success", label: "处理完毕"}
]

@DataBinder({
    getwellqxlist: {
        method: 'post',
    },
})
export default class WellDataList extends Component {
    static displayName = 'WellDataList';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            label:"",
            defaultvalue:"",
            isLoading:true

        };
        this.onLoadData=this.onLoadData.bind(this)
    }


    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {

        let url = '/' + config.urlSuffix + '/api/getwellQXList';
        let params = {
        };

        this.props.updateBindingData('getwellqxlist', {url: url, data: params}, (item) => {
            // console.log(item);
            if (item.status == 200) {
                if (item.data.length > 0) {
                    this.setState({
                        dataSource:item.data,
                        defaultvalue:item.data[0],
                        isLoading:false
                    })
                }

            }

        });
    };

    onLoadData(value, data, extra) {
        // console.log(value, data, extra);
        this.setState({
            label: extra.selectedPath.map(d => d.label).join(' / ')
        });

    }

    render() {

        return (
            <IceContainer className={styles.container}>
                <Loading
                    fullScreen
                    visible={this.state.isLoading}
                />
                <h4 className={styles.title}>选中:{this.state.label}</h4>
                <Row wrap>
                    <Col l="24">

                        <Cascader defaultValue={this.state.defaultvalue.value}
                                    canOnlySelectLeaf={false}
                                  listStyle={{ width: '280px', height: '256px' }}
                                  dataSource={this.state.dataSource}
                                  onChange={this.onLoadData} />;
                    </Col>

                </Row>
            </IceContainer>
        );
    }
}

