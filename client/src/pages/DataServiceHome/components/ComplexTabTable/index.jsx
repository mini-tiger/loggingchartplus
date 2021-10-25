/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search } from '@alifd/next';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import IceLabel from '@icedesign/label';
import SubCategoryItem from './SubCategoryItem';
import data from './data';
import styles from  './index.module.scss';

export default class Index extends Component {
  static displayName = 'Index';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      isMobile: false,
      currentTab: 'solved',
      currentCategory: '1',
      tabList: [
        {
          text: '生产运行优化',
          count: '123',
          type: 'solved',
          subCategories: [
            {
              text: '井位部署',
              id: '1',
            },
            {
              text: '井设计',
              id: '2',
            },
            {
              text: '建井',
              id: '3',
            },
            {
              text: '交井',
              id: '4',
            },
            {
              text: '钻后评价',
              id: '5',
            },
            {
              text: '油气田生产',
              id: '6',
            },
            {
              text: '分析化验',
              id: '7',
            },
            {
              text: '弃井',
              id: '8',
            },
          ],
        },
        {
          text: '单井管理',
          count: '10',
          type: 'needFix',
          subCategories: [
            {
              text: '西北',
              id: '21',
            },
            {
              text: '普光',
              id: '22',
            },
          ],
        },
        {
          text: '管网管理',
          count: '32',
          type: 'needValidate',
          subCategories: [
            {
              text: '油气藏动态',
              id: '34',
            },
            {
              text: '单井管理',
              id: '35',
            },
            {
              text: '管网管理',
              id: '36',
            },
            {
              text: '石油工程远程作业',
              id: '37',
            },
            {
              text: '生产运行优化',
              id: '38',
            },
            {
              text: '一体化生产指挥',
              id: '39',
            },
          ],
        },
      ],
    };
  }

  renderTitle = (value, index, record) => {
    return (
      <div className={styles.titleWrapper}>
        <div>
          <IceImg src={record.cover} width={48} height={48} />
        </div>
        <span className={styles.title}>{record.title}</span>
      </div>
    );
  };

  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    return (
      <div className={styles.complexTabTableOperation}>
        <a
          href="#"
          className={styles.operation}
          target="_blank"
          onClick={this.editItem.bind(this, record)}
        >
          申请服务授权
        </a>
        <a href="#" className={styles.operation} target="_blank">
          详情
        </a>
      </div>
    );
  };

  renderStatus = (value) => {
    return (
      <IceLabel inverse={false} status="default">
        {value}
      </IceLabel>
    );
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;

    this.fetchData();
  };

  onTabChange = (tabKey) => {
    const firstTabCatId = this.state.tabList.find((item) => {
      return item.type === tabKey;
    }).subCategories[0].id;

    this.setState({
      currentTab: tabKey,
      currentCategory: firstTabCatId,
    });
    this.queryCache.catId = firstTabCatId;
    this.fetchData();
  };

  onSubCategoryClick = (catId) => {
    this.setState({
      currentCategory: catId,
    });
    this.queryCache.catId = catId;
    this.fetchData();
  };

  renderTabBarExtraContent = () => {
    return (
      <div className={styles.tabExtra}>
        <Search
          className={styles.search}
          type="secondary"
          placeholder="搜索"
          searchText=""
          onSearch={this.onSearch}
        />
      </div>
    );
  };

  render() {
    const { tabList } = this.state;

    return (
      <div className={styles.complexTabTable}>
        <IceContainer>
          <Tab
            onChange={this.onTabChange}
            shape="bar"
            currentTab={this.state.currentTab}
            contentStyle={{
              padding: 0,
            }}
            extra={
              !this.state.isMobile ? this.renderTabBarExtraContent() : null
            }
          >
            {tabList && tabList.length > 0
              ? tabList.map((tab) => {
                  return (
                    <Tab.Item
                      key={tab.type}
                      title={
                        <span>
                          {tab.text}
                          <span className={styles.tabCount}>{tab.count}</span>
                        </span>
                      }
                    >
                      {tab.subCategories && tab.subCategories.length > 0
                        ? tab.subCategories.map((catItem, index) => {
                            return (
                              <SubCategoryItem
                                {...catItem}
                                isCurrent={
                                  catItem.id === this.state.currentCategory
                                }
                                onItemClick={this.onSubCategoryClick}
                                key={index}
                              />
                            );
                          })
                        : null}
                    </Tab.Item>
                  );
                })
              : null}
          </Tab>
        </IceContainer>
        <IceContainer>
          <Table
            dataSource={data}
            className={`basic-table ${styles.basicTable}`}
            hasBorder={false}
          >
            <Table.Column
              title="数据集名称"
              cell={this.renderTitle}
              width={320}
            />
            <Table.Column title="分类" dataIndex="type" width={85} />
            <Table.Column
              title="发布时间"
              dataIndex="publishTime"
              width={150}
            />
            <Table.Column
              title="已有数据量"
              dataIndex="count1"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="应有数据量"
              dataIndex="count2"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="已有对象数"
              dataIndex="count3"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="应有对象数"
              dataIndex="count4"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="齐全率"
              dataIndex="count5"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="规范率"
              dataIndex="count6"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={150}
              cell={this.renderOperations}
            />
          </Table>
          <div className={styles.pagination}>
            <Pagination />
          </div>
        </IceContainer>
      </div>
    );
  }
}

