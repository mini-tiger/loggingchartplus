import React, { Component } from 'react';
import DownloadCard from './components/DownloadCard';
import { Breadcrumb } from '@alifd/next';
export default class Channel extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="channel-page">
        <Breadcrumb separator="/">
          <Breadcrumb.Item link="javascript:void(0);">Home</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">数据汇集</Breadcrumb.Item>
          <Breadcrumb.Item link="javascript:void(0);">通道管理</Breadcrumb.Item>
        </Breadcrumb>
        {/* 下载型信息卡片 */}
        <DownloadCard />
      </div>
    );
  }
}
