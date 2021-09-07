import React from "react";
import { Button, Select, Tabs } from "antd";
import { AlertOutlined, ExperimentOutlined } from '@ant-design/icons';
import ArduinoBasic from './components/ArduinoBasic';

import "./App.less";

const { TabPane } = Tabs;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

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

        <div className="viewer">
          <code className="logTerminal">code is here..</code>
        </div>
      </div>
    );
  }
}

export default App;
