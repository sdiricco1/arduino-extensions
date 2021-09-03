const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { exec, execFile  } = require("child_process");
const { stdout } = require("process");
const usbDetect = require('usb-detection');

let mainWindow;
 
const arduino_cli_win = 'cd core/win & arduino-cli.exe';
const arduino_cli_linux = '';
const arduino_cli = process.platform === 'win32' ? arduino_cli_win : arduino_cli_linux ;

usbDetect.startMonitoring();

usbDetect.on('change', async(device) => { 
  mainWindow.webContents.send("usb-detect:onchange", true);
});

const exexProm = async (exec, cmd) => {
  const result = {
    stdout: undefined,
    stderr: undefined,
  }
  return new Promise( (resolve, reject) => {
  exec(cmd, (err, stdout, stderr) => {
      if(err){
        reject(err)
      }
      resolve({
        stdout: stdout,
        stderr: stderr
      })
    })
  })
}



const showMessageBox=(options) => {
  //dialog box
  let __options = {
    buttons: options.buttons || ["ok"],
    message: options.message || "?",
    title: options.title || "Info",
    type: options.type || "question",
  };
  return dialog.showMessageBoxSync(mainWindow, __options);
}

// mainWindow.webContents.send("myEvent", myData);

// ipcMain.handle("myEvent", async (event, myParam1, myParam2) => {
//     //some code
// });

ipcMain.handle("message-box", async (event, options) => {
    showMessageBox(options)
});

ipcMain.handle("arduino-cli-board-list", async(event) => {
  const result = {
    stdout: undefined,
    stderr: undefined,
    err: undefined
  }
  try {
    const r = await exexProm(exec , `${arduino_cli} board list --format json`);
    result.stdout = JSON.parse(r.stdout);
    return result;
  } catch (err) {
    result.err = err.message;
    showMessageBox({
      title: "Error",
      message: err.message,
      type: 'error'
    })
  }
  return (result)
})

function createWindow() {
  mainWindow = new BrowserWindow({
    minWidth: 600,
    minHeight: 400,
    show: true,
    title: "Example",
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });
  const startURL = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.toggleDevTools(); //comment if you want to remove DevTools, eg: for build
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.removeMenu();

}

app.allowRendererProcessReuse = false;
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
