import React, { Component } from 'react';
import { Transfer } from '@alifd/next';
import IceContainer from '@icedesign/container';
import { Select } from '@alifd/next';
import DataBinder from '@icedesign/data-binder';
import config from "../../../../../config"
const provinceData = ['普华油田', '西北油田', '胜利油田'];
const cityData = {
  普华油田: ['PH01', 'PH02', 'PH03'],
  西北油田: ['XB01', 'XB02', 'XB03'],
  胜利油田: ['SL01', 'SL02', 'SL03']
};

const mockData = () => {
  const dataSource = [];

  for (let i = 0; i < 10; i++) {
    dataSource.push({
      label: `Task${i + 1}`,
      value: `${i}`,
      disabled: i % 4 === 0,
    });
  }

  return dataSource;
};

@DataBinder({
  getYT: {
    method: 'post',
  },
  getModel: {
    method: 'post',
  },
  getwellflist: {
    method: 'post',
  },
  getJH: {
    method: 'post',
  },
  getidxlist: {
    url:'/wellapi/v1/getidxlist',
    method: 'post',
  },
})
export default class SimpleTransfer extends Component {
  static displayName = 'SimpleTransfer';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      ytList:[],
      wellnolist:[],
      wellflist:[],
      modellist:[],
      params:{
        yt:'',
        jh:'',
        qxm:'',
        model:'',
        linkstr:'',
        linktype:'',
      },
      data: [],
      disabled: true
    };
    this.handleYTChange = this.handleYTChange.bind(this);
    this.handleJHChange = this.handleJHChange.bind(this);
    this.handleModelChange=this.handleModelChange.bind(this);
  }

  componentDidMount() {
    //初始化页面配置-取油田配置
    this.props.updateBindingData('getYT', {url:'/' +config.urlSuffix+'/crud/oil_field_config/read'},(item) => {
      let  list = item.data.dataList
      list.map(data => {
        data['label']=data.yqtmc;
        data['value']=data.yqtbm;
      })

      this.setState({
        ytList:list
      })
    })

    //初始化页面配置-取模型配置
    this.props.updateBindingData('getModel', {url:'/' +config.urlSuffix+'/crud/model_config/read'},(item) => {
      let  list = item.data.dataList
      list.map(data => {
        data['label']=data.model_name;
        data['value']=data.id;
      })

      this.setState({
        modellist:list
      })
    })
  }
  //选择模型
  handleModelChange(value) {
    let params=this.state.params;
    params['model']=value;
    this.setState({params:params});
  }
  //选择井号
  handleJHChange(value) {
    let params=this.state.params;
    params['jh']=value;
    this.setState({params:params});
    let  url='/wellapi/v1/getwellflist';
    this.props.updateBindingData('getwellflist',{url:url,data: params}, (item) => {
      let list=[]
      item.wellflist.map(data => {
        let ds={
          label:data,
          value:data
        }
        list.push(ds)
      })
      this.setState({
        wellflist    :list,
      });
    });

  }
  //选择油田
  handleYTChange(value,actionType,item) {
    let params=this.state.params;
    params['yt']=value;
    params['linkstr']=item.conn_params;
    params['linktype']=item.source_type;
    this.setState({params:params});
    let url='/wellapi/v1/getJH';
    this.props.updateBindingData('getJH', {url:url,data: params}, (item) => {
      this.setState({
        wellnolist    :item.wellnolist,
      });
    });

  }
  //拖动曲线名
  handleChange = (value, data, extra) => {
    // console.log(value, data, extra);
    //判断曲线参数是否符号模型输入参数

  };

  render() {
    const {ytList, wellnolist,wellflist,modellist} = this.state;
    return (
      <IceContainer>
        <IceContainer  style={{display: 'flex',justifyContent: 'flex-start'}}>
          <Select placeholder="请选择模型" label="模型" dataSource={modellist}  onChange={this.handleModelChange} size='large' style={{width: 400}}/>
          <Select placeholder="请选择油田名称" label="油田" dataSource={ytList} onChange={this.handleYTChange} size='large' style={{width: 200}}/>
          <Select placeholder="请选择井号" label="井号"  dataSource={wellnolist}  onChange={this.handleJHChange} size='large' style={{width: 300}}/>
        </IceContainer>
        <Transfer
          listStyle={{ width: '540px', height: '192px' }}
          defaultValue={['9']}
          dataSource={wellflist}
          titles={['待选测井曲线文件名', '已选测井曲线文件名']}
          onChange={this.handleChange}
        />
      </IceContainer>
    );
  }
}
