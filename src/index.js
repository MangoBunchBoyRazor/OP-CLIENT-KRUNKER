//modules
require("v8-compile-cache"); //For better startup
const path = require("path");
const {
	app,
	BrowserWindow,
	Menu,
	ipcMain,
	globalShortcut,
	dialog
} = require("electron");
const shortcuts = require("electron-localshortcut");
const Store = require("electron-store");
Menu.setApplicationMenu(null);
const config = new Store();
const DiscordRPC = require("discord-rpc");
const fs = require("fs");
const {
	dir
} = require("console");
const puppeteer = require('puppeteer');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	// eslint-disable-line global-require
	app.quit();
}

if ((config.get('fps')) === undefined) {
	config.set('fps', 'true');
};
if ((config.get('angle')) === undefined) {
	config.set('angle', 'none');
};

console.log(config.get('fps'));
console.log(config.get('angle'));

var fps = config.get('fps');
var angle = config.get('angle');

//Performance improvements
app.commandLine.appendSwitch("force_high_performance_gpu"); //Use better gpu
app.commandLine.appendSwitch("force-high-performance-gpu"); //Use better gpu-try2
if (fps === "true") {
	app.commandLine.appendSwitch("disable-frame-rate-limit"); //Uncap fps
	app.commandLine.appendSwitch("disable-gpu-vsync"); //Uncap fps 2
	console.log('fpstrue');
};
if (angle === "none") {
	console.log('no angle selected');
} else {
	app.commandLine.appendSwitch('use-angle', angle)
};

app.commandLine.appendSwitch("in-process-gpu"); //Performance improve
app.commandLine.appendSwitch("ignore-gpu-blacklist"); //Performance improve

let win;

const options1 = {
    type: 'question',
    buttons: ['Yes, Reset Angle Backend to default.', `No Thanks.`],
    defaultId: 0,
    title: 'Angle Backend Reset',
    message: 'Angle Backend Reset',
};

const options2 = {
    type: 'question',
    buttons: ['Ok'],
    defaultId: 0,
    title: 'Updates Are availaible!',
    message: 'Update are being downloaded. Will be installed soon.',
};

function resetAngle() {
  dialog.showMessageBox(null, options1).then( (btn) => {
	  var response = btn.response;
	  console.log(response);
	  if (response === 0){config.set('angle', 'none');app.relaunch();app.exit();}else{console.log('Reset Aborted')};
  });
};

function UpdateADialog() {
  dialog.showMessageBox(null, options2)
};

