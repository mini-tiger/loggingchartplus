import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid } from '@alifd/next';
import CustomTable from './CustomTable';
import styles from  './index.module.scss'
import ChartBar from './ChartBar';
import DataBinder from '@icedesign/data-binder';
import PirChart from './PieChart';
import config from '../../../../../config'
const { Row, Col } = Grid;


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
      PieData:[]
    };
  }



  componentDidMount() {
    this.fetchData();
  }

  fetchData=()=> {

    let url = '/' + config.urlSuffix + '/api/getIndexCount2';
    let params = {
      match: {},
      group:{_id:"$model_id",count:{$sum:1}}
    };
    this.props.updateBindingData('getCount', {url: url, data: params}, (item) => {
      // console.log(item.data);
      if (item.status == 200) {
        let piedata=[]
        item.data.map(function (v,i) {
          let tmp={item:v["model"],count:v["result"]}
          piedata.push(tmp)
        });
        // console.log(piedata)
        this.setState({
          SourceData: item.data,
          PieData:piedata
        });

      }

    });
  };


  render() {
    return (
      <IceContainer className={styles.container}>
        <h4 className={styles.title}>模型统计</h4>
        <Row wrap>
          <Col l="10">
            <CustomTable dataSource={this.state.SourceData}/>
          </Col>
          <Col l="14">
            <PirChart dataSource={this.state.PieData}/>
          </Col>
        </Row>
      </IceContainer>
    );
  }
}
