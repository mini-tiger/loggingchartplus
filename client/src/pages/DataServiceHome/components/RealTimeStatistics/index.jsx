import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import styles from  './index.module.scss'
const { Row, Col } = Grid;

export default class RealTimeStatistics extends Component {
  static displayName = 'RealTimeStatistics';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="real-time-statistics">
        <Row wrap gutter="20">
          <Col xxs="24" s="12" l="8">
            <div className={styles.itemBody1}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>云应用</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <div>
                  <h2 className={styles.itemNum}>98</h2>
                  <p className={styles.desc}>基础数据服务</p>
                </div>
                <div>
                  <h2 className={styles.itemNum}>63</h2>
                  <p className={styles.desc}>主题数据服务</p>
                </div>
                <div>
                  <h2 className={styles.itemNum}>263</h2>
                  <p className={styles.desc}>应用数据服务</p>
                </div>
              </div>
            </div>
          </Col>
          <Col xxs="24" s="12" l="8">
            <div className={styles.itemBody2}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>传统应用</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <div>
                  <h2 className={styles.itemNum}>98</h2>
                  <p className={styles.desc}>数据推送</p>
                </div>
                <div>
                  <h2 className={styles.itemNum}>63</h2>
                  <p className={styles.desc}>数据投影</p>
                </div>
                <div>
                  <h2 className={styles.itemNum}>263</h2>
                  <p className={styles.desc}>数据接口</p>
                </div>
              </div>
            </div>
          </Col>
          <Col xxs="24" s="12" l="8">
            <div className={styles.itemBody3}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>AI智能应用</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <div>
                  <h2 className={styles.itemNum}>908</h2>
                  <p className={styles.desc}>特征工程</p>
                </div>
                <div>
                  <h2 className={styles.itemNum}>263</h2>
                  <p className={styles.desc}>推理</p>
                </div>
              </div>
            </div>
          </Col>

        </Row>
      </div>
    );
  }
}
