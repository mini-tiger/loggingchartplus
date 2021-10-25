import React, {Component} from 'react';
import {Checkbox, Button, Dialog, Table, Pagination,Select,Message,Loading} from '@alifd/next';
import PropTypes from 'prop-types';
import './CustomTable.scss';
import DataBinder from '@icedesign/data-binder';
import Cookie, {hasItem, keys} from '../../../../utils/cookies';   //导入cookie模块
import sleep from '../../../../utils/tools'
import {AsyncSleep} from '../../../../utils/tools'
import config from "../../../../../config"
import axios from 'axios';
const {Group} = Checkbox;

@DataBinder({
  get: {
    method: 'post',
  },
  getOilFieldConfig: {
    method: 'post',
  },
  getModelConfig: {
    method: 'post',
  },
  del: {
    method: 'post',
  },
})
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
      wells:[],
      downLoading:false

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
    let operation = {
      display: 1, // 增加操作表头
      field_id: "operation",
      field_name: "操作",
      field_type: "VARCHAR2",
      input_type: "",
      required_display: 1,
      required_filter: 0,
      required_input: 0,
      // table_id: "HF_BACKUPDETAIL",
    };
    let that = this;
    if (dataSuccess && fields.length > 0) {
      let showFields = []
      showFields = fields.filter(col => this.props.cookie_col.indexOf(col.field_id) > -1)
      showFields.push(operation);
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

  exportdata_download = (filename) => {
    // console.log(filename)
    let _this = this;
    // axios.defaults.timeout=1
    axios({
      url: '/' +config.urlSuffix+'/api/getDownloadFile',
      method: 'post',
      responseType: 'blob',
      data: {filename: filename},
      timeout:300000
      // header:{'Access-Control-Allow-Origin':'*'}
    }).then(function (res) {
      console.log(res) // 不能使用多线程下载工具
      _this.setState({
        downLoading: false
      });
      if (res.status == 200) {
        // let rd=res.headers["content-disposition"]
        // let filename=rd.split("filename=");
        // if (filename.length <=1){
        //   Message.success('下载错误');
        //   return
        // }
        // console.log(filename[1])
        var blob = new Blob([res.data], {type: res.headers['content-type']});
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = filename; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      } else {
        Message.success(util.format('下载错误,%s',res.statusText));
      }

    })

  };

  onJHchange=(value)=>{
    this.setState({
      wells:value
    })
  }

  onDataExportClick = (record, index) => {
    console.log(record);
    let _this=this;

    // console.log(record["model_name"]);
    // console.log(record["inparamslist"]);
    // console.log(this.props.wellnolist)
    Dialog.confirm({
      title: "请选择提取数据的井号,点击确定下载",
      content: (<div>
        <Select style={{width:"200px"}} mode={"multiple"} showSearch={true} dataSource={this.props.wellnolist}
                onChange={this.onJHchange.bind(this)}/>
        <p><div style={{color:"#f40",fontSize:"16px"}}>由于数据量巨大,请选择三个以下的井号</div></p>

      </div>),
      onOk: () => {

        let p={outputfields:record["outparamslist"],fields:record["inparamslist"],JH:this.state.wells,model_name:record["model_name"]}
        if (this.state.wells.length == 0){
          Message.error("没有选择井号");
          return
        }
        if (this.state.wells.length >3){
          Message.error("超过三个井号");
          return
        }
        this.setState({
          downLoading: true
        });
        let url = '/' +config.urlSuffix+'/api/getModelCSVzip';
        this.props.updateBindingData('get', {url: url, data: p}, (result) => {
          console.log(result);
          if (result == undefined){
            Message.success('下载错误');
            return
          }
          if (result.status == 200) {
            // let f =encodeURI(result["data"]["filename"]);
            let f = decodeURI(result["data"]["filename"])
            console.log(f)
            this.exportdata_download(f);
          } else {
            Message.success('下载错误,'+result.statusText);
            _this.setState({
              downLoading: false
            })
          }

        });

      }
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
    if (datasource.dataList !== undefined) {
      datasource.dataList.map(obj => {
        obj.operation =
            <div>
              <Button
                  onClick={this.onRowClick.bind(this, obj)}>编辑</Button>
              <Button
                  onClick={this.onDataExportClick.bind(this, obj)}>提取数据</Button>
            </div>;
        return obj
      })
    }

    return (
      <div style={style}>
        <Loading tip="加载中" style={{display: 'block'}} visible={this.state.downLoading} shape="fusion-reactor">
        <p><Button onClick={this.openDialog}> 选择显示列 </Button></p>
        <Table
          loading={isLoading}
          dataSource={datasource.dataList}
          // onRowClick={this.onRowClick}
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
        </Loading>
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
