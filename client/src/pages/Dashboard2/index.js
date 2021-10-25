import React, { Component } from 'react';
import RealTimeStatistics from './components/RealTimeStatistics';
import TableChartCard from './components/TableChartCard';
import TableChartCardRight from './components/TableChartCardRight';
import { Grid } from '@alifd/next';
import GeneralTable from './components/GeneralTable';
const { Row, Col } = Grid;
import WellDataList from '../WellData/components/WellDataList';

export default class Dashboard2 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="dashboard2-page">
        <RealTimeStatistics />
        {/* 适用于图表和表格组合的展示场景 */}

        <Row wrap>
          <Col l="10">
            <TableChartCard />
          </Col>
          <Col l="14">
            <TableChartCardRight />
          </Col>
        </Row>
        <Row align={'center'}>
          <Col l="24" align={'center'} >
            <GeneralTable />
          </Col>
        </Row>
          <Row align={'center'}>
              <Col l="24" align={'center'} >
                  <WellDataList />
              </Col>
          </Row>
      </div>
    );
  }
}
