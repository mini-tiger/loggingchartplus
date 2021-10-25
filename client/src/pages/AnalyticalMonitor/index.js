import React, { Component } from 'react';
import OverviewSatesChart from './components/OverviewSatesChart';
import RealTimeData from './components/RealTimeData';
import TopActiveChart from './components/TopActiveChart';
import { Breadcrumb } from '@alifd/next';
export default class AnalyticalMonitor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="analytical-monitor-page">
        <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据汇集</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">解析监控</Breadcrumb.Item>
        </Breadcrumb>
        <OverviewSatesChart />
        <RealTimeData />

        <TopActiveChart />
      </div>
    );
  }
}
