import React, { Component } from 'react';
import { Nav } from '@alifd/next';
import { withRouter, Link } from 'react-router-dom';
import FoundationSymbol from '@icedesign/foundation-symbol';
import { asideMenuConfig } from '../../../../menuConfig';

import './Aside.scss';

@withRouter
export default class BasicLayout extends Component {
  render() {
    const { location } = this.props;
    var pathname =location.pathname;
    var pathHead="/"+pathname.split("/")[1];
    // console.log(location.pathname,pathHead)
    let selected=false

    return (
      <Nav activeDirection={null} selectedKeys={[pathname]} className="ice-menu-custom">
        {Array.isArray(asideMenuConfig) &&
          asideMenuConfig.length > 0 &&
          asideMenuConfig.map((nav) => {
            selected = nav.path.startsWith(pathHead)
            return (
              <Nav.Item key={nav.path} className={selected ? 'next-selected' :''}>
                <Link to={nav.path} className="next-selected ice-menu-link">
                  {nav.icon ? (
                    <FoundationSymbol size="small" type={nav.icon} />
                  ) : null}
                  <span className="ice-menu-item-text"  >{nav.name}</span>
                </Link>
              </Nav.Item>
            );
          })}
      </Nav>
    );
  }
}
