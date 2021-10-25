import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import LineChart from '../LineChart';

const data = [
  {
    date: '2018-09-01',
    acc: 21323,
  },
  {
    date: '2018-09-02',
    acc: 52204,
  },
  {
    date: '2018-09-03',
    acc: 45451,
  },
  {
    date: '2018-09-04',
    acc: 78720,
  },
  {
    date: '2018-09-05',
    acc: 23592,
  },
  {
    date: '2018-09-06',
    acc: 67782,
  },
  {
    date: '2018-09-07',
    acc: 34344,
  },
];

const cols = {
  acc: {
    alias: '处理GB',
  },
};

export default class Commits extends Component {
  static displaydate = 'Commits';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <IceContainer title="本周数据流量">
          <LineChart cols={cols} data={data} axisdate="date" />
        </IceContainer>
      </div>
    );
  }
}
