import React from "react";
import { Select, Space, Form, Input, Button, Divider } from "antd";
import { FolderOutlined, UploadOutlined, BuildOutlined } from '@ant-design/icons';

const { Option } = Select;

const { ipcRenderer } = window.require("electron");

class ArduinoBasic extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            boardList: [],
            boardSelected: undefined,
        };
        this.onChangeSelectedBoard = this.onChangeSelectedBoard.bind(this);
        this.usbDetectOnChange = this.usbDetectOnChange.bind(this);
    }

    async onChangeSelectedBoard(value) {
        const boardSelected = this.state.boardList.find(
            (el) => el.port.address === value
        );
        this.setState({ boardSelected: boardSelected });
    }

    async usbDetectOnChange() {
        const boardList = (await ipcRenderer.invoke("arduino-cli-board-list")).stdout;
        let boardSelected = this.state.boardSelected;
        if (boardSelected !== undefined) {
            const el = boardList.find(el => el.port.address === boardSelected.port.address);
            if (el === undefined) {
                boardSelected = undefined;
            }
        }
        this.setState({ boardList: boardList, boardSelected: boardSelected });
    }

    async componentDidMount() {
        ipcRenderer.on("usb-detect:onchange", this.usbDetectOnChange);
        const res = await ipcRenderer.invoke("arduino-cli-board-list");
        this.setState({ boardList: res.stdout });
    }


    render() {
        const renderBoardList = this.state.boardList.map((el) => {
            if (el.matching_boards) {
                return (
                    <Option key={el.port.address} value={el.port.address}>
                        {el.matching_boards[0].name} ({el.port.address})
                    </Option>
                );
            } else {
                return (
                    <Option key={el.port.address} value={el.port.address}>
                        Other ({el.port.address})
                    </Option>
                );
            }
        });
        return (
            <div>
                <Form
                    style={{ marginTop:"16px"}}
                    name="ArduinoBasic"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 8,
                    }}
                >
                    <Form.Item
                        wrapperCol={{
                            offset: 4,
                            span: 8
                        }}
                    >
                        <Space>
                            <Button type="primary" size="large">
                                <BuildOutlined />
                            </Button>
                            <Button type="primary" size="large">
                                <UploadOutlined />
                            </Button>
                            
                        </Space>
                        <Divider className="customDivider"/>
                    </Form.Item>
                    
                    <Form.Item
                        label="Board:"
                        name="board"
                        validateStatus="error"
                        rules={[
                            {
                                required: true,
                                message: 'Please select the board',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select the board"
                            value={this.state.boardSelected ? this.state.boardSelected.port.address : "---"}
                            className="selectContainer"
                            onChange={this.onChangeSelectedBoard}
                        >
                            {renderBoardList}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Sketch:"
                        name="sketch"
                        validateStatus="error"
                        rules={[
                            {
                                required: true,
                                message: 'Please select the Arduino sketch'
                            }
                        ]}
                    >
                        <Input placeholder="sketch path" suffix={<Button size="small" type="link"><FolderOutlined /></Button>} />

                    </Form.Item>
                    <Form.Item
                        label="Output dir:"
                        name="outputdir"
                        rules={[
                            {
                                message: 'Please select the Output dir'
                            }
                        ]}
                    >
                        <Input placeholder="output dir" suffix={<Button size="small" type="link"><FolderOutlined /></Button>} />

                    </Form.Item>


                </Form>
            </div>
        );
    }
}

export default ArduinoBasic;
