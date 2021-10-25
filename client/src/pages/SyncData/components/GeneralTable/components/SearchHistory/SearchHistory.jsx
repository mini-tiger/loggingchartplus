import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import ContainerTitle from '../ContainerTitle';
import PropTypes from 'prop-types';
import {TreeSelect, Radio,Checkbox, Input, Button, Grid, Select, DatePicker } from '@alifd/next';
import { Upload ,Message} from '@alifd/next';
import Img from '@icedesign/img';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { debug } from 'util';
//import SelectDialog from '../CustomForm/SelectDialog';

const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const { Group: CheckboxGroup } = Checkbox;
const {Group} = Checkbox;
export default class SearchHistory extends Component {
  static displayName = 'SearchHistory';

  static propTypes = {
    handleSubmit: PropTypes.func,
    handleReset: PropTypes.func,
    extraContent: PropTypes.element,
  };

  static defaultProps = {
    handleReset: () => {},
    handleSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      value:{},
      Image:"",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      /*
      if (errors) {
        console.log({ errors });
        return;
      }
      */

      this.props.submitData(values);
      // console.log({ values });
    });
  };



  renderInputTextArea2 = (item,index) => {

    return (
      <div key={"key-field-"+index} style={styles.formItem}>
      <span style={styles.formLabel}>{item.field_name}：</span>
      <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
        <Input.TextArea placeholder= {'请输入'+item.field_name} style={{ width: '100%' }} />
      </IceFormBinder>
      <div style={styles.formError}>
        <IceFormError name={item.field_id} />
      </div>
    </div>
    );
  };
  renderInput2 = (item,index) => {
    return (
        <div key={"key-field-"+index} style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id}  message={'请输入正确的'+item.field_name}>
            <Input placeholder= {'请输入'+item.field_name} defaultValue=''  style={{ width: '100%' }} />
          </IceFormBinder>
          <div style={styles.formError}>
            <IceFormError name={item.field_id} />
          </div>
        </div>
    );
  };
  renderCheckbox2 = (item,index) => {
    let datasource = this.props.dictConfig[item.relation_data];

    return (
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <Group  dataSource={datasource} placeholder= {'请输入'+item.field_name} />
          </IceFormBinder>
        </div>
    );
  };
  renderSelect2 = (item,index) => {
    let datasource = this.props.dictConfig[item.relation_data];
    return (
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <Select dataSource={datasource} placeholder= {'请输入'+item.field_name} style={{ width: '100%' }} />
          </IceFormBinder>
        </div>
    );
  };
  renderSelectDialog2 = (item,index) => {
    return (
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>

        </div>
    );
  };
  renderTreeSelect2 = (item,index) => {
    let datasource = this.props.dictConfig[item.relation_data];
    return (
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <TreeSelect dataSource={datasource} placeholder= {'请输入'+item.field_name} style={{ width: '100%' }} />
          </IceFormBinder>
        </div>
    );
  };
  renderRadioGroup2 = (item,index) => {
    let datasource = this.props.dictConfig[item.relation_data];
    return (
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <RadioGroup  dataSource={datasource} placeholder= {'请输入'+item.field_name}  style={{ width: '100%' }} />
          </IceFormBinder>
        </div>

    );
  };
  renderDatePicker2 = (item,index) => {
    return (
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </IceFormBinder>
        </div>
    );
  };


  renderFieldsFromItem = (config) => {
    return config.map((item,index) => {
      if (item.input_type === 'Input') {
        return this.renderInput2(item,index);
      }else if (item.input_type === 'Input.TextArea') {
        return this.renderInputTextArea2(item,index);
      } else if (item.input_type === 'Checkbox') {
        return this.renderCheckbox2(item,index);
      } else if (item.input_type === 'Select') {
        return this.renderSelect2(item,index);
      } else if (item.input_type === 'SelectDialog') {
        //return this.renderSelectDialog2(item,index);
      } else if (item.input_type === 'TreeSelect') {
        //return this.renderTreeSelect2(item,index);
      } else if (item.input_type === 'RadioGroup') {
        return this.renderRadioGroup2(item,index);
      } else if (item.input_type === 'DatePicker') {
        return this.renderDatePicker2(item,index);
      }
    });
  };

  handleImageChange = (info) => {
    let n=info.length;
    if (info.length>0 && info[n-1].response !== undefined) {
      if (info[n-1].response.status === 1) {
        Message.error('上传图片失败:' + info[n-1].response.data.name);
      } else if (info[n-1].response.status === 200) {
        if (info[n-1].status === "removed") {
          Message.success('删除图片成功');
          this.setState({
            Image: null
          });
        } else {
          Message.success('上传图片成功');
          this.setState({
            Image: info[n-1].response.data
          });
        }
      }else if (info[n-1].status === "error"){
        Message.error('上传图片失败:' + info[n-1].response);
      }
    }
  };

  render() {
    const { value ,fields } = this.props;

    return (
      <IceContainer style={styles.container}>
        <ContainerTitle title="详细信息" />
        <IceFormBinderWrapper value={value} ref="form">
          <div style={styles.formItems}>

            <span>
                {this.renderFieldsFromItem(fields)}
              {/*<Upload
                action="/cjxzs/crud/cjxzs/crud_field/uploadImage"
                onChange={this.handleImageChange}
                multiple
              >
              <Button
                type="primary"
                style={{marginRight: '10px'}}
              >
                上传图片
              </Button>
              </Upload>
            <Img
              width={50}
              height={50}
              shape="circle"
              src={this.state.Image}
              type="contain"
              style={{border: '1px solid #ccc', margin: '10px'}}
              />*/}
            </span>

            <div style={styles.buttons}>
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={this.handleSubmit}
              >
                提 交
              </Button>
            </div>
          </div>
        </IceFormBinderWrapper>
      </IceContainer>
    );
  }
}

const styles = {
  formItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 10px',
  },
  formLabel: {
    minWidth: '70px',
    width:'160px'
  },
  buttons: {
    margin: '10px 0 20px',
    textAlign: 'center',
  },
  container: {
    padding: '0',
    minHeight: '100vh',
  },
  time: {
    color: 'rgba(0,0,0,.6)',
  },
  keyword: {
    display: 'inline-block',
    padding: '6px 10px',
    backgroundColor: 'rgba(31,56,88,0.06)',
    borderRadius: '3px',
    marginBottom: '8px',
    marginRight: '8px',
    maxWidth: '100%',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
};
