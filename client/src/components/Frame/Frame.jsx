import React from 'react';
import IceContainer from '@icedesign/container';
import ReactDOM from 'react-dom';
import task from '../../utils/task';
const Frame = () => {
  constructor(props) {
    super(props);
    this.state = {
      url:this.props.url,
      iFrameHeight:this.props.iFrameHeight,
    };
  }
  componentDidMount() {
    //初始化页面配置
    let pathname = this.props.location.pathname;
    this.setState({
      url:'http://' + task.cmdbHost + ':' + task.cmdbPort +
    })
  }
  return (
    <IceContainer style={{ minHeight: '500px', paddingLeft: '40px' }}>
      <iframe
        style={{width:'100%', height:this.state.iFrameHeight, overflow:'visible'}}
        onLoad={() => {
        const obj = ReactDOM.findDOMNode(this);
        this.setState({
        "iFrameHeight": obj.ownerDocument.body.scrollHeight + 'px'
        });
        }}
        ref="iframe"
        src={this.state.url}
        width="100%"
        height={this.state.iFrameHeight}
        scrolling="no"
        frameBorder="0"
      />
    </IceContainer>
  );
};

const styles = {
  item: {
    height: '34px',
    lineHeight: '34px',
  },
};

export default Frame;
