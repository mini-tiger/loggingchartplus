import React, { Component } from 'react';
import { Transfer } from '@alifd/next';
import IceContainer from '@icedesign/container';
import { Upload } from '@alifd/next';


const mockData = () => {
  const dataSource = [];

  for (let i = 0; i < 10; i++) {
    dataSource.push({
      label: `Task${i + 1}`,
      value: `${i}`,
      disabled: i % 4 === 0,
    });
  }

  return dataSource;
};

export default class SimpleTransferUpload extends Component {
  static displayName = 'SimpleTransferUpload';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {

    };

  }
  handleChange = (value, data, extra) => {
    // console.log(value, data, extra);
  };
  onDragOver =()=>  {
    // console.log('dragover callback');
  }

  onDrop =(fileList)=>  {
    // console.log('drop callback : ', fileList);
  }
  render() {
    const {data, disabled, province, city} = this.state;
    return (
      <IceContainer>
        <div >
          <Upload.Dragger
              listType="image"
              action="https://www.easy-mock.com/mock/5b713974309d0d7d107a74a3/alifd/upload"
              accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
              onDragOver={this.onDragOver}
              onDrop={this.onDrop}
          />
        </div>
        <Transfer
          listStyle={{ width: '540px', height: '192px' }}
          defaultValue={['9']}
          dataSource={mockData()}
          titles={['待选井', '已选井']}
          onChange={this.handleChange}
        />
      </IceContainer>
    );
  }
}
