import React, { Component } from 'react';
import UserForm from './components/UserForm';
import { Breadcrumb } from '@alifd/next';
export default class DataSourceEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="data-source-edit-page">
        <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据汇集</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">通道管理</Breadcrumb.Item>
        </Breadcrumb>
        <UserForm />
      </div>
    );
  }
}
