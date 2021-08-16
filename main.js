const {
    app,
    BrowserWindow,
    ipcMain,
    globalShortcut
} = require('electron')
const path = require("path");
const {
    exec
} = require("child_process");
const fs = require("fs");
const multiline = require('multiline');
const dir6 = "C:/OP-Client/Resources";
const dirO = path.join(app.getPath("documents"), "KrunkerResourceSwapper");


app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})
/////////////////////

// Variables to put inside files every time app is opened for security purposes.
const manifest = `
{
	"name": "NOT-FOR-YOUR-USE",
	"version": "1.0.0",
	"manifest_version": 2,
	"description": "NOT-FOR-YOUR-USE",
	"permissions": [
		"webRequest",
		"webRequestBlocking",
		"*://*.krunker.io/*",
		"http://127.0.0.1:8080/*"
	],
	"web_accessible_resources": [
		"*.obj", 
		"*.png",
		"*.mp3",
		"*.css",
		"*.json",
		"*.ttf",
		"*.otf",
		"*.ico",
		"*.svg",
		"*.txt"
	],
	"content_scripts": [
        {
            "js": [
                "script.js"
            ],
            "matches": [
                "https://*/*",
                "http://*/*"
            ]
        }
    ]
}
`;
const manifest2 = `
{
	"name": "Krunker.io Resource Swapper",
	"version": "0.0.7",
	"manifest_version": 2,
	"description": "https://github.com/tehchy",
	"permissions": [
		"webRequest",
		"webRequestBlocking",
		"*://*.krunker.io/*",
		"http://127.0.0.1:8080/*"
	],
	"web_accessible_resources": [
		"*.obj", 
		"*.png",
		"*.mp3",
		"*.css",
		"*.json",
		"*.ttf",
		"*.otf",
		"*.ico",
		"*.svg",
		"*.txt"
	],
	"background": {
		"scripts": ["init.js"]
	}
}
`;
const init = multiline(function() {
    /*

    let request = chrome.webRequest.onBeforeRequest;

    chrome.runtime.getPackageDirectoryEntry((root) => {
        let reader = root.createReader();
        reader.readEntries((results) => {
            searchDir(root, results.filter(x => !['init.js', 'manifest.json', 'README.md', 'LICENSE', '.git'].includes(x.name)));
        });
    });

    function searchDir(parent, directories) {
        for (let directory of directories) {
            parent.getDirectory(directory.name, {create: false}, (dir) => {
                let reader = dir.createReader();
                reader.readEntries((results) => {
                    let newDirs = results.filter(x => x.isDirectory);
                    let files = results.filter(x => x.isFile);
                    if (newDirs.length) searchDir(dir, newDirs);
                    for (let file of files) {
                        request.addListener((details) => {
                            return {
                                redirectUrl:chrome.extension.getURL(file.fullPath.replace('/crxfs/', ''))
                            }
                        }, {
                            urls: ['*://*.krunker.io/' + file.fullPath.replace('/crxfs/', '') + '*']
                        }, ['blocking']);
                    }
                });
            });
        }
    }
    //checks all folders
	console.log('Resource Swapper loaded');

    */
});
const script = multiline(function() {
    /*

    //skytyp
var all_code = `
    let kr;
    if(window.localStorage.getItem("SkyColor") == null) {
        window.localStorage.setItem("SkyColor", "#000000");
    }
    if(window.localStorage.getItem("menuTimer") == null) {
        window.localStorage.setItem("menuTimer", true);
    }
    if(window.localStorage.getItem("skyTog") == null) {
        window.localStorage.setItem("skyTog", false);
    }
    if(window.localStorage.getItem("TimerColor") == null) {
        window.localStorage.setItem("TimerColor", "#ffffff");
    }
	if(window.localStorage.getItem("SkyType") == null) {
        window.localStorage.setItem("SkyType", "solid");
    }

    function skyS() {
    var startCol = (window.localStorage.getItem("SkyColor"));
    Object.defineProperty(Object.prototype, "skyCol", {
        enumerable: false,
        get() {
            return startCol;
        }
    });
    Object.defineProperty(Object.prototype, "renderer", {
        enumerable: false,
        get() {
            kr = this;
            return this._renderer;
        },
        set(v) {
            this._renderer = v
        }
    });
    }
    
	function skyA() {
		//rgb sky
            let startCol = "#fc7c7c"
            let kr;

            // Prevents sky dome from generating and calls the init function
            Object.defineProperty(Object.prototype, "skyCol", {
                enumerable: false,
                get() {
                    init();
                    return startCol;
                }
            })

            // Hooks renderer
            Object.defineProperty(Object.prototype, "renderer", {
                enumerable: false,
                get() {
                    kr = this;
                    return this._renderer;
                },
                set(v) {
                    this._renderer = v
                }
            })

            // Main Function
            var init = (() => {
                let hasRan = false;
                let hue = 0;
                let color = startCol;
                return () => {
                    if (!!kr.renderer && !hasRan) {
                        color = new(kr.renderer.getClearColor()).constructor(color);
                        hasRan = true;
                        setInterval(() => {
                            let bc = color.getHSL({})
                            color.setHSL(hue, bc.s, bc.l);
                            kr.renderer.setClearColor(color);
                            hue += 0.01;
                        }, 25)
                    }
                }
            })();
	};
	
    if(window.localStorage.getItem("skyTog") == "true") {
		if(window.localStorage.getItem("SkyType") == "solid") {
    	skyS()
		}else{skyA()};
    }else{console.log('Sky Disabled')};

    function reloadP() {
    	try {
            if(window.confirm("Would you like to apply the changes now?") == true) {
                window.location.assign("https://krunker.io/");
            }
            else {
                return;
            }
        }
    	catch {
            console.log("Failed to Restart, Please try manually.");
        }
    }; 

    function TimerWatch() {
    	var box = document.getElementById("menuTimerBox");
    	var bool = box.checked;
    	if (bool == true) {
            window.localStorage.setItem("menuTimer", true);
    		timer()
        } else {
            window.localStorage.setItem("menuTimer", false);
        }
    };
	
	function skyType() {
		var skytyp = document.getElementById("skytyp")
		var valuee = skytyp.value;
		window.localStorage.setItem("SkyType", valuee);
	};
	
    function skyWatch() {
    	var box = document.getElementById("skyBox");
    	var bool = box.checked;
    	if (bool == true) {
            window.localStorage.setItem("skyTog", true);
    		timer()
        } else {
            window.localStorage.setItem("skyTog", false);
        }
    };
    function PickerWatch(Event) {
        try {
            window.localStorage.setItem("SkyColor", Event.target.value);
     
            if(window.confirm("Would you like to apply the changes now?") == true) {
                window.location.assign("https://krunker.io/");
            }
            else {
                return;
            }
        }
        catch {
            console.log("Color picker failed to apply local change to storage.");
        }
    };
    function timerColor(Event) {
    	window.localStorage.setItem("TimerColor", Event.target.value);
    };
    function TabImports() {
    	document.getElementById("ColorPick1").addEventListener("change", PickerWatch, false);
    	document.getElementById("ColorPick1").setAttribute("value", (window.localStorage.getItem("SkyColor")));

    	document.getElementById("ColorPick2").addEventListener("change", timerColor, false);
    	document.getElementById("ColorPick2").setAttribute("value", (window.localStorage.getItem("TimerColor")));
    	
    	document.getElementById("menuTimerBox").addEventListener("click", () => {TimerWatch()});
    	document.getElementById("skyBox").addEventListener("click", () => {skyWatch()});
    	
		var st = window.localStorage.getItem("SkyType");
		var skytyp = document.getElementById("skytyp")
		skytyp.value = st
		skytyp.addEventListener("click", () => {skyType()});
		
    	var bool = window.localStorage.getItem("menuTimer");
    	if (bool == "true") {
            document.getElementById("menuTimerBox").setAttribute("checked", "");
    		timer()
        } else {
            document.getElementById("menuTimerBox").removeAttribute("checked", "");
        }
    	
    	var bool2 = window.localStorage.getItem("skyTog");
    	if (bool2 == "true") {
            document.getElementById("skyBox").setAttribute("checked", "");
    		timer()
        } else {
            document.getElementById("skyBox").removeAttribute("checked", "");
        }
    	
    };
    function clientTab() {
    	document.getElementById("menuWindow").innerHTML = '<div style="margin-top: 20px!important" class="setHed" id="setHed_local">Please Restart (F4) to apply changes</div> <div style="margin-top: 20px!important" class="setHed" id="setHed_local">Ctrl + O + P For Advanced changes.</div><div class="settName" title="">Enable Menu Timer<label class="switch" style="margin-left:10px"><input type="checkbox" id="menuTimerBox" checked=""><span class="slider"></span></label></div><div class="settName" title="">Menu Timer Color<input type="color" id="ColorPick2" style="float:right;" name="TimerColor" value="#ffffff"> </div><div class="settName" title="">Enable Custom Sky<label class="switch" style="margin-left:10px"><input type="checkbox" id="skyBox" checked=""><span class="slider"></span></label></div><div class="settName" title="">Custom Sky Type<select id="skytyp" class="inputGrey2"><option value="rgb">RGB</option><option value="solid">SOLID</option></select></div> <div class="settName" title="">Custom Sky Color<input type="color" id="ColorPick1" style="float:right;" onchange="PickerWatch(false)" name="ColorPicker" value="#735e5e"> </div></div>'
        TabImports()
	};   
    var setbtn = document.getElementById("menuItemContainer");
        setbtn.addEventListener("click", () => {
            CliSetSetter();
            CliSetBugFix();
        });
    function CliSetBugFix() {
        var setbtn1 = document.getElementById("settingsTabLayout");
        setbtn1.addEventListener("click", () => {
    		CliSetSetter();
        });
    }
    function CliSetSetter() {
        var layout = document.getElementById("settingsTabLayout");
        var newSetClicker = document.createElement("div");
        newSetClicker.setAttribute("id", "clientSet");
        newSetClicker.setAttribute("class", "settingTab");
        newSetClicker.setAttribute("onmouseenter", "playTick()");
    	newSetClicker.setAttribute("onclick", "SOUND.play('select_0',0.1);");
        newSetClicker.innerHTML = "Client";
        layout.appendChild(newSetClicker);
        newSetClicker.addEventListener("click", () => {
            clientTab()
        });
    }
    function timer() {
    	console.log('menuTimer');
        setInterval(()=>{
     
            //move spectateButton
            document.getElementById('spectButton').setAttribute('style', 'top: 20px;left: 550px')
     
            //create element menuTimer
            let menuTimer = document.createElement("div")
            menuTimer.setAttribute('id', 'menuTimer')
            menuTimer.setAttribute('style', "margin-bottom: 50px")
    		menuTimer.style.color = window.localStorage.getItem("TimerColor");
     
            //append to instructions element
            document.getElementById('instructions').appendChild(menuTimer)
     
            //update menuTimer
            let time = document.getElementById('timerVal').innerHTML
            document.getElementById('menuTimer').innerHTML = time
     
        }, 1000)
    };
    if(window.localStorage.getItem("menuTimer") == "true") {timer()};

    document.onkeydown = findNewGame;
    function findNewGame(a){
    	if (a.code !== 'F4') return;
    	window.location.href = 'https://krunker.io';
    }

function ffa() {
	var hideMenu = document.getElementById("menuWindow");
    hideMenu.style.display = "none";
    window.setSetting("oldBrowser", false);
    var clk = document.getElementById("menuBtnBrowser");
    clk.click();
    hideMenu.style.display = "none";
    setTimeout(function() {
        console.log(quickJoinRegion(0,1));
    }, 3000);
};
document.body.setAttribute("onkeydown","if(event.ctrlKey && event.keyCode==80){return false;};if(event.ctrlKey && event.keyCode==79){return false;}")
    `
    //clientSet
    var element1 = document.createElement("script");
    element1.innerHTML = all_code;
    document.head.prepend(element1);
    console.log('Utilities Loaded.');

    */
});

