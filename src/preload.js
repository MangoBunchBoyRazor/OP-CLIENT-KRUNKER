require("v8-compile-cache");
const {
    ipcRenderer
} = require("electron");
const path = require("path");
const fs = require("fs");
const {
    app
} = require("electron").remote

let cssurls;
var sfunc;

//
const dir5 = path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings");
var timercolor = fs.readFileSync(`${dir5}/timercolor.txt`, 'utf8'); //white #ffffff
var enableTimer = fs.readFileSync(`${dir5}/timertog.txt`, 'utf8'); //true
var enableCustomSky = fs.readFileSync(`${dir5}/skytog.txt`, 'utf8'); //false
var skyType = fs.readFileSync(`${dir5}/skyType.txt`, 'utf8'); //solid;
var SkySolidColor = fs.readFileSync(`${dir5}/skycolor.txt`, 'utf8'); //white #ffffff;
var enableSwap = fs.readFileSync(`${dir5}/swaptog.txt`, 'utf8'); //true

//html vars
var importHTML = `
<div class="setHed">Import Settings</div>
<div class="settName" id="importSettings_div" style="display:block">Settings Input<input type="url" placeholder="Paste Settings Here" name="url" class="inputGrey2" id="settingString"></div>
<input type="file" id="fileselect" style="display: none"></input>
<label for="fileselect" style="float: left"><a class="+">Import File</a></label>
<a class="+" id="importBtn" style="float: right">Import</a>
`;
var hideSetCliHtml = `
.settingTab:nth-child(7) {
	display: none;
`;
var gameCSS = `
@import url('https://bluzed.github.io/maz/cssnew.css');
`;
var menuTimerCSS = `
.timerVal {
    display:block !important;
}
#uiBase.onMenu #topRight,#uiBase.onMenu #botRightHider,#uiBase.onMenu #roundsDisplay,#uiBase.onMenu .debugInfo,#uiBase.onMenu #curGameInfo,#uiBase.onMenu #teamScores,#uiBase.onMenu #bottomLeftHolder,#uiBase.onMenu #killCardHolder,#uiBase.onMenu #reloadMsg,#uiBase.onMenu #interactMsg,#uiBase.onMenu #timerIcon,#uiBase.onMenu #speedRunHolder,#uiBase.onMenu #terminalHolder,#uiBase.onMenu #hiddenMsg,#uiBase.onMenu #gameMessage,#uiBase.onMenu #propInstruct,#uiBase.onEndScrn #topRight,#uiBase.onEndScrn #botRightHider,#uiBase.onEndScrn #roundsDisplay,#uiBase.onEndScrn .debugInfo,#uiBase.onEndScrn #curGameInfo,#uiBase.onEndScrn #teamScores,#uiBase.onEndScrn #bottomLeftHolder,#uiBase.onEndScrn #killCardHolder,#uiBase.onEndScrn #reloadMsg,#uiBase.onEndScrn #interactMsg,#uiBase.onEndScrn #timerDisplay,#uiBase.onEndScrn #speedRunHolder,#uiBase.onEndScrn #terminalHolder,#uiBase.onEndScrn #hiddenMsg,#uiBase.onEndScrn #gameMessage,#uiBase.onEndScrn #propInstruct {
    display:none !important;
}
#uiBase.onMenu #timerDisplay {
    position:fixed;
    left:50%;
    top:calc(50% + 70px);
    transform:translate(-50%,-50%);
    background-color:transparent;
}
#uiBase.onMenu #timerVal {
    font-size:45px;
    color:white;
}
`

if (enableSwap === "true") {
    window.addEventListener("DOMContentLoaded", () => {
        if (document.location.href.startsWith("https://krunker.io/")) {
            ipcRenderer.send("swapFiles");
        }
    });
};

window.addEventListener("DOMContentLoaded", () => {
    setCss();
});

if (enableTimer === "true") {
    window.addEventListener("DOMContentLoaded", () => {
        menuTimer();
    });
};

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

window.prompt = importSettings = () => {
    const tempHTML = importHTML;
    menuWindow.innerHTML = tempHTML;
    var importFile = document.getElementById("fileselect");
    importFile.addEventListener("change", () => {
        var fr = new FileReader();
        fr.onload = function() {
            document.getElementById('settingString').value = fr.result;
        }
        fr.readAsText(importFile.files[0]);
        importBtn.click();
    });
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

ipcRenderer.on("css-urls", (e, d) => {
    cssurls = d.urls;
    cssurls.forEach((url) => {
        const cssEl = document.createElement("link");
        cssEl.href = url;
        cssEl.rel = "stylesheet";
        document.head.appendChild(cssEl);
    });
});

function removeCtab() {
    var sethidetab = document.getElementById("uiBase");
    var styleElement1 = document.createElement("style");
    styleElement1.innerHTML = hideSetCliHtml;
    sethidetab.prepend(styleElement1);
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
    var styleElementMenu = document.createElement("style");
    styleElementMenu.innerHTML = menuTimerCSS;
    styleElement1.innerHTML = hideSetCliHtml;
    sethidetab.prepend(styleElement1);
    var styleElementCLIENT = document.createElement("style");
    styleElementCLIENT.innerHTML = gameCSS;
    document.head.prepend(styleElementCLIENT);
    document.querySelector('body').prepend(styleElementCLIENT);
    document.head.prepend(styleElementMenu);
    document.querySelector('body').prepend(styleElementMenu);
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

function menuTimer() {
    setInterval(() => {
        document.getElementById('spectButton').setAttribute('style', 'top: 20px;left: 550px')
        let menuTimer = document.createElement("div")
        menuTimer.setAttribute('id', 'menuTimer')
        menuTimer.setAttribute('style', `margin-bottom: 50px;color: ${timercolor}`)
        document.getElementById('instructions').appendChild(menuTimer)
        let timeValue = document.getElementById('timerVal').innerHTML
        document.getElementById('menuTimer').innerHTML = timeValue
    }, 1000)
};

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

ipcRenderer.on("pointerunlock", () => {
    document.exitPointerLock();
    console.log(showWindow(35));	
    console.log(closWind());		
});

ipcRenderer.on("quickFFA", () => {
    var hideMenu = document.getElementById("menuWindow");
    var settoac = document.getElementById("menuBtnSettings");
    settoac.click();
    hideMenu.style.display = "none";
    console.log(importSettings());
    parseSettings(`{"oldBrowser":false}`);
    var clk = document.getElementById("menuBtnBrowser");
    clk.click();
    hideMenu.style.display = "none";
    setTimeout(function() {
        console.log(quickJoinRegion(0,1));
    }, 3000);
});

//Internet connectivity status dialog box on start
function isOnline(user_callback) {
    var message = function() {
        const {
            dialog
        } = require('electron').remote;

        return dialog.showMessageBox({
            title: "No Internet",
            message: "No internet available, Please check your Internet Connection.",
            type: 'warning',
            defaultId: 0
        })
    };

    var execute = function() {
        if (navigator.onLine) {
            user_callback();
        } else {
            message();
        }
    };
    execute()
}

isOnline(function() {
    //anthin
});

//Client popup workaround 
window.OffCliV = true;
