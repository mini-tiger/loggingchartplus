import React, { Component } from 'react';
import BaseLineChart from './components/BaseLineChart';
import styles from './index.module.scss'
//import jsondata from '../jsondata/wella.json'

export default class V5 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  pickData(data, field) {
    return data.map(function(item) {
      var result = {};
      for (var key in item) {
        if (item.hasOwnProperty(key) && field.indexOf(key) !== -1) {
          result[key] = item[key];
        }
      }
      return result;
    });
  };

  render() {
    let chartData = this.props.data.dataList;
    if (chartData==undefined){
      return(<div></div>);
    }
    if(chartData.length ==0 ){
      return(<div></div>);
    }
    let axisWidth=20;
    let depthData={}
    let zmData=[]
    let param={}
    let indexList=[]
    if(this.props.data.configList !=undefined && this.props.data.configList.tempList!= undefined) {
      let tempList = this.props.data.configList.tempList;

      tempList.map((data)=>{
        if(data.zbmc=="DEPTH"){
          depthData=data;
        }else{
          zmData.push(data);
        }
      })

      for(var i=0;i<zmData.length;i++){
        let tempItem=zmData[i];
        let childItem={
          name:tempItem.zbmc,
          min:tempItem.min,
          max:tempItem.max,
          unit:tempItem.unit,
          scaletype:tempItem.log ? "log" : "linear",
          charttype:tempItem.lineType ? "line" : "area",
          direction:tempItem.direction ? "left" : "right",
          color:tempItem.lineColor,
          lineWeight:tempItem.lineWeight,
          tickCount:10,
          position:'DEPTH*'+tempItem.zbmc
        }
        if(param[tempItem.wayIndex] === undefined){

          indexList.push(tempItem.wayIndex)
          let depthItem={
            name:'DEPTH',
            charttype:'linear',
            min: this.props.nummin !=undefined ? this.props.nummin : this.props.initmin ,
            max: this.props.nummax !=undefined ? this.props.nummax : this.props.initmax ,
            // min:depthData.min,
            // max:depthData.max,
            axisWidth:axisWidth,
            tickCount:10,
            fields:["DEPTH",tempItem.zbmc],
          }
          param[tempItem.wayIndex]=[]
          param[tempItem.wayIndex].push(depthItem)
          param[tempItem.wayIndex].push(childItem)
          // console.log(depthItem)
        }else{
          param[tempItem.wayIndex][0].fields.push(tempItem.zbmc)
          param[tempItem.wayIndex].push(childItem)
        }
      }

    }
    //按照wayindex 排序
    indexList.sort();
    return (
      <div style={{width: '1600px',transform: 'rotate(90deg) translateX(67%) translateY(-250%)'}} className={styles.divchart}>
        {
          indexList.map((item,index )=> {
            let paramList = param[item];
            let fieldNames = paramList[0].fields
            let data = this.pickData(chartData, fieldNames);
            return(<BaseLineChart key={index} paramList={paramList}  data={data} />)
          })
        }
      </div>
    );
  }
}
