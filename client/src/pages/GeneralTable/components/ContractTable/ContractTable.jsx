import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message } from '@alifd/next';
import CustomTable from '../CustomTable';

export default class ContractTable extends Component {
  static displayName = 'ContractTable';

  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.renderState = this.renderState.bind(this);
    this.renderOper = this.renderOper.bind(this);
  }
  handleUpdate = () => {
    Message.success('暂不支持修改合同');
  };

  handleMore = () => {
    Message.success('暂不支持查看详情');
  };

  renderState = (value) => {
    return (
      <div style={styles.state}>
        <span style={styles.stateText}>{value}</span>
      </div>
    );
  };

  renderOper = () => {
    return (
      <div>
        <a style={styles.link} onClick={this.handleUpdate}>
          修改合同
        </a>
        <span style={styles.separator} />
        <a style={styles.link} onClick={this.handleMore}>
          查看详情
        </a>
      </div>
    );
  };

  render() {
    return <CustomTable {...this.props}  />;
  }
};
const styles = {
  stateText: {
    display: 'inline-block',
    padding: '5px 10px',
    color: '#52c41a',
    background: '#f6ffed',
    border: '1px solid #b7eb8f',
    borderRadius: '4px',
  },
  link: {
    margin: '0 5px',
    color: 'rgba(49, 128, 253, 0.65)',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  separator: {
    margin: '0 8px',
    display: 'inline-block',
    height: '12px',
    width: '1px',
    verticalAlign: 'middle',
    background: '#e8e8e8',
  },
};
