import React, { Component } from 'react';
import OverviewBoard from './components/OverviewBoard';
import TabTable from './components/TabTable';
import { Breadcrumb } from '@alifd/next';
export default class DataQuality extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="data-quality-page">
        <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据管控</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据质量管理</Breadcrumb.Item>
        </Breadcrumb>
        {/* 卡片形式的概览数据 */}
        <OverviewBoard />

        <TabTable />
      </div>
    );
  }
}
