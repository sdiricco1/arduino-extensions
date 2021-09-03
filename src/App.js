import React from "react";
import { Button, Select } from "antd";
import './App.less';

const { Option } = Select;

const { ipcRenderer } = window.require("electron");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      boardList: [],
      boardSelected: undefined
    }
    this.onChangeSelectedBoard = this.onChangeSelectedBoard.bind(this)
  }

  async onChangeSelectedBoard(value){
    const boardSelected = this.state.boardList.find(el => el.port.address === value)
    this.setState({boardSelected: boardSelected})   
  }

  async componentDidMount(){
    const res = await ipcRenderer.invoke("arduino-cli-board-list");
    this.setState({boardList:res.stdout})
  }

  render() {
    const renderBoardList = this.state.boardList.map(el =>{
      console.log(el)
      if(el.matching_boards){
        return (<Option key={el.port.address} value={el.port.address}>{el.matching_boards[0].name} ({el.port.address})</Option>)
      }
      else{
        return (<Option key={el.port.address} value={el.port.address}>Other ({el.port.address})</Option>)
      }
    })
    return (
      <div className="mainContainer">
        <Select className="selectContainer" onChange={this.onChangeSelectedBoard} onClick={this.onClick}>
          {renderBoardList}
        </Select>
      </div>
    );
  }
}

export default App;
