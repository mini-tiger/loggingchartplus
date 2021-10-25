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
  { tab: '策略配置', key: 'all' },
  { tab: '计划任务', key: 'inreview' },
  { tab: '执行中任务', key: 'released' },
  { tab: '状态监控', key: 'rejected' },
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
      {
        title: '通道名称',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '触发策略',
        dataIndex: 'type1',
        key: 'author',
      },
      {
        title: '全量/增量',
        dataIndex: 'type2',
        key: 'author',
      },
      {
        title: '任务间隔',
        dataIndex: 'type3',
        key: 'author',
      },
      {
        title: '配置状态',
        dataIndex: 'status',
        key: 'status',
      },
      {
        title: '发布时间',
        dataIndex: 'date',
        key: 'date',
      },
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
