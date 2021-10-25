/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import {Button, Table, Pagination, Tab, Search } from '@alifd/next';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import IceLabel from '@icedesign/label';
import SubCategoryItem from './SubCategoryItem';
import data from './data';
import styles from  './index.module.scss';
import { Link } from 'react-router-dom';
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
          text: '验证通过',
          count: '123',
          type: 'solved',
          subCategories: [
            {
              text: '结构化数据库',
              id: '1',
            },
            {
              text: '成果文档',
              id: '2',
            },
            {
              text: '实时数据',
              id: '3',
            },
            {
              text: '音视频',
              id: '4',
            },
            {
              text: '体数据',
              id: '5',
            },
            {
              text: '地理信息',
              id: '6',
            },
          ],
        },
        {
          text: '验证未通过',
          count: '10',
          type: 'needFix',
          subCategories: [
            {
              text: '结构化数据库',
              id: '1',
            },
            {
              text: '成果文档',
              id: '2',
            },
            {
              text: '实时数据',
              id: '3',
            },
            {
              text: '音视频',
              id: '4',
            },
            {
              text: '体数据',
              id: '5',
            },
            {
              text: '地理信息',
              id: '6',
            },
          ],
        },
        {
          text: '待验证',
          count: '32',
          type: 'needValidate',
          subCategories: [
            {
              text: '结构化数据库',
              id: '1',
            },
            {
              text: '成果文档',
              id: '2',
            },
            {
              text: '实时数据',
              id: '3',
            },
            {
              text: '音视频',
              id: '4',
            },
            {
              text: '体数据',
              id: '5',
            },
            {
              text: '地理信息',
              id: '6',
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
          <img src={record.cover} width={400} height={100} />
        </div>

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
          验证
        </a>
        <a href="#" className={styles.operation} target="_blank">
          授权
        </a>
        <a href="#" className={styles.operation} target="_blank">
          分类
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
            <Table.Column title="数据资源名称" dataIndex="title" width={85} />
            <Table.Column title="业务范围" dataIndex="type" width={85} />
            <Table.Column title="隶属单位" dataIndex="type2" width={85} />
            <Table.Column title="数据资源类型" dataIndex="type3" width={85} />
            <Table.Column title="软件及版本" dataIndex="type4" width={85} />
            <Table.Column title="数据所有者" dataIndex="type5" width={85} />
            <Table.Column title="权限审批者" dataIndex="type6" width={85} />
            <Table.Column
              title="发布时间"
              dataIndex="publishTime"
              width={150}
            />
            <Table.Column
              title="状态"
              dataIndex="publishStatus"
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

