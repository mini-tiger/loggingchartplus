import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Logo extends Component {
  render() {
    return (
      <div style={styles.container}>
        <img src={require('./images/sinopec.gif')} />
        <Link to="/" style={styles.logoText}>

        测井智能解释小助手
        </Link>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '20px',
  },
  logoText: {
    display: 'block',
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginLeft: '10px',
    fontSize: '20px',
    color: '#333',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  img:{
    height:'60px'
  }
};
