import React, { Component } from 'react';
import RealTimeData from './components/RealTimeData';
import BizchartsG2TestCase from './components/BizchartsG2TestCase';
import { Breadcrumb } from '@alifd/next';
export default class DataCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="data-collection-page">
        <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据汇集</Breadcrumb.Item>
        </Breadcrumb>
        {/* 基于 highcharts 的动态数据展示区块 */}
        <RealTimeData />
        {/* Bizhcarts basic charts */}
        <BizchartsG2TestCase />
      </div>
    );
  }
}
