import {Button, Message, Dialog} from '@alifd/next';
import ReactJson from 'react-json-view'
import React, {Component} from 'react';

export default function UploadRestltDialog(title,ResultJson) {
  // let json = {}

  let json = ResultJson.errRows;
  // console.log(json)
  // console.log(typeof json)
  Dialog.confirm({
    title: title,
    content: <ReactJson displayDataTypes={false} name="θΏεη»ζ" src={json}/>,
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
