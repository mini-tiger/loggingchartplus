import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid } from '@alifd/next';
import styles from  './index.module.scss'
import SplineChart from './SplineChart';

const { Row, Col } = Grid;

const totalData = [
  {
    label: '访问量',
    value: '55464',
  },
  {
    label: '审核通过量',
    value: '24717',
  },
  {
    label: '身份认证',
    value: '4274',
  },
  {
    label: '黑白名单',
    value: '689',
  },
];

const todayData = [
  {
    label: '访问攻击',
    value: '7995',
    img: require('./images/count.png'),
  },
  {
    label: '下载超量',
    value: '1002',
    img: require('./images/repo.png'),
  },
  {
    label: 'SQL注入',
    value: '735',
    img: require('./images/user.png'),
  },
  {
    label: '危险字符处理',
    value: '55',
    img: require('./images/builder.png'),
  },
];

export default class RealTimeData extends Component {
  static displayName = 'RealTimeData';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row gutter="20">
        <Col l="12">
          <IceContainer>
            <h4 className={styles.cardTitle}>实时访问数</h4>
            <SplineChart />
          </IceContainer>
        </Col>
        <Col l="12">
          <IceContainer>
            <h4 className={styles.cardTitle}>访问数据</h4>
            <Row wrap gutter="10">
              {totalData.map((item, index) => {
                return (
                  <Col key={index}>
                    <div className={styles.totalCard}>
                      <div className={styles.label}>{item.label}</div>
                      <div className={styles.value}>{item.value}</div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </IceContainer>
          <IceContainer>
            <h4 className={styles.cardTitle}>攻击数据</h4>
            <Row wrap gutter="10">
              {todayData.map((item, index) => {
                return (
                  <Col key={index}>
                    <div className={styles.todayCard}>
                      <img src={item.img} alt="" className={styles.todayCardIcon} />
                      <div>
                        <div className={styles.label}>{item.label}</div>
                        <div className={styles.value}>{item.value}</div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </IceContainer>
        </Col>
      </Row>
    );
  }
}
