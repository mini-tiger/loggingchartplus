import React, { Component } from 'react';
import { Table, Pagination, Balloon, Icon } from '@alifd/next';
import styles from './index.module.scss';
const getData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      id: index + 1,
      orderID: `12022123${index}`,
      name: '张一峰',
      title: '主治医师',
      date: `2018-06-${index + 1}`,
      endDate: `2018-06-${index + 1}`,
      validData: `2018-06-${index + 1}`,
      category: '皮肤科',
      state: '已审核',
      approver: '刘建明',
      approvalData: `2018-06-${index + 1}`,
    };
  });
};

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      dataSource: getData(),
    };
  }

  handlePagination = (current) => {
    this.setState({
      current,
    });
  };

  handleSort = (dataIndex, order) => {
    const dataSource = this.state.dataSource.sort((a, b) => {
      const result = a[dataIndex] - b[dataIndex];
      if (order === 'asc') {
        return result > 0 ? 1 : -1;
      }
      return result > 0 ? -1 : 1;
    });

    this.setState({
      dataSource,
    });
  };

  renderCatrgory = (value) => {
    return (
      <Balloon
        align="lt"
        trigger={<div className={styles.triggerMargin}>{value}</div>}
        closable={false}
        className={styles.balloonLineHeight}
      >
        皮肤科属于外科，主要治疗各种皮肤病，常见皮肤病有牛皮癣 、 疱疹
        、酒渣鼻等
      </Balloon>
    );
  };

  renderState = (value) => {
    return (
      <div>
        <span className={styles.circle} />
        <span className={styles.stateText}>{value}</span>
      </div>
    );
  };

  renderOper = () => {
    return (
      <div>
        <Icon type="edit" size="small" className={styles.editIcon} />
      </div>
    );
  };

  render() {
    const { dataSource } = this.state;
    return (
      <div className={styles.tableContainer}>
        <Table
          dataSource={dataSource}
          onSort={this.handleSort}
          hasBorder={false}
          className="custom-table"
        >
          <Table.Column
            width={100}
            lock="left"
            title="序列号"
            dataIndex="id"
            sortable
            align="center"
          />
          <Table.Column width={100} title="单号" dataIndex="orderID" sortable />
          <Table.Column width={100} title="名称" dataIndex="name" />
          <Table.Column width={100} title="职称" dataIndex="title" />
          <Table.Column width={200} title="入职日期" dataIndex="date" />
          <Table.Column width={200} title="实习结束日期" dataIndex="endDate" />
          <Table.Column
            width={200}
            title="转正生效日期"
            dataIndex="validData"
          />
          <Table.Column
            width={200}
            title="科室"
            dataIndex="category"
            cell={this.renderCatrgory}
          />
          <Table.Column
            width={200}
            title="状态"
            dataIndex="state"
            cell={this.renderState}
          />
          <Table.Column width={200} title="审核人" dataIndex="approver" />
          <Table.Column width={200} title="审核日期" dataIndex="approvalData" />
          <Table.Column
            width={100}
            title="操作"
            cell={this.renderOper}
            lock="right"
            align="center"
          />
        </Table>
        <Pagination
          className={styles.pagination}
          current={this.state.current}
          onChange={this.handlePagination}
        />
      </div>
    );
  }
}

