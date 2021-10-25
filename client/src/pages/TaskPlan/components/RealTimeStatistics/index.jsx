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
          <Col xxs="24" s="12" l="6">
            <div className={styles.itemBody1}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>策略配置</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div>
                <h2 className={styles.itemNum}>7,993</h2>
                <div>
                  <p className={styles.total}>7,993</p>
                  <p className={styles.desc}>针对数据源的策略配置</p>
                </div>
              </div>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6">
            <div className={styles.itemBody2}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>计划任务</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div>
                <h2 className={styles.itemNum}>3,112</h2>
                <div>
                  <p className={styles.total}>3,112</p>
                  <p className={styles.desc}>配置计划任务定时触发</p>
                </div>
              </div>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6">
            <div className={styles.itemBody3}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>执行中任务</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <div>
                  <h2 className={styles.itemNum}>98</h2>
                  <p className={styles.desc}>抽取</p>
                </div>
                <div>
                  <h2 className={styles.itemNum}>3</h2>
                  <p className={styles.desc}>解析</p>
                </div>
              </div>
            </div>
          </Col>
          <Col xxs="24" s="12" l="6">
            <div className={styles.itemBody4}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>状态监控</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <div >
                  <h2 className={styles.itemNum}>908Mb</h2>
                  <p className={styles.desc}>累计处理数据</p>
                </div>
                <div>
                  <h2 className={styles.itemNum}>26</h2>
                  <p className={styles.desc}>告警次数</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
