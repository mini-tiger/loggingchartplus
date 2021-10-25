import React, {Component} from 'react';
import {Select, Dialog, Button, Form, Input, Field, Checkbox} from '@alifd/next';
import IceLabel from '@icedesign/label';
import {Message} from '@alifd/next';
import DataBinder from '@icedesign/data-binder';
import './textListStyle.scss'

const FormItem = Form.Item;
const {Group} = Checkbox;


export default class SelectColumnsDialog extends Component {
    static displayName = 'SelectColumnsDialog';

    static defaultProps = {};

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            dataIndex: null,
            dataSource: [],
            all: true,
            default_cols: []

        };

    }

    componentDidMount() {
        //初始化页面配置

    }


    handleSubmit = () => {
        this.props.cookies_obj.col_cookie.delCookie()
        this.props.cookies_obj.col_cookie.setCookie(this.props.cookie_col, 0, true)
        this.setState({
            visible: false
        })
    };

    onOpen = (d) => {
        // this.field.setValues({ ...record });
        this.setState({
            visible: true,
            // dataIndex: index,
        });
        this.setState({
            default_cols: this.props.cookie_col
        })
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onChange = (value) => {
        this.props.onchange_cols(value)
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
            {/*<Button type="primary" onClick={this.allChange}>全选</Button>*/}
            {/*<Button type="primary">反选</Button>*/}
        </div>
    }

    onAll = () => {

        if (this.state.all) {
            this.setState({
                all: false
            });
            let value = this.props.fields.map(obj => {
                return obj.field_id
            });
            this.props.onchange_cols(value)
        } else {
            this.setState({
                all: true
            });
            this.props.onchange_cols(this.props.cookie_col_all)
        }


    };


    render() {

        let name = '全选';
        if (!this.state.all) {
            name = '重置'
        }

        // console.log("++++", this.state.all)
        const {fields, cookie_col} = this.props;
        const groupSource = fields.map(col => {
            return {
                label: col.field_name,
                value: col.field_id
            };
        });

        return (
            <div style={styles.editDialog}>
                <Button type="primary" onClick={() => this.onOpen()}>
                    选择列 </Button>
                <Dialog
                    // style={{width: 640}}
                    visible={this.state.visible}
                    onOk={this.handleSubmit}
                    closeable="esc,mask,close"
                    onCancel={this.onAll}
                    onClose={this.onClose}
                    title="选择列"
                    cancelProps={{children: name}}
                >
                    {/*{this.renderControlContent()}*/}
                    <div className={"listwrap"}>

                        <Group dataSource={groupSource} onChange={this.onChange} defaultValue={cookie_col}
                               value={cookie_col}/>
                        {/*<Button type="primary" onClick={this.allChange}>全选</Button>*/}
                        {/*<Button type="primary">反选</Button>*/}

                    </div>

                </Dialog>
            </div>
        );
    }
}

const styles = {
    editDialog: {
        display: 'inline-block',
        marginRight: '5px',
        alignSelf: 'center'
    }
};
