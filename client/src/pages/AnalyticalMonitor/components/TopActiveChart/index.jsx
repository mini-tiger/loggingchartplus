import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Grid, Table, Progress } from '@alifd/next';
import LintChart from './LineChart';
import styles from  './index.module.scss'

const { Row, Col } = Grid;

const activePages = [
  { id: 1, page: '/getting', amount: '2,80,489', percent: 90 },
  { id: 2, page: '/home', amount: '1,98,956', percent: 70 },
  { id: 3, page: '/pricing', amount: '1,90,257', percent: 60 },
  { id: 4, page: '/about', amount: '1,80,745', percent: 50 },
  { id: 5, page: '/blog', amount: '1,24,693', percent: 40 },
  { id: 6, page: '/support', amount: '8,489', percent: 35 },
  { id: 7, page: '/team', amount: '5,233', percent: 30 },
  { id: 8, page: '/faq', amount: '1,688', percent: 20 },
];

const ViewedProducts = [
  {
    id: 1,
    pic: require('./images/img1.jpg'),
    title: 'Apple',
    cate: '超级管理员',
    amount: '38',
  },
  {
    id: 2,
    pic: require('./images/img2.jpg'),
    title: 'Xiaomi',
    cate: '超级管理员',
    amount: '33',
  },
  {
    id: 3,
    pic: require('./images/img3.jpg'),
    title: 'admin',
    cate: '超级管理员',
    amount: '29',
  },
  {
    id: 4,
    pic: require('./images/img4.jpg'),
    title: 'guest',
    cate: '访客',
    amount: '8',
  },
];

export default class TopActiveChart extends Component {
  static displayName = 'TopActiveChart';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  renderProduct = (value, index, record) => {
    return (
      <div className={styles.product}>
        <img src={record.pic} className={styles.productPic} alt="" />
        <p>{record.title}</p>
      </div>
    );
  };

  render() {
    return (
      <Row wrap gutter="20">
        <Col xxs="24" s="12" l="12">
          <IceContainer title="应用系统访问信息">
            <Table
              dataSource={activePages}
              hasBorder={false}
              hasHeader={false}
              className={styles.table}
            >
              <Table.Column title="ID" dataIndex="id" width="5%" />
              <Table.Column title="数据模型" dataIndex="page" />
              <Table.Column title="访问数量" dataIndex="amount" />
              <Table.Column
                title="访问占比"
                dataIndex="page"
                cell={(value, index, record) => (
                  <Progress percent={record.percent} />
                )}
              />
            </Table>
          </IceContainer>
        </Col>
        <Col xxs="24" s="12" l="12">
          <IceContainer title="用户帐号访问信息">
            <Table
              dataSource={ViewedProducts}
              hasBorder={false}
              hasHeader={false}
              className={styles.table}
            >
              <Table.Column
                title="产品"
                dataIndex="title"
                width="20%" 
              />
              <Table.Column title="分类" dataIndex="cate" width="20%" 
               />
              <Table.Column
                title="访问趋势"
                width="40%" 
                cell={() => <LintChart />}
              />
              <Table.Column title="访问数量" dataIndex="amount" width="20%" />
            </Table>
          </IceContainer>
        </Col>
      </Row>
    );
  }
}
