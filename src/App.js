import React from "react";
import { Tabs } from "antd";
import { AlertOutlined, ExperimentOutlined } from '@ant-design/icons';
import ArduinoBasic from './components/ArduinoBasic';
import LogTerminal from "./components/LogTerminal";
import ResizePanel from "react-resize-panel";



import "./App.less";

const { TabPane } = Tabs;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: 'Arduino Cli',
    }
    this.props = props;

  }



  componentDidMount() {

  }

  render() {
    return (
      <div className="mainContainer">
        <div className="upContainer">
          <Tabs type="card">
            <TabPane tab={<span><AlertOutlined />Arduino basic</span>} key="1">
              <ArduinoBasic />
            </TabPane>
            <TabPane tab={<span><ExperimentOutlined />Extra tools</span>} key="2">
              Content of Tab Pane 2
            </TabPane>
          </Tabs>
        </div>
          <ResizePanel
          style={{ height: "200px" }}
            direction="n"
            handleClass="customHandle"
            borderClass="customResizeBorder"
          >
            <div className="downContainer"><LogTerminal msg="Arduino CLI" /></div>
            
          </ResizePanel>

      </div>
    );
  }
}

export default App;
