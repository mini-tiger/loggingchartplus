import React, { Component } from 'react';
import ComplexTabTable from './components/ComplexTabTable';
import { Breadcrumb } from '@alifd/next';

export default class DataSource extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="data-source-page">
        <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据汇集</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据源注册</Breadcrumb.Item>
        </Breadcrumb>
        {/* 附带复杂的 Tab 多级筛选项的表格 */}
        <ComplexTabTable />
      </div>
    );
  }
}
