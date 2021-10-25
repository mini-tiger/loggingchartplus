import React, { Component } from 'react';
import { Table,Pagination } from '@alifd/next';

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
    this.state = {
      current:1
    };
  }
  handlePagination = (current) => {
    this.setState(
        {
          current,
        },
        () => {
          this.props.fetchDataPage(current);
        }
    );
  };
  render() {
    // const dataSource = getData();
    // console.log(this.props.dataSource)
    let datasource=this.props.dataSource;

    return (
        <div>
      <Table dataSource={this.props.SourceDataPage} hasBorder={false}>
        <Table.Column title="模型名称" dataIndex="model" />
        <Table.Column title="解释成果" dataIndex="result" />
        <Table.Column title="模型说明" dataIndex="content" />
      </Table>
          <Pagination
              style={styles.pagination}
              current={this.state.current}
              pageSize={this.props.pagesize}
              total={this.props.dataSource.length}
              onChange={this.handlePagination}
          />
        </div>
    );
  }
}

const styles = {
  pagination: {
    margin: '20px 0',
    textAlign: 'center',
  },
};
