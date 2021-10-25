
import React, { Component } from 'react';
import { Table, Progress, Pagination } from '@alifd/next';
import IceContainer from '@icedesign/container';
import styles from  './index.module.scss'

const getTableData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      name: 'A旗舰店',
      total: Math.ceil(Math.random() * 1000000),
      count: 300 - index * 10,
      progress: Math.ceil(Math.random() * 100),
    };
  });
};

export default class ProgressTable extends Component {
  static displayName = 'ProgressTable';

  constructor(props) {
    super(props);

    this.state = {
      dataSource: getTableData(),
      current: 1,
    };
  }

  renderCellProgress = (value) => (
    <Progress percent={parseInt(value, 10)} />
  );

  onPageChange = (pageNo) => {
    this.setState({
      current: pageNo,
    });
  };

  render() {
    return (
      <div className="progress-table">
        <IceContainer className="tab-card" title="任务统计">
          <Table
            getRowClassName={(record, index) => {
              return {
                className: `progress-table-tr progress-table-tr${index}`
              };
            }}
            dataSource={this.state.dataSource}
          >
            <Table.Column title="任务名称" dataIndex="name" width={200} />
            <Table.Column title="解释名称" dataIndex="total" width={200} />
            <Table.Column title="井数 " dataIndex="count" width={100} />
            <Table.Column
              title="所处阶段"
              dataIndex="progress"
              cell={this.renderCellProgress}
              width={200}
            />
          </Table>
          <div className={styles.paginationWrapper}>
            <Pagination
              current={this.state.current}
              onChange={this.onPageChange}
              shape="arrow-only"
            />
          </div>
        </IceContainer>
      </div>
    );
  }
}
