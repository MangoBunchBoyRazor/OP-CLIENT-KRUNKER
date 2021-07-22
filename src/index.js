//modules
require("v8-compile-cache"); //For better startup
const path = require("path");
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    globalShortcut,
    protocol
} = require("electron");
Menu.setApplicationMenu(null);
const fs = require("fs");
const DiscordRPC = require("discord-rpc");
const {
    dir
} = require("console");
var { cpu } = require("os");
const version = app.getVersion();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    // eslint-disable-line global-require
    app.quit();
}

let win;

//Performance improvements
app.commandLine.appendSwitch("disable-frame-rate-limit"); // disable frame cap
app.commandLine.appendSwitch("force_high_performance_gpu"); //Use better gpu
app.commandLine.appendSwitch("--in-process-gpu"); //Performance improve
app.commandLine.appendSwitch("ignore-gpu-blacklist"); //Performance improve
app.commandLine.appendSwitch("disable-breakpad");
app.commandLine.appendSwitch("disable-component-update");
app.commandLine.appendSwitch("disable-print-preview");
app.commandLine.appendSwitch("disable-logging");
app.commandLine.appendSwitch("disable-web-security");
app.commandLine.appendSwitch("webrtc-max-cpu-consumption-percentage=100");
app.commandLine.appendSwitch("disable-metrics");
app.commandLine.appendSwitch("disable-metrics-repo");
app.commandLine.appendSwitch("enable-javascript-harmony");
app.commandLine.appendSwitch("enable-future-v8-vm-features");
app.commandLine.appendSwitch("enable-webgl2-compute-context");
app.commandLine.appendSwitch("disable-hang-monitor");
app.commandLine.appendSwitch("no-referrers");
app.commandLine.appendSwitch("enable-quic");
app.commandLine.appendSwitch("high-dpi-support", 1);
app.commandLine.appendSwitch("disable-2d-canvas-clip-aa");
app.commandLine.appendSwitch("disable-bundled-ppapi-flash");
app.commandLine.appendSwitch("renderer-process-limit", 100);
app.commandLine.appendSwitch("max-active-webgl-contexts", 100);
if (cpu()[0].model.includes("AMD")) {
    app.commandLine.appendSwitch("enable-zero-copy");
}
//

