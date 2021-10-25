import styles from './index.module.scss'
import React from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
} from "bizcharts";

class BaseLineChart extends React.Component {

    render() {
      let data = this.props.data;
      let paramList = this.props.paramList;

      function labelHtmlTemplate(text, index, itemParam,itemIndex) {
        if (index == 0) {
          return '<div style="display:flex; justify-content: space-between; padding: 5px 10px; align-items: flex-end; transform:rotate(-90deg) translateY(-13px); position: absolute; width:200px;height:60px;border:1px solid #f2f2f2;bottom: 70px; left: -100px; z-index: 100;"><i style="position: absolute; top: 50%;left: 0; height: 1px; width: 100%;  border: 0 none; border-bottom: 1px dashed ' + itemParam.color + '; transform: translateY(-2px);"></i><span style="color:' + itemParam.color + '">' + itemParam.min + '</span><div style="height: 50px; display: flex;  flex-direction: column; justify-content: space-between; align-items: center;"><span style="color:' + itemParam.color + ';">' + itemParam.name +'</span><span style="color:' + itemParam.color + ';">' +itemParam.unit + '</span></div><span style="color:' + itemParam.color + '">' + itemParam.max + '</span></div>'
        /*}else{
          if(itemParam.scaletype=="log" && itemIndex==1){
            return '<div style="padding: 5px 20px; ">'+text+"</div>"
          }*/
        }
      };

      function getLabel(itemIndex) {
        let itemParam = paramList[itemIndex];
        let label = {
          autoRotate: false,
          rotate: -90,
          offset: 60 * (itemIndex),
          htmlTemplate(text, item, index) {
            return labelHtmlTemplate(text, index, itemParam,itemIndex);
          },
        };
        return label;
      };

      function getTitle(index) {
        let item = paramList[index];
        let title = {
          autoRotate: false,
          offset: 0,
          textStyle: {
            fill: item.color,
            rotate: -90
          },
        }
        return title;
      };

      let scaleSet = {};
      paramList.map((item, index) => {
          scaleSet[item.name] = {
            alias: item.name,
            type: item.scaletype,
            base:10,
            min: item.min,
            max: item.max,
            tickCount: item.tickCount,
          }
      });

      class SliderChart extends React.Component {
        render() {
          return ( <Chart height = {
              (200+paramList[0].axisWidth)
            }
            padding = "auto"
            forceFit scale = {
              scaleSet
            }
            data = {
              data
            } >
            <
            Tooltip / >

            {
              paramList.map((item, index) => {
                if (index == 0) {
                  return (<Axis key={index} name={item.name}/>)
                }else{
                  if(item.scaletype== "log"){
                    return (<Axis key={index} name={item.name} label={getLabel(index)} position="left"/>)
                  } else {
                    return (<Axis key={index} name={item.name} label={getLabel(index)} position="left" />)
                  }
                }
              })
            }
            {
              paramList.map((item, index) => {
                if (index >= 1) {
                  return(<Geom key = {index} type={item.charttype} position={item.position} color={item.color} size={item.lineWeight}/>)
                }
              })
            } </Chart>
            );
          }
        }
        return ( <div >
          <SliderChart />
          </div>
        );
      }
    }

    export default BaseLineChart;
