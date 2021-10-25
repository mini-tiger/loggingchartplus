import React, { Component } from 'react';
import { Button, Input, Select } from '@alifd/next';
import styles from './index.module.scss';
export default class TableFilter extends Component {
  static displayName = 'TableFilter';

  constructor(props) {
    super(props);
    this.state = {
      templateName:'',
      currentModel:{}
    };
    this.onChangeTempName=this.onChangeTempName.bind(this)
    this.onChangeSelect=this.onChangeSelect.bind(this)
    this.onAdd=this.onAdd.bind(this)
    this.onSave=this.onSave.bind(this)
  }
  onSave(){
    this.props.saveTemplate()
  }
  onAdd(){
    let model = this.state.currentModel
    let inParams = "DEPTH," +  model.inparamslist
    let arrParams = inParams.split(",")
    let tempData=[]
    for(var i=0;i<arrParams.length;i++){
      let param = {}
      param["id"]=i + 1
      param["zbmc"]=arrParams[i]
      param["unit"]=""
      param["min"]=0
      param["max"]=0
      param["log"]=false
      param["grid"]=true
      param["direction"]=false
      param["lineColor"]="#0ff"
      param["lineWeight"]=1
      param["lineType"]=true
      param["wayIndex"]=1
      tempData.push(param)
    }
    this.props.addTemplate(tempData);
  }
  onChangeTempName(value){
    this.setState({
      templateName:value
    })
  }
  onChangeSelect(value,actionType,item){
    this.setState({
      currentModel:item
    })
  }
  render() {
    return (
      <div className={styles.tableFilter}>
        <div className={styles.title}>测井图模板配置管理</div>
        <div className={styles.filter}>
          <div className={styles.filterItem}>
            <span className={styles.filterLabel}>模型名称：</span>
            <Select className={styles.selectWidth} dataSource={this.props.modelList} onChange={this.onChangeSelect}/>
          </div>
          <div className={styles.filterItem}>
            <span className={styles.filterLabel}>模板名称：</span>
            <Select className={styles.selectWidth}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="checked">已审核</Select.Option>
              <Select.Option value="unCheck">未审核</Select.Option>
            </Select>
          </div>
          <div className={styles.filterItem}>
            <span className={styles.filterLabel}>新建模板名称：</span>
            <Input onChange={this.onChangeTempName}/>
          </div>
          <Button type="primary" className={styles.submitButton} onClick={this.onAdd}>
            新建模板
          </Button>
          <Button type="primary" className={styles.submitButton} onClick={this.onSave}>
            保存模板
          </Button>
        </div>
      </div>
    );
  }
}
