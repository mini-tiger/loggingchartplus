import React, { Component } from 'react';
import { Table, Pagination, Balloon, Icon ,Switch,NumberPicker,Input,Dialog,Range} from '@alifd/next';
import { SketchPicker,HuePicker } from 'react-color'
import styles from './index.module.scss';
import reactCSS from 'reactcss'
const getData = () => {
  return Array.from({ length: 10 }).map((item, index) => {
    return {
      id: index + 1,
      zbmc:Math.random().toString(36).slice(-8),
      unit:Math.random().toString(36).slice(-8),
      min:Math.round(Math.random()),
      max:Math.round(1000*Math.random()),
      log:Boolean(Math.round(Math.random())),
      grid:Boolean(Math.round(Math.random())),
      direction:Boolean(Math.round(Math.random())),
      lineColor:'#' + Math.floor( Math.random() * 0xffffff ).toString(16),
      lineWeight:Math.round(8*Math.random()),
      lineType:Boolean(Math.round(Math.random())),
      wayIndex:Math.round(8*Math.random()),
    };
  });
};

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      dataSource: getData(),
      visibleColor:false,
      currentIndex:0,
    };
    this.renderColor=this.renderColor.bind(this)
  }

  handlePagination = (current) => {
    this.setState({
      current,
    });
  };

  handleSort = (dataIndex, order) => {
    const dataSource = this.state.dataSource.sort((a, b) => {
      const result = a[dataIndex] - b[dataIndex];
      if (order === 'asc') {
        return result > 0 ? 1 : -1;
      }
      return result > 0 ? -1 : 1;
    });

    this.setState({
      dataSource,
    });
  };

  renderCatrgory = (value) => {
    return (
      <Balloon
        align="lt"
        trigger={<div className={styles.triggerMargin}>{value}</div>}
        closable={false}
        className={styles.balloonLineHeight}
      >
        皮肤科属于外科，主要治疗各种皮肤病，常见皮肤病有牛皮癣 、 疱疹
        、酒渣鼻等
      </Balloon>
    );
  };

  renderState = (value) => {
    return (
      <div>
        <span className={styles.circle} />
        <span className={styles.stateText}>{value}</span>
      </div>
    );
  };

  renderOper = () => {
    return (
      <div>
        <Icon type="edit" size="small" className={styles.editIcon} />
      </div>
    );
  };

  handleClick = (rowIndex) => {
    this.setState({ 
      visibleColor: true,
      currentIndex:rowIndex
     })
  };

  handleClose = () => {
    this.setState({ visibleColor: false })
  };

  handleChange = (rowIndex,fieldName,value) => {
    let dataList= this.state.dataSource
    if(fieldName=="lineColor"){
      dataList[rowIndex].lineColor = value.hex;
    }else{
      dataList[rowIndex][fieldName] = value;
    }
    this.setState({ dataSource: dataList })
    console.log("datasource",this.state.dataSource)
  };
  renderColor(fieldName,value,rowIndex){
    return(   
      <div style={{ width: '80px',height: '14px',borderRadius: '2px',backgroundColor: value }} onClick={ this.handleClick.bind(this,rowIndex) }/>
    );
  }
  renderSwitch(fieldName,value,rowIndex){
    if(fieldName == "lineType"){
      return <Switch defaultChecked={value} style={{width: '100%'}}  checkedChildren="折线图" unCheckedChildren="面积图" onChange={ this.handleChange.bind(this,rowIndex,fieldName)} />;
    }else if(fieldName == "direction"){
      return <Switch defaultChecked={value} size="small" checkedChildren="左" unCheckedChildren="右" onChange={ this.handleChange.bind(this,rowIndex,fieldName)} />;
    }else{
      return <Switch defaultChecked={value} size="small"  onChange={ this.handleChange.bind(this,rowIndex,fieldName)} />;
    }
  }
  renderRange(fieldName,value,rowIndex){
    return <Range min={1} max={8} setp={1} defaultValue={value} marks={7} marksPosition="below" style={{marginBottom: '0px',marginTop: '20px',width: '100%'}} onChange={ this.handleChange.bind(this,rowIndex,fieldName)} />;
  }
  renderNumber(fieldName,value,rowIndex){
    return <NumberPicker value={value} onChange={ this.handleChange.bind(this,rowIndex,fieldName)} />;
  }
  renderInput(fieldName,value,rowIndex){
    return <Input  value={value} maxLength={8} style={{width: '100%'}} onChange={ this.handleChange.bind(this,rowIndex,fieldName)} />;
  }
  render() {
    return (
      <div className={styles.tableContainer}>
        <Dialog
          title="请选择Color" footer={false}
          visible={this.state.visibleColor}
          onClose={this.handleClose}>
          <SketchPicker color={ this.state.color } onChange={ this.handleChange.bind(this,this.state.currentIndex,'lineColor')} />
        </Dialog>
        <Table
          dataSource={this.props.tempList}
          onSort={this.handleSort}
          hasBorder={false}
          className="custom-table"
        >
          <Table.Column width={60} align="center" title="序列" dataIndex="id" lock/>
          <Table.Column width={100} align="center" title="测井曲线" dataIndex="zbmc" />
          <Table.Column width={200} align="center" title="图道" dataIndex="wayIndex" cell={this.renderRange.bind(this,"wayIndex")}/>
          <Table.Column width={100} align="center" title="单位" dataIndex="unit" cell={this.renderInput.bind(this,"unit")}/>
          <Table.Column width={100} align="center" title="最小值" dataIndex="min" cell={this.renderNumber.bind(this,"min")}/>
          <Table.Column width={100} align="center" title="最大值" dataIndex="max" cell={this.renderNumber.bind(this,"max")}/>
          <Table.Column width={100} align="center" title="取对数" dataIndex="log" cell={this.renderSwitch.bind(this,"log")}/>
          <Table.Column width={100} align="center" title="线色" dataIndex="lineColor" cell={this.renderColor.bind(this,"lineColor")}/>
          <Table.Column width={100} align="center" title="线型" dataIndex="lineType" cell={this.renderSwitch.bind(this,"lineType")}/>
          <Table.Column width={200} align="center" title="线宽" dataIndex="lineWeight" cell={this.renderRange.bind(this,"lineWeight")}/>
          <Table.Column width={100} align="center" title="网格" dataIndex="grid" cell={this.renderSwitch.bind(this,"grid")}/>
          <Table.Column width={100} align="center" title="方向" dataIndex="direction" cell={this.renderSwitch.bind(this,"direction")}/>
        </Table>
      </div>
    );
  }
}

