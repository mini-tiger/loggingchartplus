import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Input, Select, Grid, Form } from '@alifd/next';
import styles from './index.module.scss';

const { Row, Col } = Grid;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { xxs: 8, s: 6, l: 4 },
  wrapperCol: { s: 12, l: 12 },
};

export default class Index extends Component {
  static displayName = 'Index';

  onFormChange = (values, field) => {
    console.log(values, field);
  };

  reset = () => {};

  submit = (values, errors) => {
    console.log('error', errors, 'value', values);
    if (!errors) {
      // 提交当前填写的数据
    } else {
      // 处理表单报错
    }
  };

  render() {
    return (
      <div className="column-form">
        <IceContainer title="活动在线报名" className={styles.container}>
          <Form onChange={this.onFormChange}>
            <div>
              <Row wrap>
                <Col xxs="24" s="12" l="12">
                <FormItem
                    label="活动类别:"
                    {...formItemLayout}
                    required
                    requiredMessage="请选择活动类别"
                  >
                    <Select
                      name="hdlb"
                      className={styles.selectWidth}
                      dataSource={[
                        { label: '市级', value: 'month' },
                        { label: '区级', value: 'season' },
                        { label: '校级', value: 'year' },
                      ]}
                    />
                  </FormItem>

                  <FormItem
                    label="申请原因:"
                    {...formItemLayout}
                    required
                  >
                    <Select
                      name="period"
                      className={styles.selectWidth}
                      dataSource={[
                        { label: '教学大纲', value: 'month' },
                        { label: '政治课程', value: 'season' },
                        { label: '历史课程', value: 'year' },
                      ]}
                    />
                  </FormItem>
                  <FormItem
                    label="自主活动:"
                    {...formItemLayout}
                    required
                  >
                    <Select
                      name="period"
                      className={styles.selectWidth}
                      dataSource={[
                        { label: '教学大纲', value: 'month' },
                        { label: '政治课程', value: 'season' },
                        { label: '历史课程', value: 'year' },
                      ]}
                    />
                  </FormItem>

                  <FormItem
                    label="活动介绍："
                    {...formItemLayout}
                    required
                    requiredMessage="请输入活动介绍"
                  >
                    <Input name="hdjs" />
                  </FormItem>

                  <FormItem
                    label="个人感受："
                    {...formItemLayout}
                    required
                    requiredMessage="请输入个人感受"
                  >
                    <Input name="grgs" />
                  </FormItem>

                </Col>

                <Col xxs="24" s="12" l="12">
                <FormItem
                    label="学年:"
                    {...formItemLayout}
                    required
                    requiredMessage="请选择活学年"
                  >
                    <Select
                      name="period"
                      className={styles.selectWidth}
                      dataSource={[
                        { label: '2016', value: 'month' },
                        { label: '2017', value: 'season' },
                        { label: '2018', value: 'year' },
                      ]}
                    />
                  </FormItem>
                  <FormItem
                    label="活动时间："
                    {...formItemLayout}
                    required
                    requiredMessage="活动时间必须填写"
                  >
                    <Input name="hdsj" />
                  </FormItem>
                  <FormItem
                    label="活动名称："
                    {...formItemLayout}
                  >
                    <Input name="hdmc" />
                  </FormItem>
                  <FormItem
                    label="活动地点："
                    {...formItemLayout}
                  >
                    <Input name="hdmc" />
                  </FormItem>
                </Col>
              </Row>

              <Row className={styles.btns}>
                <Col xxs="8" s="2" l="2" className={styles.formLabel}>
                  {' '}
                </Col>
                <Col s="12" l="10">
                  <Form.Submit type="primary" validate onClick={this.submit}>
                    立即创建
                  </Form.Submit>
                  <Form.Reset className={styles.resetBtn} onClick={this.reset}>
                    重置
                  </Form.Reset>
                </Col>
              </Row>
            </div>
          </Form>
        </IceContainer>
      </div>
    );
  }
}


