import React, { Component } from 'react';
import RealTimeStatistics from './components/RealTimeStatistics';
import SyncDataList from './components/WellDataList';
import TableChartCardRight from './components/TableChartCardRight';
import { Grid } from '@alifd/next';
import GeneralTable from './components/GeneralTable';
const { Row, Col } = Grid;


export default class SyncData extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="dashboard2-page">
        {/*<RealTimeStatistics />*/}
        {/* 适用于图表和表格组合的展示场景 */}

        <Row wrap>
          <Col l="2"/>
          <Col l="20">
            <SyncDataList />
          </Col>
          <Col l="2"/>
          {/*<Col l="14">*/}
            {/*<TableChartCardRight />*/}
          {/*</Col>*/}
        </Row>
        {/*<Row align={'center'}>*/}
          {/*<Col l="24" align={'center'} >*/}
            {/*<GeneralTable />*/}
          {/*</Col>*/}
        {/*</Row>*/}
      </div>
    );
  }
}
