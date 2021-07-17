require("v8-compile-cache");
const {
    ipcRenderer
} = require("electron");
const path = require("path");
const fs = require("fs");
const {app, globalShortcut} = require("electron").remote

const dir5 = path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings");

var enableCustomSky = fs.readFileSync(`${dir5}/skytog.txt`, 'utf8'); //false
var skyType = fs.readFileSync(`${dir5}/skyType.txt`, 'utf8'); //solid;
var SkySolidColor = fs.readFileSync(`${dir5}/skycolor.txt`, 'utf8'); //#ffffff;
var enableSwap = fs.readFileSync(`${dir5}/swaptog.txt`, 'utf8'); //true

if (enableSwap === "true") {
window.addEventListener("DOMContentLoaded", () => {
   if (document.location.href.startsWith("https://krunker.io/")) {
        ipcRenderer.send("swapFiles");
   }
});
};

window.addEventListener("DOMContentLoaded", () => {
   setCss()
});

ipcRenderer.on("css-urls", (e, d) => {
    cssurls = d.urls;
    cssurls.forEach((url) => {
        const cssEl = document.createElement("link");
        cssEl.href = url;
        cssEl.rel = "stylesheet";
        document.head.appendChild(cssEl);
		document.querySelector('body').prepend(cssEl);
    });
});
	
window.prompt = importSettings = () => {
    const tempHTML = importHTML;
    menuWindow.innerHTML = tempHTML;
    importBtn.addEventListener("click", () => {
        parseSettings(settingString.value);
    });
    parseSettings = (string) => {
        if (string) {
            try {
                const json = JSON.parse(string);
                for (const setting in json) {
                    setSetting(setting, json[setting]);
                    showWindow(1);
                }
            } catch (err) {
                console.error(err);
                alert("Error importing settings.");
            }
        }
    };
};

function setCss() {
	var logoclk = document.getElementById("gameNameHolder");
	logoclk.style.pointerEvents = "all";
	logoclk.style.cursor = "pointer";
	logoclk.addEventListener("click", () => {
        ipcRenderer.send("discord");
    });
	var sethidetab = document.getElementById("uiBase");
    var styleElement1 = document.createElement("style");
    styleElement1.innerHTML = hideSetCliHtml;
    sethidetab.prepend(styleElement1);
	var styleElementCLIENT = document.createElement("style");
	styleElementCLIENT.innerHTML = gameCSS;
    document.head.prepend(styleElementCLIENT);
    document.querySelector('body').prepend(styleElementCLIENT);
	var setbtn = document.getElementById("menuItemContainer");
	setbtn.addEventListener("click", () => {
        CliSetSetter();
		CliSetBugFix();
    });
}

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
	newSetClicker.setAttribute("onclick", "SOUND.play('select_0',0.1);closWind()");
	newSetClicker.innerHTML = "OP-Client";
	layout.appendChild(newSetClicker);
	newSetClicker.addEventListener("click", () => {
        ipcRenderer.send("clientsettings");
    });
}

sky()

function sky() {
    if (enableCustomSky === "true") {
        if (skyType === "rgb") {
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
        } else if (skyType === "solid") {
            let startCol = `${SkySolidColor}`;
            let kr;
            Object.defineProperty(Object.prototype, "skyCol", {
                enumerable: false,
                get() {
                    return startCol;
                }
            })
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
        }
    }
};

//html vars
var importHTML = `
<div class="setHed">Import Settings</div>
<div class="settName" id="importSettings_div" style="display:block">Settings Input<input type="url" placeholder="Paste Settings Here" name="url" class="inputGrey2" id="settingString"></div>
<a class="+" id="importBtn">Import</a>
`;
var hideSetCliHtml = `
.settingTab:nth-child(7) {
	display: none;
`;
var gameCSS = `
@import url('https://bluzed.github.io/maz/css.css');
`;
var ffacss = `
#instructions::after {
	display: block!important;
	margin-top: 10px!important;
	color: red;
	font-size: 48px!important;
	text-transform: none!important;
	animation:rainbow .5s linear infinite!important;
	content: 'Please Wait... Finding FFA Lobby'!important;
}
`;
var randomLcss = `
#instructions::after {
	display: block!important;
	margin-top: 10px!important;
	color: red;
	font-size: 48px!important;
	text-transform: none!important;
	animation:rainbow .5s linear infinite!important;
	content: 'Please Wait... Finding Random Lobby'!important;
}
`;
//

ipcRenderer.on("quickFFA", () => {
quickFFA();
function quickFFA() {
	var clk = document.getElementById("menuBtnBrowser");
	var hideMenu = document.getElementById("menuWindow");
	clk.click();
	hideMenu.style.display = "none";
	var st2 = document.createElement("style");
	st2.innerHTML = ffacss;
	document.querySelector('body').prepend(st2);
	setTimeout(function(){ console.log(quickJoinRegion(0)); }, 1500);
}});

ipcRenderer.on("randomLobby", () => {
randomLobby();
function randomLobby() {
	var st2 = document.createElement("style");
	st2.innerHTML = randomLcss;
	document.querySelector('body').prepend(st2);
	setTimeout(function(){ ipcRenderer.send("randomLobby"); }, 1500);
}});

var dirname = __dirname;
window.OffCliV = true;
console.log(`${dirname}/preload.js`);