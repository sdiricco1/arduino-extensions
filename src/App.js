import React from "react";
import { Button, Select } from "antd";
import "./App.less";

const { Option } = Select;

const { ipcRenderer } = window.require("electron");

class App extends React.Component {
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
      <div className="mainContainer">
        <Select
          value={this.state.boardSelected ? this.state.boardSelected.port.address: "---"}
          className="selectContainer"
          onChange={this.onChangeSelectedBoard}
        >
          {renderBoardList}
        </Select>
        <div className="viewer">
          <code className="logTerminal">code is here..</code>
        </div>
      </div>
    );
  }
}

export default App;
