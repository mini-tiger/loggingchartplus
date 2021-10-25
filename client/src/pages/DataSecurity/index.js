import React, { Component } from 'react';
import BasicTab from './components/BasicTab';
import RealTimeData from './components/RealTimeData';
import BoardList from './components/BoardList';
import { Tab } from '@alifd/next';
import IceContainer from '@icedesign/container';
import ComplexTabTable from './components/ComplexTabTable';
import { Breadcrumb } from '@alifd/next';

export default class DataSecurity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="basic-tab">
      <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据管控</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据安全管理</Breadcrumb.Item>
      </Breadcrumb>
      <IceContainer >
        <Tab>
          <Tab.Item title="数据访问安全" key="1">
          <RealTimeData />
          </Tab.Item>
          <Tab.Item title="数据安全授权" key="2">
            <BoardList />
          </Tab.Item>
          <Tab.Item title="数据访问历史" key="3">
            <ComplexTabTable/>
          </Tab.Item>
        </Tab>
      </IceContainer>
      </div>
    );
  }
}
