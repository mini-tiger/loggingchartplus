import {Button, Message, Dialog} from '@alifd/next';
import ReactJson from 'react-json-view'
import React, {Component} from 'react';

export default function UploadRestltDialog(ResultJson) {
  // let json = {}

  let json = ResultJson.data
  let result="失败上传"
  if (json.result){
    result="成功上传"
  }
  Dialog.confirm({
    title: result,
    content: <ReactJson displayDataTypes={false} name="返回结果" src={json}/>,
    // onOk: () => {
    //   return new Promise(resolve => {
    //     setTimeout(resolve, 2000);
    //   }).then(() => {
    //     Message.success('Deleted successfully!');
    //   });
    // }
  });

};

// ReactDOM.render(<Button type="primary" warning onClick={popupConfirm}>Delete</Button>, mountNode);
