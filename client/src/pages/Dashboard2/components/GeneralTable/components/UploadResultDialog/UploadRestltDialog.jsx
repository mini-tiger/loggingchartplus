import {Button, Message, Dialog} from '@alifd/next';
import ReactJson from 'react-json-view'
import React, {Component} from 'react';

export default function UploadRestltDialog(ResultJson) {
  // let json = {}

  let json = ResultJson.data
  // console.log(json)
  // console.log(typeof json)
  Dialog.confirm({
    title: '上传返回',
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
