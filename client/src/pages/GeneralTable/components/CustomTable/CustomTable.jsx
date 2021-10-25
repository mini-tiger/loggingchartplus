import React, {Component} from 'react';
import {Checkbox, Button, Dialog, Table, Pagination} from '@alifd/next';
import PropTypes from 'prop-types';
import './CustomTable.scss';
import Cookie, {hasItem, keys} from '../../../../utils/cookies';   //导入cookie模块
import sleep from '../../../../utils/tools'
import {AsyncSleep} from '../../../../utils/tools'

const {Group} = Checkbox;
export default class CustomTable extends Component {
  static displayName = 'CustomTable';

  static defaultProps = {};

  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    fetchDataPage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      cols: [],
      change_cols: [],

    };

    this.openDialog = this.openDialog.bind(this);
    this.renderControlContent = this.renderControlContent.bind(this);
  };


  openDialog = () => {

    Dialog.confirm({
      content: this.renderControlContent(),
      title: '选择显示列',
      onOk: () => {
        Dialog.confirm({
          title: '确认',
          content: '是否保存列的选项',
          onOk: () => {
            this.props.cookies_obj.col_cookie.delCookie()
            this.props.cookies_obj.col_cookie.setCookie(this.props.cookie_col, 0, true)
          }
        });
        return true;
      },
      onCancel: () => { // 取消则返回上一次的 选择记录
        // let _this = this
        // this.props.cookies_obj.col_cookie.setCookie(_this.beforeCols, 0, true)
        return true;
      }
    });
  }

  renderControlContent() {
    const {fields, cookie_col} = this.props;
    const groupSource = fields.map(col => {
      return {
        label: col.field_name,
        value: col.field_id
      };
    })
    // console.log('groupSource',groupSource);
    // console.log('defaultValue',defaultValue);
    return <Group dataSource={groupSource} onChange={this.onChange} defaultValue={cookie_col}/>;
  }

  onChange = (value) => {
    // let _this = this
    // this.setState({
    //   change_cols: this.props.fields.filter(col => value.indexOf(col.field_id) > -1)
    // })

    this.props.onchange_cols(value)
  }


  renderFields() {
    const {dataSuccess, userinfo, fields, tableName} = this.props;
    let that = this;
    if (dataSuccess && fields.length > 0) {
      let showFields = []
      showFields = fields.filter(col => this.props.cookie_col.indexOf(col.field_id) > -1)
      return showFields.map(col => {
        let action = (v, i, row) => {
          return v;
        };
        if (col.input_type == 'Select' || col.input_type == 'RadioGroup') {
          action = (v, i, row) => {
            return that.props.getDictLabel(col.relation_data, v)
          };
        }
        if (col.input_type == 'Checkbox') {
          action = (v, i, row) => {
            // console.log('Checkbox=====', v);
            let returnValue = [];
            // console.log(v,!Array.isArray(v))


            returnValue = that.props.getDictMultipleByStr(col.relation_data, v);

            // returnValue = that.props.getDictMultipleByStr(col.relation_data, v);

            // console.log('returnValue', returnValue);
            return returnValue;
          };
        }

        return <Table.Column title={col.field_name} cell={action} dataIndex={col.field_id} key={col.field_id}/>;
      });
    }
  };

  handlePagination = (current) => {
    this.setState(
      {
        current,
      },
      () => {
        this.props.fetchDataPage(current);
      }
    );
  };

  onRowClick = (record, index) => {
    this.props.setRecord({
      method: 'update',
      value: record,
    });
  };


  render() {
    const {datasource, fields, userinfo, tableName, style = {}, isLoading = false} = this.props;

    // if (this.state.cols.length == 0 && fields.length > 0) {
    //   let _this = this
    //   let col_key=userinfo.name + "_" + tableName + "_col_select"
    //   let col_cookie = new Cookie(col_key)
    //   this.setState({
    //     col_key:col_key,
    //     col_cookie: col_cookie,
    //     change_cols: JSON.parse(col_cookie.getCookie()) || fields,
    //     cols: fields,
    //     // tableName:this.props.tableName,
    //   }, function () {
    //     console.log(_this.state )
    //   })
    // }

    return (
      <div style={style}>
        <p><Button onClick={this.openDialog}> 选择显示列 </Button></p>
        <Table
          loading={isLoading}
          dataSource={datasource.dataList}
          onRowClick={this.onRowClick}
          hasBorder={false}
          className="custom-table"
          style={{minHeight: '500px'}}
        >
          {this.renderFields()}
        </Table>
        <Pagination
          style={styles.pagination}
          current={datasource.page}
          pageSize={datasource.pageSize}
          total={datasource.total}
          onChange={this.handlePagination}
        />
      </div>
    );
  }
}

const styles = {
  pagination: {
    margin: '20px 0',
    textAlign: 'center',
  },
};
