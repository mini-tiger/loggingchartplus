import React, { Component } from 'react';
import BizchartsG2TestCase from './components/BizchartsG2TestCase';
import { Breadcrumb } from '@alifd/next';
export default class DataMain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="data-main-page">
         <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据管控</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">主数据管理</Breadcrumb.Item>
        </Breadcrumb>
        {/* Bizhcarts basic charts */}
        <BizchartsG2TestCase />
      </div>
    );
  }
}
