import React from "react";
import { Button, Select, Tabs, Input, Typography } from "antd";
import { AlertOutlined, ExperimentOutlined, DeleteOutlined } from '@ant-design/icons';
import { Hook, Console, Decode } from "console-feed"; //https://openbase.com/js/console-feed
import $ from "jquery";

import styles from "./LogTerminal.module.css";

class LogTerminal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: []
    }
    this.props = props;


  }

  componentDidUpdate() {
    let objDiv = document.getElementById("logTerminal");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }

  }

  componentDidMount() {
    setTimeout(() => { this.setState({ logs: [] }) }, 10);
    Hook(window.console, (log) => {
      this.setState(({ logs }) => ({ logs: [...logs, Decode(log)] }))
    })
  }


  render() {

    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Typography>Arduino CLI</Typography>
          <Button type="link" size="large" onClick={() => {
            this.setState({ logs: [] })
          }}><DeleteOutlined /></Button>
        </div>

        <div className={styles.logTerminal} id="logTerminal">
          <Console
            styles={{

              PADDING: '0px 10px px 0',
              LOG_AMOUNT_BACKGROUND: "",


              LOG_WARN_AMOUNT_BACKGROUND: "none",
              LOG_WARN_BACKGROUND: "",
              LOG_WARN_BORDER: "",

              LOG_ERROR_AMOUNT_BACKGROUND: "none",
              LOG_ERROR_BACKGROUND: "none",
              LOG_ERROR_BORDER: ""
            }} //https://github.com/samdenty/console-feed/blob/master/src/definitions/Styles.d.ts, https://github.com/samdenty/console-feed/blob/master/src/Component/theme/default.ts
            logs={this.state.logs}
            variant="dark"
          />
        </div>
      </div>

    );
  }
}

export default LogTerminal;