const createWindow = () => {
	// Create the browser window.
	win = new BrowserWindow({
		width: 1120,
		height: 645,
		frame: true,
		titleBarStyle: 'hidden',
		show: false,
		icon: __dirname + "/media/icon/icon.ico",
		webPreferences: {
			nodeIntergation: true,
			preload: path.join(__dirname, "preload.js"),
			webSecurity: false,
		},
	});

	//Splash-
	splash = new BrowserWindow({
		width: 200,
		height: 200,
		transparent: true,
		frame: false,
		alwaysOnTop: true
	});
	splash.loadFile(path.join(__dirname, "splash.html"));
	splash.setIgnoreMouseEvents(true);
	//-

	win.loadFile(path.join(__dirname, "index.html"));


	if (config.get("enablePointerLockOptions", false)) {
		app.commandLine.appendSwitch("enable-pointer-lock-options");
	}

	let contents = win.webContents;
	shortcuts.register(win, "Escape", () =>
		contents.executeJavaScript("document.exitPointerLock()", true)
	);

	app.whenReady().then(() => {

		globalShortcut.register('F11', () => {
			win.setFullScreen(!win.isFullScreen())
		})

		globalShortcut.register('Ctrl + Shift + I', () => {
			setTimeout(() => BrowserWindow.getFocusedWindow().webContents.openDevTools())
		})

		globalShortcut.register('F4', () => {
			win.loadURL('https://krunker.io');
		})

		globalShortcut.register('Ctrl + W', () => {
			app.exit()
		})

		globalShortcut.register('Ctrl + Shift + R', () => {
			app.relaunch();
			app.exit();
		})

		globalShortcut.register('F6', () => {
			win.webContents.send("quickFFA");
		});

		globalShortcut.register('ESC', () => {
			contents.executeJavaScript("document.exitPointerLock()", true)
			console.log('PointerUnlock');
			win.webContents.send("pointerunlock");
		});
		
		globalShortcut.register('F1', () => {
			resetAngle()
		});

	});

	function startgame() {
		win.show();
		splash.destroy();
	};

	function update() {

		const version = app.getVersion();
		const versionNew = config.get('newestversion');

		console.log(version);
		console.log(`Newest version - ${versionNew}`);

		function checkforupdates() {
			if (versionNew > version) {
				console.log('update-availaible');
				UpdateADialog();
				win.loadFile(path.join(__dirname, "splash.html"));
				win.hide();
				updateDownload();
				console.log('update downloading')
			} else {
				console.log('no-update');
			}
		}

		if ((fs.existsSync(path.join(app.getPath("documents"), "OP-Client"))) === false) {
			fs.mkdirSync(path.join(app.getPath("documents"), "OP-Client")), {
				recursive: true
			};
		}
		if ((fs.existsSync(path.join(app.getPath("documents"), "OP-Client/Updates"))) === false) {
			fs.mkdirSync(path.join(app.getPath("documents"), "OP-Client/Updates")), {
				recursive: true
			};
		}

		const updatepath = path.join(app.getPath("documents"), "OP-Client/Updates");

		fs.writeFile(`${updatepath}/install.bat`, 'START update.exe', "utf8", (err) => {
			if (err)
				console.log(err);
			else {
				console.log("update_install_created");
			}
		});

		function installUpdate() {
			var BatFilePath = (`${updatepath}/install.bat`);
			const {
				shell
			} = require('electron');
			shell.openItem(BatFilePath);
			setTimeout(function() {
				app.quit()
			}, 1000);
		}

		function updateDownload() {
			var options = {
				fileName: `update.exe`,
				progressThrottle: 1000,
				override: true
			};
			const {
				DownloaderHelper
			} = require('node-downloader-helper');
			console.log('Downloading Update..');
			const dl = new DownloaderHelper(`https://github.com/BluZed/OP-CLIENT-KRUNKER/releases/download/v${versionNew}/WIN.x64.Bit.exe`, updatepath, options);
			dl.on('end', () => console.log('Update Downloaded, Install pending...'))
			dl.on('end', () => installUpdate())
			dl.start();
		};

		checkforupdates()
	};

	(async () => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto('https://bluzed.github.io/maz/update.html');
		const texte = await page.evaluate(() => {
			const el = document.getElementById('version');
			return el.innerHTML;
		})
		console.log("newest version is " + texte);
		config.set('newestversion', texte);
		update()
		await browser.close();
	})();

	win.once("ready-to-show", () => {
		win.show();
		win.setFullScreen(true)
		splash.destroy();
	});
	
}

app.allowRendererProcessReuse = true;
app.on("ready", createWindow);

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


//RPC CODE
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
		details: `Playing on OP Client`,
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

//Looking for resource swapper directory in documents
const dirPath = path.join(app.getPath("documents"), "KrunkerResourceSwapper");

if (fs.existsSync(dirPath)) {
	recursiveSwap(dirPath);
} else {
	fs.mkdirSync(dirPath);
	recursiveSwap(dirPath);
}

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
ipcMain.on("restart", () => {
	app.relaunch();
	app.exit();
});
ipcMain.on("fpstrue", () => {
	console.log('fps-tog');
	config.set('fps', 'true');
});
ipcMain.on("fpsfalse", () => {
	console.log('fps-tog');
	config.set('fps', 'false');
});
ipcMain.on("anglenone", () => {
	config.set('angle', 'none');
	console.log('Angle None');
});
ipcMain.on('angletype', function(event, store2) {
	config.set('angle', store2);
	console.log(store2);
});