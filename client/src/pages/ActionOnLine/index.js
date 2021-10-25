import React, { Component } from 'react';
import ColumnForm from './components/ColumnForm';

export default class ActionOnLine extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="action-on-line-page">
        <ColumnForm />
      </div>
    );
  }
}
