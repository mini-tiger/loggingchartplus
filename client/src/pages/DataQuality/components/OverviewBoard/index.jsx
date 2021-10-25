/* eslint global-require: 0 */
import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';

const { Row, Col } = Grid;

const navigation = [
  {
    img: require('./images/TB1wdncx1SSBuNjy0FlXXbBpVXa-200-200.png'),
    title: '数据质检规则',
    color: '#f8623b',
    count: '230',
  },
  {
    img: require('./images/TB11ED_xYGYBuNjy0FoXXciBFXa-200-200.png'),
    title: '数据质量任务',
    color: '#37D1AB',
    count: '120',
  },
  {
    img: require('./images/TB1Kvg3x4GYBuNjy0FnXXX5lpXa-200-200.png'),
    title: '数据质量评估',
    color: '#ffa001',
    count: '160',
  },
  {
    img: require('./images/TB1aAH_xYGYBuNjy0FoXXciBFXa-200-200.png'),
    title: '数据质量发布',
    color: '#42C0EA',
    count: '69',
  }
];

export default class OverviewBoard extends Component {
  static displayName = 'OverviewBoard';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row wrap gutter={20}>
        {navigation.map((item, index) => {
          return (
            <Col xxs="12" l="6" key={index}>
              <IceContainer style={{ background: item.color }}>
                <div className={styles.navItem}>
                  <div className={styles.imgWrap}>
                    <img src={item.img} alt="" className={styles.img} />
                  </div>
                  <div className={styles.infoWrap}>
                    <p className={styles.count}>{item.count}</p>
                    <h5 className={styles.title}>{item.title}</h5>
                  </div>
                </div>
              </IceContainer>
            </Col>
          );
        })}
      </Row>
    );
  }
}

