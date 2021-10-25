import React, {Component} from 'react';
import {Checkbox, Button, Dialog, Table, Pagination, Loading,Select} from '@alifd/next';
import PropTypes from 'prop-types';
import './CustomTable.scss';
import moment from "moment";
import {jTableWidth, PageSizeList,QuxianDict} from "../../../../../../../utils/vars";
// import Cookie, {hasItem, keys} from '../../../../../utils/cookies';   //导入cookie模块
// import sleep from '../../../../utils/tools'
// import {AsyncSleep} from '../../../../../utils/tools'
import SelectColumnsDialog from "../../../../../../../pages/SelectColumns/selectColumnsDialog";


const {Group} = Checkbox;
export default class CustomTable extends Component {
    static displayName = 'CustomTable';

    static defaultProps = {};

    static propTypes = {
        isLoading: PropTypes.bool.isRequired,
        fetchDataPage: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            cols: [],
            change_cols: [],
            rowSelection: {
                onChange: this.props.onSelectAll,
                selectedRowKeys: []
            },

        };

        this.openDialog = this.openDialog.bind(this);
        this.renderControlContent = this.renderControlContent.bind(this);
    };


    openDialog = () => {

        Dialog.confirm({
            content: this.renderControlContent(),
            title: '选择列',
            onOk: () => {
                Dialog.confirm({
                    title: '确认',
                    content: '是否保存列的选项',
                    onOk: () => {
                        this.props.cookies_obj.col_cookie.delCookie();
                        this.props.cookies_obj.col_cookie.setCookie(this.props.cookie_col, 0, true)
                    }
                });
                return true;
            },
            onCancel: () => { // 取消则返回上一次的 选择记录
                // let _this = this
                // this.props.cookies_obj.col_cookie.setCookie(_this.beforeCols, 0, true)
                return true;
            }
        });
    };


    renderControlContent() {
        const {fields, cookie_col} = this.props;
        const groupSource = fields.map(col => {
            return {
                label: col.field_name,
                value: col.field_id
            };
        });
        // console.log('groupSource',groupSource);
        // console.log('defaultValue',defaultValue);
        // return <Group dataSource={groupSource} onChange={this.onChange} defaultValue={cookie_col}/>;
        return <div>
            <Group dataSource={groupSource} onChange={this.onChange} defaultValue={cookie_col}/>;
        </div>
    }

    onChange = (value) => {
        this.props.onchange_cols(value)
    };


    renderFields() {
        const {dataSuccess, userinfo, fields, tableName} = this.props;

        let that = this;
        if (dataSuccess) {
            let showFields = []
            showFields = fields.filter(col => this.props.cookie_col.indexOf(col.field_id) > -1)

            if (showFields.length === 0) {
                showFields = fields.filter(col => {
                    return col.display === 1
                })
            }


            return showFields.map(col => {
                let action = (v, i, row) => {
                    return v;
                };
                if (col.input_type == 'Select' || col.input_type == 'RadioGroup') {
                    action = (v, i, row) => {

                        return that.props.getDictLabel(col.relation_data, v,row)
                    };
                }
                if (col.input_type == 'Checkbox') {
                    action = (v, i, row) => {
                        // console.log('Checkbox', v);
                        let returnValue = [];
                        if (!Array.isArray(v)) {
                            returnValue = that.props.getDictMultipleByStr(col.relation_data, v);
                        } else {
                            returnValue = v;
                        }
                        // console.log('returnValue', returnValue);
                        return returnValue;
                    };
                }
                if (col.input_type === "DatePicker") {
                    action = (v, i, row) => {
                        if (v === undefined) {
                            return ""
                        }
                        return moment(v).format('YYYY-MM-DD HH:mm:ss');
                    }
                }

                // if (col.field_id==="show_model_field"){
                //     action = (v, i, row) => {
                //         if (v === undefined) {
                //             return ""
                //         }
                //         // let data=[];
                //         // v["tempList"].map(function (vv,i) {
                //         //     data.push({label:vv["zbmc"],value:vv["zbmc"]})
                //         // })
                //         // console.log(v)
                //         // console.log(row["_id"])
                //         return <Select onChange={this.props.handleSelectchange.bind(this,row["_id"],col)} dataSource={v}/>
                //     }
                // }
                //
                // if (col.field_id==="QuxianDict"){
                //     action = (v, i, row) => {
                //         if (v === undefined) {
                //             return ""
                //         }
                //         // let data=[];
                //         // v["tempList"].map(function (vv,i) {
                //         //     data.push({label:vv["zbmc"],value:vv["zbmc"]})
                //         // })
                //         // console.log(v)
                //         // console.log(row["_id"])
                //
                //         return <Select onChange={this.props.handleSelectchange.bind(this,row["_id"],col)} dataSource={v}/>
                //     }
                // }

                return <Table.Column title={col.field_name} cell={action} dataIndex={col.field_id} key={col.field_id}/>;
            });
        }
    };


    handlePagination = (current) => {
        this.setState(
            {
                current,
            },
            () => {
                this.props.fetchDataPage(current);
            }
        );
    };
    handlePaginationChangeSize = (pagesize) => {
        // console.log(current);
        this.setState({
                current: 1
            },
            () => {
                this.props.fetchDataPageChangeSize(pagesize);
            })
    };

    onRowClick = (record, index,e) => {
        // console.log(record,index,e);
        this.props.setRecord({
            method: 'update',
            value: record,
        });
    };

    onAddTpl = () => {
        this.props.onAddTpl()
    };

    render() {
        const {datasource, cookie_col, fields, userinfo, tableName, style = {}, isLoading = false} = this.props;

        // if (this.state.cols.length == 0 && fields.length > 0) {
        //   let _this = this
        //   let col_key=userinfo.name + "_" + tableName + "_col_select"
        //   let col_cookie = new Cookie(col_key)
        //   this.setState({
        //     col_key:col_key,
        //     col_cookie: col_cookie,
        //     change_cols: JSON.parse(col_cookie.getCookie()) || fields,
        //     cols: fields,
        //     // tableName:this.props.tableName,
        //   }, function () {
        //     console.log(_this.state )
        //   })
        // }
        // const popupProps={align:'bl tl'};

        let page = <div></div>

        if (datasource.hasOwnProperty('dataList')) {
            page = <Pagination
                style={styles.pagination}
                current={this.props.current}
                pageSize={datasource.pageSize}
                onChange={this.handlePagination}
                pageSizeSelector={"filter"}
                pageSizeList={PageSizeList()}
                onPageSizeChange={this.handlePaginationChangeSize}
                total={datasource.total}
                // popupProps={popupProps}
                totalRender={total => `总条数: ${total}`}
            />
        }
        this.state.rowSelection.selectedRowKeys = this.props.selectedRowKeys;

        if (cookie_col.length == 0) {
            return <div style={{height: '600px', overflow: 'auto'}}>
                <div><SelectColumnsDialog {...this.props}/></div>
            </div>
        }
        return (
            <div>
                <div><SelectColumnsDialog {...this.props}/></div>
                {/*<div style={{height: '600px', overflow: 'auto'}}>*/}
                    {/*<p><Button onClick={this.openDialog}> Select columns </Button></p>*/}
                    <div style={{overflowX: 'auto'}}>
                        <div style={{width: jTableWidth(this.props.cookie_col)+'%'}}>
                            <Loading
                                fullScreen
                                visible={isLoading}
                            />
                            <Table
                                loading={isLoading}
                                dataSource={datasource.dataList}
                                // rowSelection={this.state.rowSelection}
                                onRowClick={this.onRowClick}
                                hasBorder={false}
                                className="custom-table"
                                style={{minHeight: '500px', whiteSpace: "pre-wrap"}}
                                // primaryKey="_id"
                                fixedHeader
                                maxBodyHeight={'500px'}
                            >
                                {this.renderFields()}
                            </Table>
                        </div>
                    </div>

                {/*</div>*/}
                {/*<Button type="secondary" onClick={this.onAddTpl} disabled={this.props.buttonDisable}>确定表格数据</Button>*/}
                {page}
            </div>
        );
    }
}

const styles = {
    pagination: {
        margin: '20px 0',
        textAlign: 'center',

    },

};
