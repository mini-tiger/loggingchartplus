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

class Testcase extends React.Component {
  render() {
    // 模拟各个系统的单元测试覆盖率数据
    const data = []; // 生成数据

    for (let i = 0; i < 15; i++) {
      const name = "系统" + i;
      const value = Math.random() * 90;

      for (let j = 1; j < 10; j++) {
        const obj = {};
        obj.name = name;
        obj.value = (value + Math.random() * 10) / 100;
        obj.time = "10-0" + j;
        data.push(obj);
      }
    } // 自定义带有宽度的色块

    G2.Shape.registerShape("polygon", "custom", {
      draw: function(cfg, container) {
        const points = this.parsePoints(cfg.points);
        const startX = points[1].x;
        const startY = points[1].y;
        const size = cfg.size || 1;
        const width = points[2].x - points[1].x;
        const height = Math.abs(points[1].y - points[0].y); // 绘制背景

        container.addShape("rect", {
          attrs: {
            x: startX,
            y: startY,
            width: width,
            height: height
          }
        }); // 绘制色块

        return container.addShape("rect", {
          attrs: {
            x: startX,
            y: startY,
            width: width * size,
            height: height,
            fill: cfg.color,
            stroke: "#fff"
          }
        });
      }
    });
    const scale = {
      time: {
        type: "cat"
      },
      value: {
        alias: "覆盖率",
        type: "linear",
        formatter: function(value) {
          return (value * 100).toFixed(2) + "%";
        },
        min: 0,
        max: 1
      }
    };

    class SliderChart extends React.Component {
      render() {
        return (
          <Chart
            height={window.innerHeight}
            data={data}
            scale={scale}
            padding={[20, 80, 150]}
            forceFit
          >
            <Legend
              slidable={false}
              width={165}
              itemFormatter={val => {
                return val.slice(0, val.indexOf(".")) + "%";
              }}
            />
            <Tooltip />
            <Axis name="name" grid={null} />
            <Axis name="time" line={null} tickLine={null} />
            <Geom
              type="polygon"
              position="time*name"
              color={[
                "value",
                "rgb(215, 25, 28)-rgb(231, 104, 24)-rgb(242, 158, 46)-rgb(249, 208, 87)-rgb(255, 255, 140)-rgb(144, 235, 157)-rgb(0, 204, 188)-rgb(0, 166, 202)-rgb(44, 123, 182)"
              ]}
              shape="triangleShape"
              size={[
                "value",
                function(size) {
                  return size;
                }
              ]}
              shape="custom"
              style={{
                lineWidth: 1,
                stroke: "#fff"
              }}
            />
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

export default Testcase;
