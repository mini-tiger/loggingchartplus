import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Tab } from '@alifd/next';
import CustomTable from './components/CustomTable';
import EditDialog from './components/EditDialog';
import DeleteBalloon from './components/DeleteBalloon';
import data from './data';
import styles from './index.module.scss'
const TabPane = Tab.Item;

const tabs = [
  { tab: '全部', key: 'all' },
  { tab: '已发布', key: 'inreview' },
  { tab: '审核中', key: 'released' },
  { tab: '已拒绝', key: 'rejected' },
];

export default class TabTable extends Component {
  static displayName = 'TabTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: data,
      tabKey: 'all',
    };
    this.columns = [
      {title: '地层',dataIndex: 'title',key: 'title',},
      {title: '层号',dataIndex: 'author',key: '层号',},
      {title: '深度',dataIndex: 'title',key: '深度',},
      {title: '厚度',dataIndex: 'author',key: '厚度',},
      {title: 'GR',dataIndex: 'title',key: 'GR',},
      {title: 'SP',dataIndex: 'author',key: 'SP',},
      {title: 'CAL',dataIndex: 'title',key: 'CAL',},
      {title: 'RXO',dataIndex: 'author',key: 'RXO',},
      {title: 'RI',dataIndex: 'title',key: 'RI',},
      {title: 'DEN',dataIndex: 'author',key: 'DEN',},
      {title: 'CNL',dataIndex: 'title',key: 'CNL',},
      {title: 'AC',dataIndex: 'author',key: 'AC',},
      {title: 'SH',dataIndex: 'title',key: 'SH',},
      {title: 'POR',dataIndex: 'author',key: 'POR',},
      {title: 'SW/FPT',dataIndex: 'title',key: 'SW',},
      {title: '解释结论',dataIndex: 'author',key: '解释结论',},
      {title: '备注',dataIndex: 'author',key: '备注',},
      {
        title: '操作',
        key: 'action',
        render: (value, index, record) => {
          return (
            <span>
              <EditDialog
                index={index}
                record={record}
                getFormValues={this.getFormValues}
              />
              <DeleteBalloon
                handleRemove={() => this.handleRemove(value, index, record)}
              />
            </span>
          );
        },
      },
    ];
  }

  getFormValues = (dataIndex, values) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey][dataIndex] = values;
    this.setState({
      dataSource,
    });
  };

  handleRemove = (value, index) => {
    const { dataSource, tabKey } = this.state;
    dataSource[tabKey].splice(index, 1);
    this.setState({
      dataSource,
    });
  };

  handleTabChange = (key) => {
    this.setState({
      tabKey: key,
    });
  };

  render() {
    const { dataSource } = this.state;
    return (
      <div style={styles.tabtable}>
        <IceContainer>
          <Tab onChange={this.handleTabChange}>
            {tabs.map((item) => {
              return (
                <TabPane title={item.tab} key={item.key}>
                  <CustomTable
                    dataSource={dataSource[this.state.tabKey]}
                    columns={this.columns}
                    hasBorder={false}
                  />
                </TabPane>
              );
            })}
          </Tab>
        </IceContainer>
      </div>
    );
  }
}
