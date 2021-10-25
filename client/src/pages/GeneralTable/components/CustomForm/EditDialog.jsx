import React, { Component } from 'react';
import { Select,Dialog, Button, Form, Input, Field } from '@alifd/next';
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
})
export default class EditDialog extends Component {
  static displayName = 'EditDialog';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataIndex: null,
      dataSource:[],
    };
    this.field = new Field(this);
  }

  componentDidMount() {
    //初始化页面配置
    if(this.props.isConfig){
      this.props.updateBindingData('unInitTable', {}, (item) => {
        this.setState({
          dataSource:item.data
        });
      });
    }
  }


  handleSubmit = () => {
    this.field.validate((errors, values) => {
      if (errors) {
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
      window.location.reload()
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
    if(this.props.isConfig){
      return (
        <div style={styles.editDialog}>
          <Button type="primary" onClick={() => this.onOpen(index, record)}>
            添加模块
          </Button>
          <Dialog
            style={{ width: 640 }}
            visible={this.state.visible}
            onOk={this.handleSubmit}
            closeable="esc,mask,close"
            onCancel={this.onClose}
            onClose={this.onClose}
            title="编辑模块"
          >
            <Form field={this.field}>
              <FormItem label="模块名称：" {...formItemLayout}>
                <Input
                  {...init('table_name', {
                    rules: [{ required: true, message: '必填选项' }],
                  })}
                />
              </FormItem>

              <FormItem label="数据表名称：" {...formItemLayout}>
                <Select dataSource={this.state.dataSource} style={{width: 300}}
                  {...init('table_id', {
                    rules: [{ required: true, message: '必填选项' }],

                  })}
                />

              </FormItem>

            </Form>
          </Dialog>
        </div>
      );

    }else{

      return('');
    }
  }
}

const styles = {
  editDialog: {
    display: 'inline-block',
    marginRight: '5px',
    alignSelf:'center'
  },
};
