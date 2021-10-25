import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import ContainerTitle from '../ContainerTitle';
import PropTypes from 'prop-types';
import {TreeSelect, Radio,Checkbox, Input, Button, Grid, Select, DatePicker } from '@alifd/next';
// import {Upload, Feedback} from '@icedesign/base';
import Img from '@icedesign/img';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import { debug } from 'util';
import moment from "moment";

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
      // 日期转换成数字
      for (let i = 0; i < this.props.fields.length; i++) {
        if (this.props.fields[i].input_type === "DatePicker") {
          if (Object.keys(values).length > 0) {
            if (values.hasOwnProperty(this.props.fields[i].field_id)) {
              console.log(values);
              values[this.props.fields[i].field_id] = moment(values[this.props.fields[i].field_id]).valueOf()
            }
          }
        }
      }

      this.props.submitData(values);
      this.props.setShow()
    });
  };

  handleAddSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      /*
      if (errors) {
        console.log({ errors });
        return;
      }
      */
      // 日期转换成数字
      for (let i = 0; i < this.props.fields.length; i++) {
        if (this.props.fields[i].input_type === "DatePicker") {
          if (Object.keys(values).length > 0) {
            if (values.hasOwnProperty(this.props.fields[i].field_id)) {
              console.log(values);
              values[this.props.fields[i].field_id] = moment(values[this.props.fields[i].field_id]).valueOf()
            }
          }
        }
      }

      this.props.submitAddData(values);
      this.props.setShow()
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


    let disable=this.props.disableInput.includes(item.field_id)
    return (
        <div key={"key-field-"+index} style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id}  message={'请输入正确的'+item.field_name}>
            <Input disabled={disable} placeholder= {'请输入'+item.field_name} defaultValue=''  style={{ width: '100%' }} />
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
    let datasource = [];

    datasource=this.props.dictConfig[item.relation_data]

    // console.log(datasource)
    // console.log(item.relation_data)
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
          <IceFormBinder name={item.field_id} required message={'请输入正确的'+item.field_name}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </IceFormBinder>
        </div>
    );
  };


  renderFieldsFromItem = (config) => {
    return config.map((item,index) => {
      if (item.required_display===1) {
        if (item.input_type === 'Input') {
          return this.renderInput2(item, index);
        } else if (item.input_type === 'Input.TextArea') {
          return this.renderInputTextArea2(item, index);
        } else if (item.input_type === 'Checkbox') {
          return this.renderCheckbox2(item, index);
        } else if (item.input_type === 'Select') {
          return this.renderSelect2(item, index);
        } else if (item.input_type === 'SelectDialog') {
          //return this.renderSelectDialog2(item,index);
        } else if (item.input_type === 'TreeSelect') {
          //return this.renderTreeSelect2(item,index);
        } else if (item.input_type === 'RadioGroup') {
          return this.renderRadioGroup2(item, index);
        } else if (item.input_type === 'DatePicker') {
          return this.renderDatePicker2(item, index);
        }
      }
    });
  };

  handleImageChange = (info) => {
    console.log('onUIChange : ', info);
    if (info.file.response !== undefined) {
      if (info.file.response.status === 1) {
        Feedback.toast.error('上传图片失败:' + info.file.response.data.name);
      } else if (info.file.response.status === 200) {
        if (info.file.status === "removed") {
          Feedback.toast.success('删除图片成功');
          this.setState({
            Image: null
          });
        } else {
          Feedback.toast.success('上传图片成功');
          this.setState({
            Image: info.file.response.data
          });
        }
      }else if (info.file.status === "error"){
        Feedback.toast.error('上传图片失败:' + info.file.response);
      }
    }
  };

  render() {
    const { value ,fields } = this.props;
    // 处理时间
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].input_type === "DatePicker") {
        if (Object.keys(value).length > 0) {
          if (value.hasOwnProperty(fields[i].field_id)) {
            value[fields[i].field_id] = moment(value[fields[i].field_id]).format("YYYY-MM-DD")
          }
        }
      }
    }
    return (
      <IceContainer style={styles.container}>
        <ContainerTitle title="详细信息" />
        <IceFormBinderWrapper value={value} ref="form">
          <div style={{position: 'absolute',top: '60px', bottom: '200px',right: '0',width: '100%'}}>

            <div style={{height: '100%',overflowY: 'auto'}}>
                {this.renderFieldsFromItem(fields)}
              {/*<Upload*/}
                {/*action="/crud/crud_field/uploadImage"*/}
                {/*onChange={this.handleImageChange}*/}
                {/*multiple*/}
              {/*>*/}
              {/*<Button*/}
                {/*type="primary"*/}
                {/*style={{marginRight: '10px'}}*/}
              {/*>*/}
                {/*上传图片*/}
              {/*</Button>*/}
            {/*</Upload>*/}
            {/*<Img*/}
              {/*width={50}*/}
              {/*height={50}*/}
              {/*shape="circle"*/}
              {/*src={this.state.Image}*/}
              {/*type="contain"*/}
              {/*style={{border: '1px solid #ccc', margin: '10px'}}*/}
            {/*/>*/}
            </div>

            <div style={styles.buttons}>
              {/*<Button*/}
                {/*type="primary"*/}
                {/*style={{ marginRight: '10px' }}*/}
                {/*onClick={this.handleAddSubmit}*/}
              {/*>*/}
                {/*新增*/}
              {/*</Button>*/}
              <Button
                  type="primary"
                  style={{ marginRight: '10px' }}
                  onClick={this.handleSubmit}
              >
                更新
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
