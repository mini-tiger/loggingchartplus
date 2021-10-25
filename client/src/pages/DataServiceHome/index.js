import React, { Component } from 'react';
import RealTimeStatistics from './components/RealTimeStatistics';
import ComplexTabTable from './components/ComplexTabTable';
import { Tab } from '@alifd/next';
import { Breadcrumb } from '@alifd/next';
export default class DataServiceHome extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="data-service-home-page">
        <Breadcrumb separator="/">
            <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
            <Breadcrumb.Item link="javascript:void(0);">数据服务</Breadcrumb.Item>
        </Breadcrumb>
        <RealTimeStatistics />

            <Tab>
              <Tab.Item title="服务发布" key="1">
              <ComplexTabTable/>
              </Tab.Item>
              <Tab.Item title="服务申请" key="2">
              <ComplexTabTable/>
              </Tab.Item>
              <Tab.Item title="服务浏览" key="3">
                <ComplexTabTable/>
              </Tab.Item>
            </Tab>

      </div>
    );
  }
}
