import React, { Component } from 'react';
import { Table } from '@alifd/next';

// MOCK 数据，实际业务按需进行替换
const getData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      type: `${index + 1}`,
      total: `2${index}`,
    };
  });
};

export default class CustomTable extends Component {
  static displayName = 'CustomTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    // const dataSource = getData();

    return (
      <Table dataSource={this.props.dataSource} hasBorder={false}>
        <Table.Column title="任务类型" dataIndex="item" />
        <Table.Column title="数量" dataIndex="count" />
      </Table>
    );
  }
}
