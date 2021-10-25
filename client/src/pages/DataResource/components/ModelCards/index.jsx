import React, { Component } from 'react';
import { Grid, Icon } from '@alifd/next';
import styles from './index.module.scss';

const { Row, Col } = Grid;

const getData = () => {
  return Array.from({ length: 4 }).map((item, index) => {
    return {
      title: `测井处理曲线 0${index + 1}`,
      body: [
        {
          label: '已有数据量',
          value: `3238.${index + 1}`,
        },
        {
          label: '应有数据量',
          value: `123,23${index}`,
        },
        {
          label: '齐全率',
          value: '98%',
        },
        {
          label: '规范率',
          value: '75%',
        },
        {
          label: '更新时间',
          value: '2019-10-20',
        },
        {
          label: '发布人',
          value: '张三',
        },
        {
          label: '相关备注',
          value: '无',
        },
      ],
    };
  });
};

export default class ModelCards extends Component {
  static displayName = 'ModelCards';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const mockData = getData();
    return (
      <Row wrap gutter="40" className={styles.row}>
        {mockData.map((data, index) => {
          return (
            <Col l="6" key={index}>
              <div className={styles.modelCards}>
                <div className={styles.head}>
                  <Icon type="electronics" className={styles.icon} /> {data.title}
                </div>
                <div className={styles.body}>
                  {data.body.map((item, key) => {
                    return (
                      <div className={styles.item} key={key}>
                        <span className={styles.label}>{item.label}：</span>
                        <span className={styles.value}>{item.value}</span>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.footer}>
                  <a className={styles.lightBlue }>
                    调用示例
                  </a>
                  <a className={styles.green }>发布</a>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    );
  }
}

