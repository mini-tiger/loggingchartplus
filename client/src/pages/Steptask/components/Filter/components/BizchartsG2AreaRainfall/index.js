import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  FCALet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import Slider from "bizcharts-plugin-slider";

import data from "./mock.json";
import jsondata from '../../../jsondata/wella.json'

function pick(data, field) {
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
function labelHtmlTemplate(text,index, count,color) {
  // 自定义 html 模板
  if(index>0 && index<(count-1)){
    return '<GRan style="color:'+color+'">|</GRan>';
  }else{
    return '<GRan style="color:'+color+';font-size:12px;display:block;transform:rotate(-90deg);">'+text+'</GRan>';
  }
};
var tickCount = 10;
function getComponent(data) {
  const scale = {
    DEPTH: {
      alias: "DEPTH",
      type:"linear",
    },
    CAL: {
      min: 6,
      max:16,
      tickCount: tickCount+1,
    },
    AC: {
      min: 40,
      max:240,
      tickCount: tickCount,
    },
  };
  const title = {
    CAL: {
      offset:30,
      autoRotate:false,
      textStyle: {
        fill: 'green',
        rotate : -90
      },
    },
    AC: {
      offset:60,
      autoRotate:false,
      textStyle: {
        fill: 'red',
        rotate : -90
      },
    },
  };
  const label = {
    CAL: {
      offset:20,
      rotate: 0,
      autoRotate:false,
      htmlTemplate(text, item, index) {
        return labelHtmlTemplate(text, index,11,'green');
      },
    },
    AC: {
      offset:50,
      rotate: 0,
      autoRotate:false,
      htmlTemplate(text, item, index) {
        return labelHtmlTemplate(text, index,11,'red');
      },
    },
  };
  let chart;

  class SliderChart extends React.Component {
    render() {
      return (
        <div>
          <Chart height={200} padding={[20, 0, 20, 100]} forceFit 
           scale={scale} >
            
            <Tooltip />
            <View data={pick(jsondata, ["CAL", "AC", "DEPTH"])}>
              <Axis name="CAL"  label={label.CAL} title={title.CAL} />
              <Geom
                type="area" position="DEPTH*CAL"
                color="green"
                opCALity={0.85}
              />
            </View>
            <View  data={pick(jsondata, ["CAL", "AC", "DEPTH"])}>
              <Axis name="AC"  label={label.AC} title={title.AC} position="left" grid={null}/>
              <Coord reflect />
              <Geom
                type="area"
                position="DEPTH*AC"
                color="red"
                opCALity={0.85}
              />
            </View>
          </Chart>
        </div>
      );
    }
  }
  return SliderChart;
}

class Arearainfall extends React.Component {
  render() {
    const SliderChart = getComponent(data);
    return (
      <div>
        <SliderChart />
      </div>
    );
  }
}

export default Arearainfall;
