import React, { Component } from 'react';
import { Grid } from '@alifd/next';
import styles from  './index.module.scss'
const { Row, Col } = Grid;
import DataBinder from '@icedesign/data-binder';
import config from '../../../../../config'
@DataBinder({

  getcount: {
    method: 'post',
  },
})
export default class RealTimeStatistics extends Component {
  static displayName = 'RealTimeStatistics';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      jhcount:0, // 测井数
      qxwjmcount:0, //测井曲线
      taskcount:0,
      templatecount:0,
      piccount:0
    };
    this.fetchData = this.fetchData.bind(this);
  }


  componentDidMount() {
    this.fetchData()
  }

  fetchData=()=>{

    let url ='/' + config.urlSuffix + '/api/getFieldCount';
    let params={field:"JH"}
    this.props.updateBindingData('getcount', {url:url,data: params}, (item) => {
      // console.log(item);
      if (item.status==200){
        this.setState({
          jhcount  :item.data.count,
        });
      }

    });
    params["field"]="QXWJM"
    this.props.updateBindingData('getcount', {url:url,data: params}, (item) => {
      // console.log(item);
      if (item.status==200){
        this.setState({
          qxwjmcount  :item.data.count,
        });
      }

    });

    url = '/' + config.urlSuffix + '/api/getTableCount';
    this.props.updateBindingData('getcount', {url:url,data: {tablename:"task"}}, (item) => {
      // console.log(1111,item);
      if (item.status==200){
        this.setState({
          taskcount  :item.data.result,
        });
      }

    });

    url = '/' + config.urlSuffix + '/api/getdistinct';
    this.props.updateBindingData('getcount', {url:url,data: {tablename:"model_config",field:"model_name"}}, (item) => {
      // console.log(1111,item);
      if (item.status==200){
        this.setState({
          templatecount  :item.data.length,
        });
      }

    });
    url = '/' + config.urlSuffix + '/api/getcount';
    this.props.updateBindingData('getcount', {url:url,data: {tablename:"model_config",field:"model_name"}}, (item) => {
      // console.log(1111,item);
      if (item.status==200){
        this.setState({
          piccount  :item.data,
        });
      }

    });
};

  render() {
    return (
      <div className="real-time-statistics">
        <Row wrap gutter="20">
          <Col xxs="24" s="12" l="8">
            <div className={styles.itemBody1}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>井数</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <h2 className={styles.itemNum}>{this.state.jhcount}</h2>
                <div>
                  <h2 className={styles.itemNum}>0</h2>
                  <p className={styles.desc}>本周新增</p>
                </div>
              </div>
            </div>
          </Col>
          <Col xxs="24" s="12" l="8">
            <div className={styles.itemBody2}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>测井文件</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <h2 className={styles.itemNum}>{this.state.qxwjmcount}</h2>
                <div>
                  <h2 className={styles.itemNum}>0</h2>
                  <p className={styles.desc}>本周新增</p>
                </div>
              </div>
            </div>
          </Col>
          <Col xxs="24" s="12" l="8">
            <div className={styles.itemBody3}>
              <div className={styles.itemTitle}>
                <p className={styles.titleText}>解释成果</p>
                <span className={styles.tag}>实时</span>
              </div>
              <div className={styles.itemRow}>
                <h2 className={styles.itemNum}>{this.state.taskcount}</h2>
                <div>
                  <h2 className={styles.itemNum}>0</h2>
                  <p className={styles.desc}>本周新增</p>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      <Row wrap gutter="20">
        <Col xxs="24" s="12" l="8">
          <div className={styles.itemBody4}>
            <div className={styles.itemTitle}>
              <p className={styles.titleText}>模型数</p>
              <span className={styles.tag}>实时</span>
            </div>
            <div className={styles.itemRow}>
              <h2 className={styles.itemNum}>{this.state.templatecount}</h2>
              <div>
                <h2 className={styles.itemNum}>0</h2>
                <p className={styles.desc}>本周新增</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xxs="24" s="12" l="8">
          <div className={styles.itemBody5}>
            <div className={styles.itemTitle}>
              <p className={styles.titleText}>图版数</p>
              <span className={styles.tag}>实时</span>
            </div>
            <div className={styles.itemRow}>
              <h2 className={styles.itemNum}>{this.state.piccount}</h2>
              <div>
                <h2 className={styles.itemNum}>0</h2>
                <p className={styles.desc}>本周新增</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      </div>
    );
  }
}
