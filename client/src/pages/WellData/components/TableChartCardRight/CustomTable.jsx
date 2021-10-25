import React, { Component } from 'react';
import { Table } from '@alifd/next';

// MOCK 数据，实际业务按需进行替换
const getData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      model: `模型${index + 1}`,
      result: `1${index}`,
      content: '模型说明',
    };
  });
};

export default class CustomTable extends Component {
  static displayName = 'CustomTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // const dataSource = getData();
    // console.log(this.props.dataSource)
    return (
      <Table dataSource={this.props.dataSource} hasBorder={false}>
        <Table.Column title="模型名称" dataIndex="model" />
        <Table.Column title="解释成果" dataIndex="result" />
        <Table.Column title="模型说明" dataIndex="content" />
      </Table>
    );
  }
}
