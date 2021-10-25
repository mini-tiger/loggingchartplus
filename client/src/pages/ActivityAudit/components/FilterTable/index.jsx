/* eslint no-underscore-dangle: 0 */
import React, { Component } from 'react';
import { Table, Pagination } from '@alifd/next';
import IceContainer from '@icedesign/container';
import IceLabel from '@icedesign/label';
import FilterForm from './Filter';
import data from './data';
import styles from './index.module.scss';

export default class EnhanceTable extends Component {
  renderTitle = (value, index, record) => {
    return (
      <div className={styles.titleWrapper}>
        <span className={styles.title}>{record.title}</span>
      </div>
    );
  };

  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    return (
      <div
        className="filter-table-operation"
        className={styles.filterTableOperation}
      >
        <a
          href="#"
          className={styles.operationItem}
          target="_blank"
          onClick={this.editItem.bind(this, record)}
        >
          审核通过
        </a>
        <a href="#" className={styles.operationItem} target="_blank">
          审核不通过
        </a>
        <a href="#" className={styles.operationItem} target="_blank">
          详情
        </a>
      </div>
    );
  };

  renderStatus = (value) => {
    return (
      <IceLabel inverse={false} status="default">
        {value}
      </IceLabel>
    );
  };

  render() {
    return (
      <div className="filter-table">
        <IceContainer title="活动审核">
          <FilterForm
            onChange={this.filterFormChange}
            onSubmit={this.filterTable}
            onReset={this.resetFilter}
          />
        </IceContainer>
        <IceContainer>
          <Table
            dataSource={data}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
          >
            <Table.Column
              title="序号"
              width={30}
              dataIndex="id"
            />
            <Table.Column
              title="姓名"
              cell={this.renderTitle}
              width={50}
            />
            <Table.Column title="教育ID" dataIndex="type" width={85} />
            <Table.Column
              title="活动类型"
              dataIndex="type2"
              width={150}
            />
            <Table.Column
              title="活动分类"
              dataIndex="publishStatus"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="活动时间"
              dataIndex="publishTime"
              width={85}
              cell={this.renderStatus}
            />
                        <Table.Column
              title="活动状态"
              dataIndex="pushStatus"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={150}
              cell={this.renderOperations}
            />
          </Table>
          <div className={styles.paginationWrapper}>
            <Pagination />
          </div>
        </IceContainer>
      </div>
    );
  }
}
