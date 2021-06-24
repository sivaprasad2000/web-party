const { app, BrowserWindow, ipcMain } = require('electron')
const { v4: uuidv4 } = require('uuid');
const screenshot = require('screenshot-desktop');

var socket = require('socket.io-client')('http://192.168.18.6:5000');
var interval;

function createWindow () {
    const win = new BrowserWindow({
        width: 500,
        height: 150,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    win.removeMenu();
    //win.webContents.openDevTools();
    win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("start-share", function(event, arg) {

    var uuid = uuidv4();
    socket.emit("join-message", uuid);
    event.reply("uuid", uuid);

    interval = setInterval(function() {
        screenshot().then((img) => {
            var imgStr = new Buffer(img).toString('base64');

            var obj = {};

            obj.roomId = uuid;
            obj.img = imgStr;

            socket.emit("screen-data", JSON.stringify(obj));
        })
    }, 100)
})

ipcMain.on("stop-share", function(event, arg) {
    clearInterval(interval);
})
