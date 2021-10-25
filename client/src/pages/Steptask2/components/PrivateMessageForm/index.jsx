import React, { Component } from 'react';
import { Input, Button, Grid, Message } from '@alifd/next';
import IceContainer from '@icedesign/container';

const { Row, Col } = Grid;
const Toast = Message;

export default class PrivateMessageForm extends Component {
  static displayName = 'PrivateMessageForm';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      message: '',
    };
  }

  titleChange = (title) => {
    this.setState({
      title,
    });
  };

  messageChange = (message) => {
    this.setState({
      message,
    });
  };

  sendMessage = () => {
    const { title, message } = this.state;
    if (title && message) {
      Toast.success('发送成功');
      return;
    }
    Toast.error('您还有未填项');
  };

  render() {
    return (
      <div className="private-message-form">
        <IceContainer >
          <Row style={{marginBottom: '20px'}}>
            <Col xxs="5" s="5" l="2">
              任务名称
            </Col>
            <Col s="14" l="7">
              <Input
                style={{ width: '100%' }}
                value={this.state.title}
                onChange={this.titleChange}
                placeholder="请输入标题"
              />
            </Col>
          </Row>

          <Row style={{marginBottom: '20px'}}>
            <Col xxs="5" s="5" l="2">
              任务描述
            </Col>
            <Col s="14" l="7">
              <Input.TextArea
                style={{ width: '100%' }}
                value={this.state.message}
                onChange={this.messageChange}
                placeholder="请输入内容" />
            </Col>
          </Row>

        </IceContainer>
      </div>
    );
  }
}

