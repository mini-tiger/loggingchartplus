import React, { Component } from 'react';
import RealTimeStatistics from './components/RealTimeStatistics';
import TabTable from './components/TabTable';
import { Breadcrumb } from '@alifd/next';
export default class TaskPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="task-plan-page">
        <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据汇集</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">任务调度</Breadcrumb.Item>
        </Breadcrumb>
        <RealTimeStatistics />

        <TabTable />
      </div>
    );
  }
}