if ((fs.existsSync(path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings/angle.txt"))) === true) {
	var angletyp = fs.readFileSync(path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings/angle.txt"), 'utf8'); //default
	app.commandLine.appendSwitch('use-angle', `${angletyp}`); //angle
	console.log('angle loaded');
};
//

const createWindow = () => {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: true,
        backgroundColor: "#000000",
        titleBarStyle: 'hidden',
        show: false,
        icon: __dirname + "/doc/media/icon.ico",
        webPreferences: {
            nodeIntergation: true,
            preload: path.join(__dirname, "preload.js"),
            webSecurity: false,
        },
    });
    win.loadURL('https://krunker.io');
    win.setFullScreen(true);

    //Splash-
    splash = new BrowserWindow({
        width: 400,
        height: 500,
        show: false,
        transparent: true,
        frame: false,
        icon: __dirname + "/doc/media/icon.ico",
        alwaysOnTop: true,
    });
    splash.loadFile(path.join(__dirname, "/doc/splash.html"));
    splash.setResizable(false)
    splash.once("ready-to-show", () => {
        splash.show()
    });
    //-	 

    //ubg
    updateW = new BrowserWindow({
        width: 100,
        height: 100,
        transparent: true,
        frame: false,
        show: false,
        icon: __dirname + "/doc/media/icon.ico",
        alwaysOnTop: true,
        webPreferences: {
            nodeIntergation: true,
            preload: path.join(__dirname, "update.js"),
            webSecurity: false,
        },
    });
    updateW.loadURL('https://bluzed.github.io/maz/update.html');
    updateW.setResizable(false)
    //-	 

    function showUwin() {
        splash1 = new BrowserWindow({
            width: 400,
            height: 500,
            show: false,
            transparent: true,
            frame: false,
            icon: __dirname + "/doc/media/icon.ico",
            alwaysOnTop: true,
        });
        splash1.loadFile(path.join(__dirname, "/doc/splash-update.html"));
        splash1.setResizable(false)
        splash1.once("ready-to-show", () => {
            splash1.show()
        });
    }

    function opensetswindow() {
        setwin = new BrowserWindow({
            width: 690,
            height: 562,
            show: false,
            frame: false,
            icon: __dirname + "/doc/media/icon.ico",
            webPreferences: {
                nodeIntergation: true,
                preload: path.join(__dirname, "settings.js"),
                webSecurity: false,
            },
        });
        setwin.loadFile(path.join(__dirname, "/doc/settings.html"));
        setwin.setResizable(false)

        setwin.once("ready-to-show", () => {
            setwin.show();
        });
        ipcMain.on("closesettings", () => {
            setwin.destroy();
        });
    };
    win.webContents.on('new-window', function(wdow, url) {
        console.log(url);
        //e.preventDefault();
        //require('electron').shell.openExternal(url);
        //https://krunker.io/?play
        //https://krunker.io/?game
        var check1 = url.startsWith("https://krunker.io/?play");
        var check2 = url.startsWith("https://krunker.io/?game");
        var check3 = url.startsWith("https://krunker.io/social.html");
        if (check1 === true) {
            wdow.preventDefault();
            win.loadURL(url);
        } else if (check2 === true) {
            wdow.preventDefault();
            win.loadURL(url);
        } else if (check1 === false) {
            wdow.preventDefault();
            require('electron').shell.openExternal(url);
        } else if (check2 === false) {
            wdow.preventDefault();
            require('electron').shell.openExternal(url);
        } else if (check3 === true) {
            wdow.preventDefault();
            win.loadURL(url);
        } else if (check3 === false) {
            wdow.preventDefault();
            require('electron').shell.openExternal(url);
        }
    });

    win.on('close', function() { //   <---- Catch close event
        console.log('Okay! Quitting Client :D')
        app.exit();
    });

    ipcMain.on("clientsettings", () => {
        opensetswindow();
    });

    ipcMain.on("noupdate", () => {
        win.once("ready-to-show", () => {
            win.show();
            splash.destroy();
            updateW.destroy();
        });
    });

    ipcMain.on("UpdateAvailable", () => {
        win.destroy();
        showUwin();
        splash.destroy();
    });

    ipcMain.on("quit", () => {
        app.quit();
    });

    ipcMain.on("randomLobby", () => {
        win.loadURL('https://krunker.io');
    });

    ipcMain.on("restart", () => {
        restart()
    });

    ipcMain.on("discord", () => {
        var url = "https://discord.com/invite/AkcKUyZuB9";
        require('electron').shell.openExternal(url);
    });
    //RPC

    var mapName = "Beta"

    const clientId = "865228662247653409";


    DiscordRPC.register(clientId);

    const rpc = new DiscordRPC.Client({
        transport: "ipc"
    });
    const startTimestamp = new Date();

    async function setActivity() {
        if (!rpc || !win) {
            setTimeout(() => {
                setActivity();
            }, 15000);

            return;
        }

        rpc.setActivity({
            details: `Playing Krunker`,
            //state: `${mapName}`,
            startTimestamp,
            largeImageKey: "icon1",
            largeImageText: "OP Client",
        });
    }

    rpc.on("ready", () => {
        setActivity();
    });

    rpc.login({
        clientId
    }).catch(console.error);

    app.whenReady().then(() => {

        globalShortcut.register('F11', () => {
            win.setFullScreen(!win.isFullScreen())
        })

        globalShortcut.register('F4', () => {
            //win.loadURL('https://krunker.io');
            win.webContents.send("randomLobby");
        })

        globalShortcut.register('Ctrl + Shift + I', () => {
            setTimeout(() => BrowserWindow.getFocusedWindow().webContents.openDevTools())
        })

        globalShortcut.register('Ctrl + W', () => {
            app.exit(0)
        })

        globalShortcut.register('Ctrl + Shift + R', () => {
            app.relaunch();
            app.exit();
        })

        globalShortcut.register('F6', () => {
            win.webContents.send("quickFFA");
        });

        globalShortcut.register('ESC', () => {
            win.webContents.send("pointerunlock");
            console.log('PointerUnlock');
        });

    });
    const dir5 = path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings");

    function restart() {
        app.relaunch()
        app.exit()
    };

    function loadSets() {
        console.log('Settings Loading');

        fs.writeFile(`${dir5}/timercolor.txt`, '#ffffff', "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });

        fs.writeFile(`${dir5}/timertog.txt`, 'true', "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });

        fs.writeFile(`${dir5}/skytog.txt`, 'false', "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });

        fs.writeFile(`${dir5}/skyType.txt`, 'solid', "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });

        fs.writeFile(`${dir5}/skycolor.txt`, '#ffffff', "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });

        fs.writeFile(`${dir5}/swaptog.txt`, 'true', "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });

        fs.writeFile(`${dir5}/angle.txt`, 'default', "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });

        console.log('Settings Loaded');
        setTimeout(function() {
            restart();
        }, 1000);
    };

    if ((fs.existsSync(path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings"))) === false) {
        fs.mkdirSync(path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings"), {
            recursive: true
        });
    }

    if ((fs.existsSync(path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings/timercolor.txt"))) === false) {
        loadSets();
    }



}

app.allowRendererProcessReuse = true;

app.on('ready', function() {
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});



//Resource Swapper
const urls = [];
const css = [];
let newPath;
const getCSSFiles = (pa) => {
    try {
        fs.readdirSync(pa, {
            withFileTypes: true
        }).forEach((dir) => {
            css.push(`${pa}/${dir.name}`);
        });
    } catch (err) {
        console.log(err);
    }
};
const recursiveSwap = (dpath) => {
    try {
        fs.readdirSync(dpath, {
            withFileTypes: true
        }).forEach((dir) => {
            if (dir.isDirectory()) {
                if (dir.name == "css") getCSSFiles(`${dpath}/${dir.name}`);
                recursiveSwap(`${dpath}/${dir.name}`);
            } else {
                newPath = `${dpath}/${dir.name}`;
                const cPath = newPath.replace(
                    `${app.getPath("documents")}\\KrunkerResourceSwapper`,
                    ""
                );

                if (cPath.indexOf("models") != -1 || cPath.indexOf("textures") != -1) {
                    urls.push(
                        `*://assets.krunker.io${cPath}*`,
                        `*://assets.krunker.io${cPath}?*`
                    );
                } else
                    urls.push(
                        `*://krunker.io${cPath}*`,
                        `*://krunker.io${cPath}?*`,
                        `*://comp.krunker.io${cPath}*`,
                        `*://comp.krunker.io${cPath}?*`
                    );
            }
        });
    } catch (err) {
        console.error(err);
    }
};

const dirPath = path.join(app.getPath("documents"), "KrunkerResourceSwapper");

ipcMain.on("swapFiles", () => {
    win.webContents.send("css-urls", {
        urls: css
    });
    if (urls[0]) {
        win.webContents.session.webRequest.onBeforeRequest({
                urls: urls
            },
            (details, callback) => {
                callback({
                    redirectURL: "file:///" + path.join(dirPath, new URL(details.url).pathname),
                });
            }
        );
    }
});

//Looking for resource swapper directory in documents  
if ((fs.existsSync(path.join(app.getPath("documents"), "KrunkerResourceSwapper"))) === false) {
    fs.mkdirSync(path.join(app.getPath("documents"), "KrunkerResourceSwapper")), {
        recursive: true
    };
    recursiveSwap(dirPath);
} else {
    recursiveSwap(dirPath)
};

if ((fs.existsSync(path.join(app.getPath("documents"), "OP-Client/Resource-Swapper"))) === true) {
    fs.rmdir(path.join(app.getPath("documents"), "OP-Client/Resource-Swapper"), (error) => {
        if (error) throw error;
    });
};

console.log(`OP Client v${version}`);