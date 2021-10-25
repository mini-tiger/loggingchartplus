import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Grid } from '@alifd/next';
import routerData from '../../routerConfig';

const { Row, Col } = Grid;

export default class unLoginLayout extends Component {
  render() {
    return (
      <div style={styles.container}>
        <Switch>
          {routerData.map((item, index) => {
            return item.component ? (
              <Route
                key={index}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ) : null;
          })}
        </Switch>
      </div>
    );
  }
}

const styles = {
  container: {
    position: 'relative',
    width: '100wh',
    minWidth: '1000px',
    height: '100vh',
    backgroundSize: 'cover',
    display: 'flex',
    flexDirection: 'column',
  }
};
