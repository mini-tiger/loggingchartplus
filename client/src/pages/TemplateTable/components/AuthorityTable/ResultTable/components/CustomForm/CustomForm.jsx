/* eslint react/no-string-refs:0, array-callback-return:0, react/forbid-prop-types:0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon, Collapse, Search} from '@alifd/next';
import {TreeSelect, Radio, Checkbox, Input, Button, Grid, Select, DatePicker} from '@alifd/next';
import {
    FormBinderWrapper as IceFormBinderWrapper,
    FormBinder as IceFormBinder,
    FormError as IceFormError,
} from '@icedesign/form-binder';
import EditDialog from './EditDialog';
import moment from 'moment';

import commonstyles from '../../GeneralTable.scss'
import SearchFilter from "../../GeneralTable";

const Panel = Collapse.Panel;

const {Row, Col} = Grid;
const {RangePicker} = DatePicker;
const RadioGroup = Radio.Group;
const {Group: CheckboxGroup} = Checkbox;


class CustomForm extends Component {
    static displayName = 'CustomForm';

    static propTypes = {
        value: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func,
        handleReset: PropTypes.func,
        handleCreate: PropTypes.func,
        downloadTpl: PropTypes.func,
        extraContent: PropTypes.element,
    };

    static defaultProps = {
        extraContent: null,
        handleReset: () => {
        },
        handleSubmit: () => {
        },
        handleCreate: () => {
        },
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.refs.form.validateAll((errors, values) => {
            values.pagesize = this.props.pagesize;
            values.page = 1;
            // values['DDXQJZSJ']=[moment(moment().format("YYYY-01-01")),moment(moment().add(1, 'y').format("YYYY-01-01"))]
            this.props.handleSubmit(errors, values);
        });
    };


    renderInput2 = (item, index) => {
        if (item.field_id === 'BIANMA') {
            return (
                <Col l="8" key={'renderInput2' + index}>
                    <div style={styles.formItem}>
                        <span style={styles.formLabel}>{item.field_name}：</span>
                        <IceFormBinder name={item.field_id} message={'请输入正确的' + item.field_name}>
                            <Search dataSource={this.props.orderValues}
                                    hasIcon={false}
                                    type="primary"
                                    style={{width: 200}}
                                // defaultValue={defaultValue}
                                    hasClear
                            />
                        </IceFormBinder>
                        <div style={styles.formError}>
                            <IceFormError name={item.field_id}/>
                        </div>
                    </div>
                </Col>
            )
        }
        return (
            <Col l="8" key={'renderInput2' + index}>
                <div style={styles.formItem}>
                    <span style={styles.formLabel}>{item.field_name}：</span>
                    <IceFormBinder name={item.field_id} message={'请输入正确的' + item.field_name}>
                        <Input placeholder={'请输入' + item.field_name} style={{width: 200}} hasClear/>
                    </IceFormBinder>
                    <div style={styles.formError}>
                        <IceFormError name={item.field_id}/>
                    </div>
                </div>
            </Col>
        );
    };

    renderSelect2 = (item, index) => {
        let datasource = this.props.dictConfig[item.relation_data];
        return (
            <Col l="8" key={'renderSelect2' + index}>
                <div key={"key-field-" + index} style={styles.formItem}>
                    <span style={styles.formLabel}>{item.field_name}：</span>
                    <IceFormBinder name={item.field_id} message={'请输入正确的' + item.field_name}>
                        <Select dataSource={datasource} placeholder={'请输入' + item.field_name} style={{width: 200}}
                                hasClear/>
                    </IceFormBinder>
                </div>
            </Col>
        );
    };
    renderTreeSelect2 = (item, index) => {
        let datasource = this.props.dictConfig[item.relation_data];
        return (
            <Col l="8" key={'renderTreeSelect2' + index}>
                <div key={"key-field-" + index} style={styles.formItem}>
                    <span style={styles.formLabel}>{item.field_name}：</span>
                    <IceFormBinder name={item.field_id} message={'请输入正确的' + item.field_name}>
                        <TreeSelect dataSource={datasource} placeholder={'请输入' + item.field_name}
                                    style={{width: '100%'}}/>
                    </IceFormBinder>
                </div>
            </Col>
        );
    };
    renderRadioGroup2 = (item, index) => {
        let datasource = this.props.dictConfig[item.relation_data];
        return (
            <Col l="8" key={'renderRadioGroup2' + index}>
                <div key={"key-field-" + index} style={styles.formItem}>
                    <span style={styles.formLabel}>{item.field_name}：</span>
                    <IceFormBinder name={item.field_id} message={'请输入正确的' + item.field_name}>
                        <RadioGroup dataSource={datasource} placeholder={'请输入' + item.field_name}
                                    style={{width: '100%'}}/>
                    </IceFormBinder>
                </div>
            </Col>
        );
    };

    renderDatePicker2 = (item, index) => {
        // if (item.field_id === 'DDXQJZSJ') {
        //     return (
        //         <Col l="8" key={'renderDatePicker2' + index}>
        //             <div key={"key-field-" + index} style={styles.formItem}>
        //                 <span style={styles.formLabel}>{item.field_name}：</span>
        //                 <IceFormBinder name={item.field_id} required message={'请输入正确的' + item.field_name}>
        //                     <RangePicker format="YYYY-MM-DD" style={{width: '100%'}} disabled/>
        //                 </IceFormBinder>
        //             </div>
        //         </Col>
        //     )
        // }

        return (
            <Col l="8" key={'renderDatePicker2' + index}>
                <div key={"key-field-" + index} style={styles.formItem}>
                    <span style={styles.formLabel}>{item.field_name}：</span>
                    <IceFormBinder name={item.field_id} required message={'请输入正确的' + item.field_name}>
                        <RangePicker format="YYYY-MM-DD" style={{width: '100%'}}/>
                    </IceFormBinder>
                </div>
            </Col>
        );
    };

    renderEditDialog = (item) => {
        return (
            <EditDialog/>
        );
    };
    renderFieldsFromItem = (config) => {
        if (config == undefined) return;
        return config.map((item, index) => {
            if (item.input_type === 'Input') {
                return this.renderInput2(item, index);
            } else if (item.input_type === 'Input.TextArea') {

            } else if (item.input_type === 'Checkbox') {
                return this.renderSelect2(item, index);
            } else if (item.input_type === 'Select') {
                return this.renderSelect2(item, index);
            } else if (item.input_type === 'SelectDialog') {

            } else if (item.input_type === 'TreeSelect') {

            } else if (item.input_type === 'RadioGroup') {
                return this.renderSelect2(item, index);
            } else if (item.input_type === 'DatePicker') {
                return this.renderDatePicker2(item, index);
            } else if (item.component === 'EditDialog') {
                return this.renderEditDialog(item);
            }
        });
    };

    componentDidMount() {
        const {fields} = this.props;
        this.setState({
            change_cols: fields,
            cols: fields,
        });
    };

    render() {
        const {
            CurrentTable, handleReset, fields, value, downloadTpl, exportData, beforeUpload, UploadonChange, UploadonSuccess, handleCreate
        } = this.props;
        // value['DDXQJZSJ']=[moment().format("YYYY-01-01"),moment().add(1, 'y').format("YYYY-01-01")]
        return (
            <div style={styles.formContainer}>
                <Collapse accordion>
                    <Panel title={'搜索'}>
                        <IceFormBinderWrapper value={value} ref="form">
                            <div style={styles.formItems}>
                                <Row wrap gutter={40}>
                                    {this.renderFieldsFromItem(fields)}
                                </Row>
                            </div>
                        </IceFormBinderWrapper>
                    </Panel>
                </Collapse>
                <div style={styles.buttons}>
                    {/*<EditDialog/>*/}

                    {/*<Button type="primary"*/}
                    {/*style={styles.button}*/}
                    {/*onClick={handleReset}*/}
                    {/*>*/}
                    {/*重 置*/}
                    {/*</Button>*/}
                    <Button type="primary"
                            style={styles.button}
                            onClick={handleCreate}
                            disabled={this.props.buttonDisable}
                    >
                        增加记录
                    </Button>
                    {/*<Button type="primary"*/}
                    {/*style={styles.button}*/}
                    {/*onClick={downloadTpl}*/}
                    {/*disabled={this.props.buttonDisable}*/}
                    {/*>*/}
                    {/*下载模板*/}
                    {/*</Button>*/}
                    <Upload
                        action={this.props.uploadUrl}
                        beforeUpload={beforeUpload}
                        onChange={UploadonChange}
                        onSuccess={UploadonSuccess}
                        accept=".xlsx"
                        className="upload"
                        // multiple
                    >
                        <Button type="primary" style={styles.button}
                                disabled={this.props.buttonDisable}>导入EXCEL</Button>
                    </Upload>
                    <Button type="primary"
                            style={styles.button}
                            onClick={exportData}
                            disabled={this.props.buttonDisable}
                    >
                        导出EXCEL
                    </Button>
                    <Button
                        type="primary"
                        style={styles.button}
                        onClick={this.handleSubmit}
                        disabled={this.props.selectButtonDisable}
                    >
                        搜 索
                    </Button>
                    <Button type="primary"
                            style={styles.button}
                            onClick={this.props.handleReset}
                    >
                        重 置
                    </Button>
                </div>
            </div>
        );
    }
}

const styles = {
    formContainer: {
        position: 'relative',
        background: '#fff',
    },
    formItem: {
        display: 'flex',
        alignItems: 'center',
        margin: '10px 0',
    },
    formLabel: {
        minWidth: '140px',
        maxWidth: '120px'
    },
    buttons: {
        textAlign: 'center',
        display: 'flex',
        marginTop: '10px',
        marginBottom: '10px'
    },
    button: {
        marginRight: '10px',
        alignSelf: 'center'
    }
};

export default CustomForm;
