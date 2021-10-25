/* eslint global-require: 0 */
import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import IceContainer from '@icedesign/container';
import styles from './index.module.scss';

const { Row, Col } = Grid;

const navigation = [
  {
    // img: require('./images/TB1wdncx1SSBuNjy0FlXXbBpVXa-200-200.png'),
    title: '井数量',
    color: '#f8623b',
    count: '30',
  },
  {
    // img: require('./images/TB1wQD_xYGYBuNjy0FoXXciBFXa-200-200.png'),
    title: '测井曲线',
    color: '#5798F2',
    count: '85',
  },
  {
    // img: require('./images/TB1o2c3x4GYBuNjy0FnXXX5lpXa-200-200.png'),
    title: '解释成果',
    color: '#475F93',
    count: '185',
  },
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