if ((fs.existsSync("C:/OP-Client")) === false) {
    fs.mkdirSync("C:/OP-Client"), {
        recursive: true
    };
}
if ((fs.existsSync(`${dir6}`)) === false) {
    fs.mkdirSync(`${dir6}`), {
        recursive: true
    };
}

if ((fs.existsSync(`${dirO}`)) === false) {
    fs.mkdirSync(`${dirO}`), {
        recursive: true
    };
}
if ((fs.existsSync(`${dir6}/angle.txt`)) === false) {
    fs.writeFile(`${dir6}/angle.txt`, '', "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
}
if ((fs.existsSync(`${dir6}/fps.txt`)) === false) {
    fs.writeFile(`${dir6}/fps.txt`, '--disable-frame-rate-limit', "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
}
fs.writeFile(`${dir6}/manifest.json`, manifest, "utf8", (err) => {
    if (err)
        console.log(err);
    else {
        console.log("Sets written");
    }
});
fs.writeFile(`${dir6}/script.js`, script, "utf8", (err) => {
    if (err)
        console.log(err);
    else {
        console.log("Sets written");
    }
});
fs.writeFile(`${dirO}/manifest.json`, manifest2, "utf8", (err) => {
    if (err)
        console.log(err);
    else {
        console.log("Sets written");
    }
});

fs.writeFile(`${dirO}/init.js`, init, "utf8", (err) => {
    if (err)
        console.log(err);
    else {
        console.log("Sets written");
    }
});
fs.writeFile(`${dir6}/update.bat`, "start C:/OP-Client/Resources/update.exe && exit", "utf8", (err) => {
    if (err)
        console.log(err);
    else {
        console.log("Sets written");
    }
});
/////////////////////

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 500,
        transparent: true,
        frame: false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "/preload.js"),
            nodeIntegration: true,
            enableRemoteModule: true
        },
    });

    win.setResizable(false);
    win.loadFile('index.html')
    win.once("ready-to-show", () => {
        win.show()
    });
    win.setAlwaysOnTop(true, 'screen');

    const backWin = new BrowserWindow({
        width: 500,
        height: 500,
        transparent: true,
        frame: false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, "/update.js"),
            nodeIntegration: true,
            enableRemoteModule: true
        },
    });

    function fadeSplash() {
        win.webContents.send("fade");
    };

    async function launchgame() {
        var fps = (fs.readFileSync(`${dir6}/fps.txt`, 'utf8'));
        var angle = (fs.readFileSync(`${dir6}/angle.txt`, 'utf8'));

        console.log(fps, angle);

        exec(`start msedge --app=https://krunker.io/ --load-extension=%USERPROFILE%/Documents/KrunkerResourceSwapper,C:/OP-Client/Resources ${fps} ${angle}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        })
		
		startCheck()
    };

    ipcMain.on("noupdate", () => {
        launchgame();
        fadeSplash();
        setTimeout(function() {
            //backWin.destroy();
            win.destroy();
        }, 2000);
    });

    ipcMain.on("UpdateAvailable", () => {
        win.webContents.send("UpdateAvailable");
        console.log('UpdateAvailable');
    });

    ipcMain.on("quit", () => {
        app.quit()
    });

    backWin.loadURL('https://bluzed.github.io/maz/update.html');

    function SettingsWindow() {
        const Swin = new BrowserWindow({
            width: 400,
            height: 225,
            frame: false,
            show: false,
            webPreferences: {
                preload: path.join(__dirname, "/settings.js"),
                nodeIntegration: true,
                enableRemoteModule: true
            },
        });
        Swin.loadFile('settings.html')
        Swin.once("ready-to-show", () => {
            Swin.show()
        });
        ipcMain.on("closesettings", () => {
            Swin.destroy()
        });
    };

    app.whenReady().then(() => {
        globalShortcut.register('Ctrl + O + P', () => {
            SettingsWindow()
        })
    })

    const isRunning = (query, cb) => {
        let platform = process.platform;
        let cmd = '';
        switch (platform) {
            case 'win32':
                cmd = `tasklist`;
                break;
            case 'darwin':
                cmd = `ps -ax | grep ${query}`;
                break;
            case 'linux':
                cmd = `ps -A`;
                break;
            default:
                break;
        }
        exec(cmd, (err, stdout, stderr) => {
            cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
        });
    }

    function appRunCheck(statusA) {
        var status = statusA;
        if (status == false) {
            console.log('No')
			app.quit()
        } else {
            console.log('Yes')
        }
    };

    function startCheck() {
        setInterval(function() {
            isRunning('msedge.exe', (status) => {
                appRunCheck(status);
            })
        }, 2000);
    };

}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})