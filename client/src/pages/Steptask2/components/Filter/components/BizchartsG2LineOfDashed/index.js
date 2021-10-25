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
  Facet,
  Util
} from "bizcharts";
import jsondata from '../../../jsondata/wella.json';

class Lineofdashed extends React.Component {
  render() {
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
        return '<span style="color:'+color+'">|</span>';
      }else{
        return '<span style="color:'+color+';font-size:12px;display:block;transform:rotate(-90deg);">'+text+'</span>';
      }
    };
    var tickCount = 10;
    var scale = {
      DEPTH: {
        alias: "DEPTH",
        type:"linear",
      },
      DEN: {
        min: 2,
        max:3,
        tickCount: tickCount,
      },
      DEN_norm: {
        min: 2,
        max:3,
        tickCount: tickCount,
      },
    };

    const label = {
      DEN: {
        offset:20,
        rotate: -90,
        autoRotate:false,
        htmlTemplate(text, item, index) {
          return labelHtmlTemplate(text, index,tickCount-1,'red');
        },
      },
      DEN_norm: {
        offset:50,
        rotate: -90,
        autoRotate:false,
        htmlTemplate(text, item, index) {
          return labelHtmlTemplate(text, index,tickCount,'grey');
        },
      },
    };
    const title = {
      DEN: {
        offset:30,
        autoRotate:false,
        textStyle: {
          fill: 'red',
          rotate : -90
        },
      },
      DEN_norm: {
        offset:60,
        autoRotate:false,
        textStyle: {
          fill: 'grey',
          rotate : -90
        },
      },
    };
    class SliderChart extends React.Component {
      render() {
        return (
          <Chart height={200} padding={[20, 0, 0, 100]} forceFit scale={scale}
            data={pick(jsondata, ["DEN", "DEN_norm", "DEPTH"])}>
            <Tooltip />
            <Axis name="DEPTH" label={null} />
            <Axis name="DEN"  label={label.DEN} title={title.DEN} grid={null}/>
            <Axis name="DEN_norm"  label={label.DEN_norm} title={title.DEN_norm} position="left" />
            
            <Geom type="line" position="DEPTH*DEN" color={title.DEN.textStyle.fill} size={2}/>
            <Geom type="line" position="DEPTH*DEN_norm" color={title.DEN_norm.textStyle.fill} size={2} />

          </Chart>
        );
      }
    }
    return (
      <div>
        <SliderChart />
      </div>
    );
  }
}

export default Lineofdashed;
