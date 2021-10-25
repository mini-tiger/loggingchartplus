import React, { Component } from 'react';
import DataBinder from '@icedesign/data-binder';
import IceContainer from '@icedesign/container';
import { NumberPicker,Step,Button ,Loading,Tab,Pagination,Grid,Input,Select,Transfer,Message,Notification,Typography,Table} from '@alifd/next';
import styles from './index.module.scss';
import IcePanel from '@icedesign/panel';
import IceLabel from '@icedesign/label';
const { H1, H2,H3,H4, Paragraph, Text } = Typography;
const { Item: StepItem } = Step;
const { Group: ButtonGroup } = Button;
const { Row, Col } = Grid;
//import jsondata from '../jsondata/wella.json'

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    // console.log(this.props.defaultQX);

    let min=this.props.min;
    let max=this.props.max
    const temp=this.props.temp;
    const isLoading=this.props.isLoading;

    return (
      <div >
        <Loading
            fullScreen
            visible={isLoading}
        />
        <Row>
          <Col span={6}>
            <Select
                placeholder="请选择曲线文件名" label="曲线文件名"
                dataSource={this.props.params.checkedlist}
                onChange={this.props.handleChangeSingle}
                size='large' style={{width: 300}}/>
          </Col>
          <Col span={8}>
            {/* <IceLabel status={"primary"} style={{fontSize: '16px',"margin":"5px"}}>请选择模板:</IceLabel> */}
            <Select
            label="请选择模板"
                dataSource={this.props.tempList}
                // defaultValue={this.state.tempList[0].value}
                value={temp}
                onChange={this.props.handleChangeModle}
                size='large' style={{width: 300}}/>
          </Col>
          <Col span={8} style={{margin: 0}}>
            <IceLabel status={"primary"} style={{fontSize: '16px',"margin":"5px"}}>深度范围:</IceLabel>

              <NumberPicker style={{"margin":"5px", width: 60}} value={min}  min={this.props.initmin} max={this.props.initmax}  onChange={this.props.numchangemin} />
              <NumberPicker style={{"margin":"5px", width: 60}} value={max}  min={this.props.initmin} max={this.props.initmax}  onChange={this.props.numchangemax} />
            <Button style={{"margin":"5px"}} onClick={this.props.actionNumChange}>确定</Button>
          </Col>
        </Row>
      </div>
    );

  }
}
