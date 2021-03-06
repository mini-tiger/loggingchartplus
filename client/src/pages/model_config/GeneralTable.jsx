import React, {Component} from 'react';
import {Grid} from '@alifd/next';
import IceContainer from '@icedesign/container';
import ContainerTitle from './components/ContainerTitle';
import ContractTable from './components/ContractTable';
import SearchFilter from './components/SearchFilter';
import SearchHistory from './components/SearchHistory';
import DataBinder from '@icedesign/data-binder';
import {Message} from '@alifd/next';
// import {getUserInfor} from '../../utils/authority';
//import md5Hex from "md5-hex";
import axios from 'axios';
import UploadRestltDialog from "./components/UploadResultDialog"
import './GeneralTable.scss'
import Cookie from "../../utils/cookies";
import config from "../../../config"
const {Row, Col} = Grid;
const cookies_expires = 10 * 365;

function getParams(url) {
  try {
    var index = url.indexOf('?');
    url = url.match(/\?([^#]+)/)[1];
    var obj = {}, arr = url.split('&');
    for (var i = 0; i < arr.length; i++) {
      var subArr = arr[i].split('=');
      var key = decodeURIComponent(subArr[0]);
      var value = decodeURIComponent(subArr[1]);
      obj[key] = value;
    }
    return obj;

  } catch (err) {
    return null;
  }
}
function isNumber(val) {
  if (parseFloat(val).toString() == "NaN") {

    return false;
  } else {
    return true;
  }
}
// const crudAPI = 'crud_user';
@DataBinder({
  configData: {
    method: 'post',
  },
  read: {
    method: 'post',
  },
  update: {
    method: 'post',
  },
  getJH:{
    method: 'post',
  }
})
export default class Model_configGeneralTable extends Component {
  static displayName = 'GeneralTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    // let userinfo = JSON.parse(getUserInfor());
    this.state = {
      userinfo: {
        name:'unlogin'
      },
      isConfig:false,
      crudAPI: '',
      config: {},
      base: {table_name: 'CRUD Template'},
      fields: [],
      datasource: [],
      dictConfig: [],
      isLoading: false,
      isShow: false,
      value: {},
      record: {},
      dataSuccess: false,
      pathname: '',
      change_cols: [],
      cookies_obj: {},
      show_fields: [],
      filter_fields: [],
      cookie_col: [],
      cookie_col_all: [],
      wellnolist:[]
    };
    this.fetchData = this.fetchData.bind(this);
    this.fetchDataPage = this.fetchDataPage.bind(this);
    this.setRecord = this.setRecord.bind(this);
    this.submitData = this.submitData.bind(this);
    this.getDictLabel = this.getDictLabel.bind(this);
    this.getDictMultipleByArray = this.getDictMultipleByArray.bind(this);
    this.getDictMultipleByStr = this.getDictMultipleByStr.bind(this);
  }

  componentDidMount() {
    //?????????????????????
    let pathname = this.props.location.pathname;

    let url='/' +config.urlSuffix+'/api/getJH';
    this.props.updateBindingData('getJH', {url:url}, (item) => {
      let wellnolist=[];
      item.data.map(function (v,i) {
        wellnolist.push({label:v,value:v})
      });


      this.setState({
        wellnolist    :wellnolist,
      });
    });

    this.updateData(pathname);
  }

  componentWillReceiveProps() {
    let pathname = this.props.location.pathname;
    if (!!this.state.pathname && this.state.pathname != pathname) {
      this.setState({
        value: {},
        record: {},
        show_fields: []
      })
      this.updateData(pathname);
    }
  }

  updateData(pathname) {
    let methodList = pathname.split("/");
    // console.log('methodList', methodList);
    let crudAPI = methodList[4];
    let urlparams=getParams(crudAPI)
    if(urlparams!=undefined){
      var index = crudAPI.indexOf('?');
      crudAPI = crudAPI.substr(0,index)
      console.log('crudAPI',crudAPI,urlparams)
    }

    let isConfig = false;
    if(crudAPI == 'crud_field'){
      isConfig=true;
    }
    this.setState({
      isConfig:isConfig,
      crudAPI: crudAPI,
      pathname: pathname
    });

    //?????????????????????
    let url = '/' +config.urlSuffix+'/crud/' + crudAPI + '/config';
    let _this = this

    this.props.updateBindingData('configData', {url: url}, (item) => {
      if (item.status !== 200) {
        Message.error(item.statusText ? item.statusText : 'url??????')
        return
      }
      this.setState({
        base: item.data.tableinfor.base,
        fields: item.data.tableinfor.fields,
        dictConfig: item.data.tableinfor.dictConfig,
        isLoading: false,
      }, function () {
        // let dataSuccess = false
        let change_cols = [];
        let cookies_obj = {};
        let show_fields = [];
        let filter_fields = [];
        let cookie_col_all = []

        _this.state.fields.map(col => {
          if (col.required_display == '1') {
            show_fields.push(col);
            if (col.display == '1') {
              cookie_col_all.push(col.field_id)
            }
          }
          if (col.required_filter == '1') {
            filter_fields.push(col);
          }
        });

        cookies_obj.col_key = _this.state.userinfo.name + "_" + crudAPI + "_col_select"
        cookies_obj.col_cookie = new Cookie(cookies_obj.col_key)

        //this.col_key = col_key,
        //this.col_cookie = col_cookie,
        let cookie_col = JSON.parse(cookies_obj.col_cookie.getCookie()) || cookie_col_all

        _this.setState({
          cookies_obj: cookies_obj,
          change_cols: change_cols,
          cookie_col_all: cookie_col_all,
          cookie_col: cookie_col,
          show_fields: show_fields,
          filter_fields: filter_fields

        }, function () {
          _this.setState({
            dataSuccess: true
          })
        })
      });
    });
    this.fetchData();
  }

  fetchData = (p) => {
    let params = Object.assign({}, p);
    // ??????????????????
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key];
        // moment????????????
        if (typeof (element.format) == 'function') {
          params[key] = element.format("YYYY-MM-DD HH:mm:ss");
        }
        if (element instanceof Array) {
          let v = '', time = [];
          element.map((n, i) => {
            if (typeof (n.format) == 'function') {
              time.push(n.format("YYYY-MM-DD HH:mm:ss"));
            }
          });

          // ??????????????????
          if (time.length == 2) {
            params[key] = {
              key: 'between',
              value: {
                st: time[0],
                et: time[1]
              }
            }
          }
        }
      }
    }
    let pathname = this.props.location.pathname;
    let methodList = pathname.split("/");
    // console.log('methodList', methodList);
    let crudAPI = methodList[4];
    let urlparams=getParams(crudAPI)
    if(urlparams!=undefined){
      var index = crudAPI.indexOf('?');
      crudAPI = crudAPI.substr(0,index)
      console.log('crudAPI',crudAPI,urlparams)
    }
    this.setState({
      crudAPI: crudAPI,
      datasource: [],
      isLoading: true
    });

    //?????????????????????
    let url = '/' +config.urlSuffix+'/crud/' + crudAPI + '/read';
    this.props.updateBindingData('read', {url: url, data: params}, (item) => {
      this.setState({
        value: p,
        datasource: item.data,
        isLoading: false,
      });
    });
  };
  //???????????????
  getDictLabel = (dict_type, key) => {
    let label = '';
    let dict = this.state.dictConfig[dict_type];
    for (let item of dict) {
      if (item.value == key) {
        label = item.label;
        break;
      }
    }
    return label;
  };
  //???????????????
  getDictMultipleByArray = (dict_type, key) => {
    let label = '';
    for (let item of key) {
      label = label + ',' + this.getDictLabel(dict_type, item)
    }
    return label.substring(1);
  };
  getDictMultipleByStr = (dict_type, key) => {
    let label = '';
    let keyList = []
    if (!Array.isArray(key)) {
      keyList = key.split(",");
    } else {
      keyList = key
    }
    for (let item of keyList) {
      label = label + ',' + this.getDictLabel(dict_type, item)
    }
    return label.substring(1);

  };
  downloadTpl = (crud) => {
    let table_id = {};
    let file = "";
    if (crud) {
      file = this.state.value.table_id;
      table_id = {table_id: this.state.value.table_id}
    } else {
      file = this.state.crudAPI;
      table_id = {table_id: this.state.crudAPI}
    }
    console.log(table_id);
    let url = '/' +config.urlSuffix+'/crud/' + this.state.crudAPI + '/downtpl';
    axios({
      url: url,
      method: 'post',
      responseType: 'blob',
      data: table_id
    }).then(function (res) {
      var blob = new Blob([res.data], {type: res.headers['content-type']});
      var downloadElement = document.createElement('a');
      var href = window.URL.createObjectURL(blob); //?????????????????????
      downloadElement.href = href;
      downloadElement.download = file + ".csv"; //??????????????????
      document.body.appendChild(downloadElement);
      downloadElement.click(); //????????????
      document.body.removeChild(downloadElement); //????????????????????????
      window.URL.revokeObjectURL(href); //?????????blob??????
    })
  };


  exportData = (crud) => {
    let table_id = {};
    let file = "";
    if (crud) {
      file = this.state.value.table_id;
      table_id = {table_id: this.state.value.table_id}
    } else {
      file = this.state.crudAPI;
      table_id = {table_id: this.state.crudAPI}
    }

    let url = '/' +config.urlSuffix+'/crud/' + this.state.crudAPI + '/exportData';
    axios({
      url: url,
      method: 'post',
      responseType: 'blob',
      data: table_id
    }).then(function (res) {
      var blob = new Blob([res.data], {type: res.headers['content-type']});
      var downloadElement = document.createElement('a');
      var href = window.URL.createObjectURL(blob); //?????????????????????
      downloadElement.href = href;
      downloadElement.download = file + "_row_6000.csv"; //??????????????????
      document.body.appendChild(downloadElement);
      downloadElement.click(); //????????????
      document.body.removeChild(downloadElement); //????????????????????????
      window.URL.revokeObjectURL(href); //?????????blob??????
    })
  };

  beforeUpload = (info) => {
    // ???????????????
    console.log('beforeUpload : ', info);

    // return true
  };

  UploadonChange = (info) => {
    // ??????????????????
    console.log('onChange : ', info);
  };

  UploadonSuccess = (info) => {
    console.log('onSuccess : ', info);
    if (info.response.status == 200) {
      UploadRestltDialog(info.response)
    } else {
      UploadRestltDialog(info.response)
    }
  };


  fetchDataPage(current) {
    let params = {};
    if (this.state.value != undefined) {
      params = this.state.value;
    }
    params['page'] = current;
    this.setState({
      value: params
    });
    this.fetchData(params);
  };

  handleClick = (e) => {
    if (this.state.isShow) {
      this.setState({
        isShow: false
      })
    }
  };

  setRecord = (record) => {
    // console.log('setRecord', record);
    this.setState({
      record: record,
      isShow: true
    })
  };

  submitData = (params) => {
    console.log(params)
    if (params.hasOwnProperty("id")){
      if (!isNumber(params["id"])){
        Message.error("??????????????????")
        return
      }
    }
    if (params.hasOwnProperty("model_min") ){
      if (!isNumber(params["model_min"]) && params["model_min"] !=""){
        Message.error("?????????????????????")
        return
      }
    }

    if (params.hasOwnProperty("model_max")){
      if (!isNumber(params["model_max"])&& params["model_max"] !=""){
        Message.error("?????????????????????")
        return
      }
    }

    if (params.hasOwnProperty("model_min") && params.hasOwnProperty("model_max")){
      if (parseFloat(params["model_min"]) > parseFloat(params["model_max"])){
        Message.error("???????????????????????????")
        return
      }
    }
    //??????????????????
    let method = this.state.record.method;
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const element = params[key];
        if (!!element) {
          if (typeof (element.format) == 'function') {
            params[key] = element.format("YYYY-MM-DD HH:mm:ss");
          } else if (Array.isArray(element)) {
            let keyvalue = element.toString();
            if (keyvalue.substr(0, 1) == ",") {     // ?????????????????????
              keyvalue = keyvalue.slice(1);
            }
            params[key] = keyvalue;
          }
        }
        /*
        if (key === 'password' && this.state.crudAPI === 'crud_user') {
          params[key] = md5Hex(params[key])
        }
        */
      }
    }
    let url = '/' +config.urlSuffix+'/crud/' + this.state.crudAPI + '/' + method;
    delete params.operation;
    this.props.updateBindingData('update', {url: url, data: params}, (item) => {
      if (item.status == '200') {
        Message.success('????????????');
      } else {
        Message.success('????????????:' + item.statusText);
      }
      this.setState({
        isShow: false,
      });
      this.fetchData(this.state.value);
    });
  };


  onchange_cols = (value) => {
    // const {show_fields} = this.state;
    this.setState({
      cookie_col: value
      // cookie_col:value
    })

  };

  render() {

    const {
      base, dictConfig, isLoading, isShow, datasource, fields, crudAPI,isConfig,
      record, userinfo, show_fields, filter_fields, cookies_obj, change_cols, dataSuccess, cookie_col
    } = this.state;
    // console.log(this.state)
    let rowRecord = record;
    if (rowRecord.value !== undefined) {
      fields.map((item, index) => {
        if (item.input_type === 'Checkbox' && JSON.stringify(rowRecord.value) !== '{}') {
          let valueStr = rowRecord.value[item.field_id];
          let valueArray = [];
          if (Array.isArray(valueStr)) {
            valueArray = valueStr;
          } else {
            valueArray = valueStr.split(',');
          }
          delete rowRecord.value[item.field_id];
          rowRecord.value[item.field_id] = valueArray;
        }
      });
    }

    return (

      <Row className="table-display-page" wrap>
        <Col onClick={this.handleClick}>
          <IceContainer style={{padding: '0'}}>
            <ContainerTitle title={base.table_name}/>
            <div style={{padding: '20px'}}>
              <SearchFilter
                isConfig={isConfig}
                fields={filter_fields}
                dictConfig={dictConfig}
                fetchData={this.fetchData}
                setRecord={this.setRecord}
                downloadTpl={this.downloadTpl}
                exportData={this.exportData}
                beforeUpload={this.beforeUpload}
                UploadonChang={this.UploadonChange}
                UploadonSuccess={this.UploadonSuccess}
                CurrentTable={crudAPI}
                uploadUrl={'/' +config.urlSuffix+"/api/uploadJar"}
              />
              <ContractTable
                isLoading={isLoading}
                fields={show_fields}
                datasource={datasource}
                setRecord={this.setRecord}
                fetchDataPage={this.fetchDataPage}
                getDictLabel={this.getDictLabel}
                getDictMultipleByStr={this.getDictMultipleByStr}
                tableName={crudAPI}
                dataSuccess={dataSuccess}
                cookies_expires={cookies_expires}
                userinfo={userinfo}
                cookies_obj={cookies_obj}
                // change_cols={change_cols}
                cookie_col={cookie_col}
                onchange_cols={this.onchange_cols}
                wellnolist={this.state.wellnolist}
              />
            </div>
          </IceContainer>
        </Col>
        <Col className={'sider ' + (isShow ? 'active' : '')}>
          <SearchHistory
            method={rowRecord.method}
            value={rowRecord.value}
            fields={fields}
            dictConfig={dictConfig}
            submitData={this.submitData}/>
        </Col>
      </Row>
    );
  }
}
