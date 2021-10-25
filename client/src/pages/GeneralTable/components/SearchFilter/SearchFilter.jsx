/* eslint react/no-string-refs:0 */
import React, {Component} from 'react';
import {Icon, Message} from '@alifd/next';
import CustomForm from '../CustomForm';


export default class SearchFilter extends Component {
  static displayName = 'SearchFilter';

  static propTypes = {};

  static defaultProps = {};

  state = {
    showAdvancedFields: false,
    value: {},
    dwtpl: false
  };

  /**
   * 提交回调函数
   */
  handleSubmit = (errors, value) => {
    if (errors) {
      console.log({errors});
      return;
    }
    this.setState({
      dwtpl: true // 提交过查找才能下载对应的模板
    });
    value.page = 1;
    this.props.fetchData(value);
    // console.log({ value });
  };
  // 下载模板
  downloadTpl = () => {
    let crud_field = this.props.CurrentTable;
    const crud = 'crud_field';
    if (crud === crud_field) { // 如果是crud功能需要先查找模块，否则直接查找
      if (this.state.dwtpl) {
        this.props.downloadTpl(true)
      } else {
        Message.toast.error('请先查找对应模块');
      }
    } else {
      this.props.downloadTpl(false)
    }
  };
  //导出数据
  exportData = () => {
    let crud_field = this.props.CurrentTable.toString();
    const crud = 'crud_field';
    if (crud === crud_field) { // 如果是crud功能需要先查找模块，否则直接查找
      if (this.state.dwtpl) {
        this.props.exportData(true)
      } else {
        Message.toast.error('请先查找对应模块');
      }
    } else {
      this.props.exportData(false)
    }
  };


  /**
   * 重置表单
   */
  handleReset = () => {
    this.setState(
      {
        // value: Object.assign(
        //   {},
        //   this.initFields.base,
        //   this.initFields.advanced
        // ),
        value: {},
      },
      () => {
        this.props.fetchData();
      }
    );
  };
  handleCreate = () => {
    console.log('handleCreate');
    this.props.setRecord({
      method: 'create',
      value: {},
    });
  };
  /**
   * 高级搜索
   */
  handleAdvancedSearch = () => {
    const {showAdvancedFields} = this.state;
    this.setState({
      showAdvancedFields: !showAdvancedFields,
    });
  };

  /**
   * 渲染按钮
   */
  renderExtraContent = () => {
    return (
      <div style={styles.extraContent} onClick={this.handleAdvancedSearch}>
        高级搜索{' '}
        <Icon
          size="xs"
          type={this.state.showAdvancedFields ? 'arrow-up' : 'arrow-down'}
        />
      </div>
    );
  };


  render() {
    //let config  = this.props.filterConfig;

    return (
      <CustomForm
        {...this.props}
        value={this.state.value}
        //config={config}
        handleSubmit={this.handleSubmit}
        handleReset={this.handleReset}
        handleCreate={this.handleCreate}
        extraContent={this.renderExtraContent()}
        downloadTpl={this.downloadTpl}
        exportData={this.exportData}
        beforeUpload={this.props.beforeUpload}
        UploadonChang={this.props.UploadonChange}
        UploadonSuccess={this.props.UploadonSuccess}
        uploadUrl={this.props.uploadUrl}
      />
    );
  }
}

const styles = {
  extraContent: {
    position: 'absolute',
    right: '0',
    bottom: '0',
    color: 'rgba(49, 128, 253, 0.65)',
    cursor: 'pointer',
  },
};
