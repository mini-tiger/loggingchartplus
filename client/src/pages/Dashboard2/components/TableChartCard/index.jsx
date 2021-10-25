import React, {Component} from 'react';
import IceContainer from '@icedesign/container';
import {Grid} from '@alifd/next';
import CustomTable from './CustomTable';
import PirChart from './PieChart';
import styles from './index.module.scss'
import DataBinder from '@icedesign/data-binder';
import config from '../../../../../config'

const {Row, Col} = Grid;


const statusArray = [
    {type: "default", label: "未完成"},
    {type: "primary", label: "待处理"},
    {type: "info", label: "处理中"},
    {type: "success", label: "处理完毕"}
]

@DataBinder({
    getCount: {
        method: 'post',
    },
})
export default class TableChartCard extends Component {
    static displayName = 'TableChartCard';

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            SourceData: [],
            PieData: []
        };
    }


    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {

        let url = '/' + config.urlSuffix + '/api/getIndexCount1';
        let params = {
            match: {},
            group: {_id: "$status", count: {$sum: 1}}
        };
        this.props.updateBindingData('getCount', {url: url, data: params}, (item) => {
            // console.log(item);
            if (item.status == 200) {
                if (item.data.length > 0) {
                    let piedata = [];
                    // let SourceData=[];
                    item.data.map(function (v, i) {
                        let tmp = {item: statusArray[v["_id"]].label, count: v["count"]};
                        piedata.push(tmp)
                        // SourceData.push(stmp)
                    });

                    // console.log(piedata)
                    this.setState({
                        SourceData: piedata,
                        PieData: piedata
                    });
                }

            }

        });
    };


    render() {
        return (
            <IceContainer className={styles.container}>
                <h4 className={styles.title}>任务执行比例分布图</h4>
                <Row wrap>
                    <Col l="8">
                        <CustomTable
                            dataSource={this.state.SourceData}
                        />
                    </Col>
                    <Col l="16">
                        <PirChart dataSource={this.state.PieData}/>
                    </Col>
                </Row>
            </IceContainer>
        );
    }
}
