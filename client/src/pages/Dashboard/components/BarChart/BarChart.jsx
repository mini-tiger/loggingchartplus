import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';

const data = [
  {
    name: '待执行任务',
    value: 38,
  },
  {
    name: '合并任务',
    value: 0,
  },
  {
    name: '新增任务',
    value: 61,
  },
  {
    name: '异常任务',
    value: 10,
  },
  {
    name: '已关闭任务',
    value: 89,
  },
];

const cols = {
  value: {
    tickInterval: 20,
  },
};

export default class BarChart extends Component {
  static displayName = 'BarChart';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <IceContainer title="本周任务">
        <Chart height={400} padding={[40]} data={data} scale={cols} forceFit>
          <Axis name="name" />
          <Axis name="value" />
          <Tooltip
            crosshairs={{
              type: 'y',
            }}
          />
          <Geom type="interval" position="name*value" />
        </Chart>
      </IceContainer>
    );
  }
}
