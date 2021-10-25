import React, { Component } from 'react';
import OverviewBoard from './components/OverviewBoard';
import UserTrafficStastistics from './components/UserTrafficStastistics';
import ModelCards from './components/ModelCards';
import ComplexTabTable from './components/ComplexTabTable';
import { Tab } from '@alifd/next';
import { Breadcrumb } from '@alifd/next';

export default class DataResource extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
      <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据管控</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据资源管理</Breadcrumb.Item>
      </Breadcrumb>

      <Tab>
        <Tab.Item title="数据湖地图" key="1">
          <OverviewBoard />
          <UserTrafficStastistics />
        </Tab.Item>
        <Tab.Item title="数据资源发布" key="2">
          <ModelCards />
        </Tab.Item>
        <Tab.Item title="数据资源检索" key="3">
          <ComplexTabTable />
        </Tab.Item>
      </Tab>
      </div>
    );
  }
}
