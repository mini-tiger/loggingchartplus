import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Step, Button } from '@alifd/next';
import styles from './index.module.scss';

const { Item: StepItem } = Step;
const { Group: ButtonGroup } = Button;

export default class SimpleStep extends Component {
  static displayName = 'SimpleStep';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 3,
    };
  }

  next = () => {
    const s = this.state.currentStep + 1;

    this.setState({
      currentStep: s > 6 ? 6 : s,
    });
  };

  prev = () => {
    const s = this.state.currentStep - 1;

    this.setState({
      currentStep: s < 0 ? 0 : s,
    });
  };

  onClick = (currentStep) => {

    this.setState({
      currentStep,
    });
  };

  render() {
    const { currentStep } = this.state;

    return (
      <IceContainer title="步骤条">
        <Step shape="arrow" current={currentStep}>
          <StepItem title="步骤1:任务信息" onClick={this.onClick} />
          <StepItem title="步骤2:数据加载" onClick={this.onClick} />
          <StepItem title="步骤3:数据检查" onClick={this.onClick} />
          <StepItem title="步骤4:测井解释" onClick={this.onClick} />
          <StepItem title="步骤5:解释成果" onClick={this.onClick} />
        </Step>
        <div className={styles.buttonGroup}>
          <ButtonGroup>
            <Button
              onClick={this.prev}
              type="primary"
              disabled={currentStep === 0}
            >
              上一步
            </Button>
            <Button
              onClick={this.next}
              type="primary"
              disabled={currentStep === 5}
            >
              下一步
            </Button>
          </ButtonGroup>
        </div>
      </IceContainer>
    );
  }
}


