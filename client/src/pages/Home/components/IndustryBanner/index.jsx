import React, {Component} from 'react';
import styles from './index.module.scss';
import { Table, Progress, Pagination,Slider } from '@alifd/next';
export default class Index extends Component {
  static displayName = 'Index';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      m: "",
      messages:["测试信息1", "测试处处2"],
      mlen:2
    };
  }

  componentDidMount() {

  }



  componentWillUnmount() {

  }

  render() {
    const m = this.state.messages;
    return (
        <div className={styles.industryBannerContainer}>
          <img
              src={require('./images/home.png')}
              className={styles.industryBannerImg}
              alt=""
          />
          <div className={styles.industryNotice}>
            <h3 className={styles.industryTitle}>公告板</h3>
            <Slider arrows={false} autoplay autoplaySpeed={3000} slideDirection="ver" dots={false} arrowPosition="inner" arrowDirection="ver" className="ver-slick">
              {
                m.map((item, index) => <div key={index} className="custom-slider"><h3 className="h3">{item}</h3></div>)
              }
            </Slider>

          </div>
        </div>
    );
  }
}

