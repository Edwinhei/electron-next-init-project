const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
// 引入 url 模块

// 判断是否是开发模式
const isDev = process.env.IS_DEV === 'true';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200, // Next.js 应用可能需要更大的窗口
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'), // 预加载脚本
            contextIsolation: true, // 启用上下文隔离
            nodeIntegration: false, // 禁用 Node.js 集成
            webSecurity: !isDev, // 禁用 Node.js 集成
        }
    });

    if (isDev) {
        // 开发模式：加载 Next.js 开发服务器
        mainWindow.loadURL('http://localhost:3000'); // Next.js 默认端口
        mainWindow.webContents.openDevTools();
    } else {
        // 生产模式：加载 Next.js 打包后的静态文件
        // 注意这里是 'out' 目录，并且需要使用 file:// 协议
        mainWindow.loadURL(url.format({
            pathname:path.join(__dirname, '../out/index.html'), // 指向 Next.js 打包后的主页
            protocol: 'file',
            slashes:true
        }));

        mainWindow.on('close', ()=>{
            mainWindow = null;
        });
    }
}

app.whenReady().then(()=>{
    createWindow();
    app.on('activate', ()=>{
        if (BrowserWindow.getAllWindows().length === 0){
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// --- IPC 通信示例 (与之前类似) ---
ipcMain.handle('say-hello', async (event, name) => {
    console.log(`主进程收到来自渲染进程的消息: Hello, ${name}!`);
    return `我是来自Electron 主进程回复: 你好，${name}！`;
});

ipcMain.on('another-message', (event, arg) => {
    console.log('渲染进程发送的异步消息:', arg);
    event.sender.send('reply-to-another-message', '主进程已收到异步消息！');
})