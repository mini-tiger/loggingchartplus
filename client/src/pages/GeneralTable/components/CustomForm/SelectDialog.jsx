import React, { Component } from 'react';
import { Pagination,Table,Dialog, Button, Form, Input, Field } from '@alifd/next';
import IceLabel from '@icedesign/label';
import { Message } from '@alifd/next';
import DataBinder from '@icedesign/data-binder';
const FormItem = Form.Item;
import config from "../../../../../config"

@DataBinder({
  newConfig: {
    url: '/' +config.urlSuffix+'/crud/cjxzs/crud_field/new',
    method:'post',
  },
  unInitTable: {
    url: '/' +config.urlSuffix+'/crud/cjxzs/crud_field/unInit',
    method:'post',
  },
  read: {
    method: 'post',
  },
})
export default class SelectDialog extends Component {
  static displayName = 'SelectDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      dataSource:[],
      isLoading: false,
    };
    this.field = new Field(this);
    this.fetchData = this.fetchData.bind(this);
    this.renderCols=this.renderCols.bind(this);
  }

  fetchData = (p) => {
    let params = Object.assign({}, p);
    // 过滤查询条件
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key];
        // moment类型数据
        if(typeof(element.format) == 'function'){
          params[key] = element.format("YYYY-MM-DD HH:mm:ss");
        }
        if(element instanceof Array){
          let v = '',time = [];
          element.map((n,i)=>{
            if(typeof(n.format) == 'function'){
              time.push(n.format("YYYY-MM-DD HH:mm:ss"));
            }
          });

          // 时间区间类型
          if(time.length == 2){
            params[key] = {
              key : 'between',
              value : {
                st : time[0],
                et : time[1]
              }
            }
          }
        }
      }
    }
    let url = '/' +config.urlSuffix+'/crud/' + this.props.item.relation_data + '/read';
    this.props.updateBindingData('read', {url:url,data: params}, (item) => {
      debugger
      this.setState({
        value         :p,
        datasource    :item.data,
        isLoading     :false,
      });
    });
  };

  componentDidMount() {
    //初始化页面配置
    this.fetchData();
  }

  renderCols() {

  }

  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      const { dataIndex } = this.state;
      this.props.updateBindingData('newConfig', {data: values}, (item) => {
        if(item.status == '200'){
          Message.success('提交成功');
          this.setState({
            visible: false,
          });
        }else{
          Message.success('提交失败:'+item.statusText);
        }
      });

    });
  };

  onOpen = (index, record) => {
    this.field.setValues({ ...record });
    this.setState({
      visible: true,
      dataIndex: index,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const init = this.field.init;
    const { index, record } = this.props;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 14,
      },
    };

    return (
      <div style={styles.editDialog}>
        <Button type="primary" onClick={() => this.onOpen(index, record)}>
          选择{this.props.item.field_name}
        </Button>
        <Dialog
          style={{ width: 640 }}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          closeable="esc,mask,close"
          onCancel={this.onClose}
          onClose={this.onClose}
          title="选择数据"
        >
          <Table
            loading={this.state.isLoading}
            dataSource={this.state.datasource.dataList}
            onRowClick={this.onRowClick}
            hasBorder={false}
            className="custom-table"
            style={{minHeight: '500px'}}
          >
            {this.renderCols()}
          </Table>
          <Pagination
            style={styles.pagination}
            current={this.state.datasource.page}
            pageSize={this.state.datasource.pageSize}
            total={this.state.datasource.total}
            onChange={this.handlePagination}
          />
        </Dialog>
      </div>
    );
  }
}

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
    alignSelf:'center'
  },
};
