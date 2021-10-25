/* eslint react/no-string-refs:0, array-callback-return:0, react/forbid-prop-types:0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon} from '@alifd/next';
import {TreeSelect, Radio,Checkbox, Input, Button, Grid, Select, DatePicker} from '@alifd/next';
import {
  FormBinderWrapper as IceFormBinderWrapper,
  FormBinder as IceFormBinder,
  FormError as IceFormError,
} from '@icedesign/form-binder';
import EditDialog from './EditDialog';

import commonstyles from '../../GeneralTable.scss'

const {Row, Col} = Grid;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const { Group: CheckboxGroup } = Checkbox;
class CustomForm extends Component {
  static displayName = 'CustomForm';

  static propTypes = {
    value: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func,
    handleReset: PropTypes.func,
    handleCreate: PropTypes.func,
    downloadTpl: PropTypes.func,
    extraContent: PropTypes.element,
  };

  static defaultProps = {
    extraContent: null,
    handleReset: () => {
    },
    handleSubmit: () => {
    },
    handleCreate: () => {
    },
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.refs.form.validateAll((errors, values) => {
      this.props.handleSubmit(errors, values);
    });
  };


  renderInput2 = (item,index) => {
    return (
      <Col l="6" key={'renderInput2'+index}>
        <div style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id}  message={'请输入正确的'+item.field_name}>
            <Input placeholder= {'请输入'+item.field_name} style={{ width: '70%' }} />
          </IceFormBinder>
          <div style={styles.formError}>
            <IceFormError name={item.field_id} />
          </div>
        </div>
      </Col>
    );
  };

  renderSelect2 = (item,index) => {
    let datasource = this.props.dictConfig[item.relation_data];
    return (
      <Col l="6" key={'renderSelect2'+index}>
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <Select dataSource={datasource} placeholder= {'请输入'+item.field_name} style={{ width: '70%' }} />
          </IceFormBinder>
        </div>
      </Col>
    );
  };
  renderTreeSelect2 = (item,index) => {
    let datasource = this.props.dictConfig[item.relation_data];
    return (
      <Col l="6" key={'renderTreeSelect2'+index}>
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <TreeSelect dataSource={datasource} placeholder= {'请输入'+item.field_name} style={{ width: '70%' }} />
          </IceFormBinder>
        </div>
      </Col>
    );
  };
  renderRadioGroup2 = (item,index) => {
    let datasource = this.props.dictConfig[item.relation_data];
    return (
      <Col l="6" key={'renderRadioGroup2'+index}>
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <RadioGroup  dataSource={datasource} placeholder= {'请输入'+item.field_name}  style={{ width: '70%' }} />
          </IceFormBinder>
        </div>
      </Col>
    );
  };

  renderDatePicker2 = (item,index) => {
    return (
      <Col l="6" key={'renderDatePicker2'+index}>
        <div key={"key-field-"+index}  style={styles.formItem}>
          <span style={styles.formLabel}>{item.field_name}：</span>
          <IceFormBinder name={item.field_id} message={'请输入正确的'+item.field_name}>
            <RangePicker format="YYYY-MM-DD" style={{ width: '70%' }} />
          </IceFormBinder>
        </div>
      </Col>
    );
  };

  renderEditDialog = (item) => {
    return (
      <EditDialog/>
    );
  };
  renderFieldsFromItem = (config) => {
    if(config == undefined) return;
    return config.map((item,index) => {
      if (item.input_type === 'Input') {
        return this.renderInput2(item,index);
      }else if (item.input_type === 'Input.TextArea') {

      } else if (item.input_type === 'Checkbox') {
        return this.renderSelect2(item,index);
      } else if (item.input_type === 'Select') {
        return this.renderSelect2(item,index);
      } else if (item.input_type === 'SelectDialog') {

      } else if (item.input_type === 'TreeSelect') {

      } else if (item.input_type === 'RadioGroup') {
        return this.renderSelect2(item,index);
      } else if (item.input_type === 'DatePicker') {
        return this.renderDatePicker2(item,index);
      } else if (item.component === 'EditDialog') {
        return this.renderEditDialog(item);
      }
    });
  };
  componentDidMount() {
    const {fields} = this.props;
    this.setState({
      change_cols: fields,
      cols: fields,
    });
  };
  render() {
    const {
      CurrentTable,handleReset,handleCreate,fields,value, downloadTpl, exportData, beforeUpload, UploadonChange, UploadonSuccess
    } = this.props;

    return (
      <div style={styles.formContainer}>
        <IceFormBinderWrapper value={value} ref="form">
          <div style={styles.formItems}>
            <Row wrap gutter={5}>
            {this.renderFieldsFromItem(fields)}
            </Row>
            <Row wrap gutter={5}>
            <div style={styles.buttons}>
              <EditDialog isConfig={this.props.isConfig}/>
              <Button
                type="primary"
                style={styles.button}
                onClick={this.handleSubmit}
              >
                过 滤
              </Button>
              <Button type="primary"
                style={styles.button}
                 onClick={handleReset}>
                重 置
              </Button>
              <Button type="primary"
                style={styles.button}
                onClick={handleCreate}>
                新 增
              </Button>
              {/*
              <Button type="primary"
                style={styles.button}
                 onClick={downloadTpl}>
                下载模板
              </Button>
              <Button type="primary"
                style={styles.button}
                 onClick={exportData}>
                导出数据
              </Button>
               */}
              <Upload
                action={this.props.uploadUrl}
                beforeUpload={beforeUpload}
                onChange={UploadonChange}
                onSuccess={UploadonSuccess}
                // accept="."
                className="upload"
                // multiple
              >
                <Button type="primary" style={styles.button}>上传模型文件</Button>
              </Upload>

              </div>
            </Row>
          </div>
        </IceFormBinderWrapper>
      </div>
    );
  }
}

const styles = {
  formContainer: {
    position: 'relative',
    background: '#fff',
  },
  formItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  formLabel: {
    minWidth: '30%',
    textAlign: 'center',
  },
  buttons: {
    textAlign: 'center',
    display:'flex'
  },
  button:{
    marginRight : '10px',
    alignSelf:'center'
  }
};

export default CustomForm;
