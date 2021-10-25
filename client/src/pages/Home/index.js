import React, { Component } from 'react';
import IndustryBanner from './components/IndustryBanner';
import OverviewBoard from './components/OverviewBoard';
import ProgressTable from './components/ProgressTable';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="home-page">
        {/* 行业专区的图文介绍 */}
        <IndustryBanner />
        {/* 卡片形式的概览数据 */}
        <OverviewBoard />
        {/* 进度条表格 */}
        <ProgressTable />
      </div>
    );
  }
}
