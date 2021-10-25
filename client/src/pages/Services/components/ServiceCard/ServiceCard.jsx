import React, { Component } from 'react';
import { Grid, Icon,Button } from '@alifd/next';
import IceContainer from '@icedesign/container';
import { Link } from 'react-router-dom';

const { Row, Col } = Grid;

// MOCK 数据，实际业务按需进行替换
const getData = () => {
  return Array.from({ length: 10 }).map(() => {
    return {
      name: '任务名称',
      desc: '这里是一段相关的任务简介，介绍任务的数据源、配置等',
      tag: '结构化数据',
    };
  });
};
const getData2 = () => {
  return [
    {
      name: '任务名称',
      desc: '这里是一段相关的任务简介，介绍任务的数据源、配置等',
      tag: '结构化数据',
    },
    {
      name: '任务名称',
      desc: '这里是一段相关的任务简介，介绍任务的数据源、配置等',
      tag: '成果文档',
    },
    {
      name: '任务名称',
      desc: '这里是一段相关的任务简介，介绍任务的数据源、配置等',
      tag: '实时数据',
    },
    {
      name: '任务名称',
      desc: '这里是一段相关的任务简介，介绍任务的数据源、配置等',
      tag: '体数据',
    },
    {
      name: '任务名称',
      desc: '这里是一段相关的任务简介，介绍任务的数据源、配置等',
      tag: '地理信息',
    },
  ]
};

export default class ServiceCard extends Component {
  static displayName = 'ServiceCard';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const mockData = getData2();
    return (
      <div style={{margin: '20px 0',textAlign: 'right',}}>
      <Button
        style={{ marginRight: '10px' }}
        
      >
        创建任务
      </Button>
      <Button type="primary" onClick={this.handleClick}>
        授权管理
      </Button>
      
      <Row wrap gutter="20">
        {mockData.map((item, index) => {
          return (
            <Col l="8" key={index}>
              <IceContainer style={styles.container}>
                <div style={styles.body}>
                  <h5 style={styles.name}>{item.name}</h5>
                  <p style={styles.desc}>{item.desc}</p>
                  <div style={styles.tag}>{item.tag}</div>
                </div>
                <div style={styles.footer}>
                  <Link
                    to="/activities"
                    style={{ ...styles.link, ...styles.line }}
                  >
                    <Icon type="office" size="small" style={styles.icon} />{' '}
                    项目状态
                  </Link>
                  <Link to="/home" style={styles.link}>
                    <Icon type="box" size="small" style={styles.icon} />
                    结果修正
                  </Link>
                  <Link to="/home" style={styles.link}>
                    <Icon type="box" size="small" style={styles.icon} />
                    成果导出
                  </Link>
                </div>
              </IceContainer>
            </Col>
          );
        })}
      </Row>
      </div>
    );
  }
}

const styles = {
  container: {
    padding: '0',
  },
  body: {
    padding: '20px',
    height: '120px',
    position: 'relative',
    borderBottom: '1px solid #f0f0f0',
  },
  name: {
    margin: '0',
    padding: '0',
    height: '28px',
    lineHeight: '28px',
    fontSize: '16px',
    color: '#0d1a26',
  },
  desc: {
    fontSize: '14px',
    color: '#697b8c',
    margin: '12px 0',
  },
  tag: {
    background: 'rgb(244, 244, 244)',
    color: 'rgb(102, 102, 102)',
    position: 'absolute',
    right: '20px',
    top: '20px',
    padding: '4px 12px',
    textAlign: 'center',
    borderRadius: '50px',
    fontSize: '12px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  link: {
    height: '56px',
    lineHeight: '56px',
    color: '#314659',
    cursor: 'pointer',
    textDecoration: 'none',
    width: '50%',
    textAlign: 'center',
  },
  line: {
    borderRight: '1px solid #f0f0f0',
  },
  icon: {
    marginRight: '5px',
  },
};
