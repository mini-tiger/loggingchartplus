import React, { Component } from 'react';
import AuthorityTable from './components/AuthorityTable';

export default class DataSourceConf extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="data-source-conf-page">
        <AuthorityTable />
      </div>
    );
  }
}
