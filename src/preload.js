const {
    ipcRenderer
} = require("electron");
const Store = require("electron-store");
const config = new Store();

//ipcRenderer.send('angletype', newAngle);

//
var timercolor = config.get('timercolor'); //white #ffffff
var enableTimer = config.get('enableTimer'); //true
var enableCustomSky = config.get('enableCustomSky'); //false
var skyType = config.get('skyType'); //solid;
var SkySolidColor = config.get('SkySolidColor'); //white #ffffff;
var enableSwap = config.get('enableSwap'); //true
var fpscap = config.get('fpscap'); //false
var angleType = config.get('angleType'); //default


if (timercolor === undefined) {
    config.set('timercolor', '#ffffff');
};
if (enableTimer === undefined) {
    config.set('enableTimer', 'true');
};
if (enableCustomSky === undefined) {
    config.set('enableCustomSky', 'false');
};
if (skyType === undefined) {
    config.set('skyType', 'solid');
};
if (SkySolidColor === undefined) {
    config.set('SkySolidColor', '#ffffff');
};
if (enableSwap === undefined) {
    config.set('enableSwap', 'true');
};
if (fpscap === undefined) {
    config.set('fpscap', 'false');
};
if (angleType === undefined) {
    config.set('angleType', 'default');
};
//

window.addEventListener("DOMContentLoaded", () => {
    if (document.location.href.startsWith("https://krunker.io/")) {
        if (enableSwap === "true") {
            ipcRenderer.send("swapFiles");
        };
    }
});

ipcRenderer.on("css-urls", (e, d) => {
    cssurls = d.urls;
    cssurls.forEach((url) => {
        const cssEl = document.createElement("link");
        cssEl.href = url;
        cssEl.rel = "stylesheet";
        document.head.appendChild(cssEl);
    });
});



let cssurls;

//html vars
var menuwinhtml = `
<div id="settingsTabLayout" style="display:none!important"></div>
<div style="margin-top: 20px!important" class="setHed" id="setHed_local">All changes require restart. Close this window to apply.</div>
<div class="settName" title="">Cap FPS to Monitor Refresh rate?<label class="switch" style="margin-left:10px"><input type="checkbox" id="fpsBox" checked=""><span class="slider"></span></label></div>
<div class="settName" title="">
   Angle Backend
   <select id="angletyp" class="inputGrey2">
      <option value="default">Default</option>
      <option value="gl">OPEN GL</option>
	  <option value="d3d11">D3D11</option>
	  <option value="d3d9">D3D9</option>
	  <option value="d3d11on12">D3D11 ON 12</option>
   </select>
</div>
<div class="settName" title="">Enable Menu Timer<label class="switch" style="margin-left:10px"><input type="checkbox" id="menuTimerBox" checked=""><span class="slider"></span></label></div>
<div class="settName" title="">Menu Timer Color<input type="color" id="ColorPick2" style="float:right;" name="TimerColor"> </div>
<div class="settName" title="">Enable Custom Sky<label class="switch" style="margin-left:10px"><input type="checkbox" id="skyBox"><span class="slider"></span></label></div>
<div class="settName" title="">
   Custom Sky Type
   <select id="skytyp" class="inputGrey2">
      <option value="rgb">RGB</option>
      <option value="solid">SOLID</option>
   </select>
</div>
<div class="settName" title="">Custom Sky Color<input type="color" id="ColorPick1" style="float:right;" name="ColorPicker" value="#000000"> </div>
</div>
`

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

//<div class="leaderItem"><div class="leaderCounter">2.</div><div class="leaderName">Player_1<span class="rainbowText" style="color:rgb"> [FUCK]</span></div><div class="leaderScore">0</div></div>
//<img src="source_img" alt="Girl in a jacket" width="30" height="30">

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
    newSetClicker.setAttribute("onclick", "SOUND.play('select_0',0.1);");
    newSetClicker.innerHTML = "OP-Client";
    layout.appendChild(newSetClicker);
    newSetClicker.addEventListener("click", () => {
        clientTab();
        TabImports()
    });
}

ipcRenderer.on("pointerunlock", () => {
    console.log(showWindow(21));
	console.log('shown');
    closWind()
	console.log('hid');
});

ipcRenderer.on("quickFFA", () => {
    var hideMenu = document.getElementById("menuWindow");
    var settoac = document.getElementById("menuBtnSettings");
    settoac.click();
    hideMenu.style.display = "none";
    setSetting("oldBrowser", false);
    var clk = document.getElementById("menuBtnBrowser");
    clk.click();
    hideMenu.style.display = "none";
    setTimeout(function() {
        console.log(quickJoinRegion(0, 1));
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
    console.log('online')
});


function TabImports() {
    document.getElementById("ColorPick1").addEventListener("change", PickerWatch, false);
    document.getElementById("ColorPick1").setAttribute("value", SkySolidColor);

    document.getElementById("ColorPick2").addEventListener("change", timerColor, false);
    document.getElementById("ColorPick2").setAttribute("value", timercolor);

    document.getElementById("menuTimerBox").addEventListener("click", () => {
        TimerWatch()
    });
    document.getElementById("skyBox").addEventListener("click", () => {
        skyWatch()
    });
	document.getElementById("fpsBox").addEventListener("click", () => {
        fpsWatch()
    });

    var skytyp = document.getElementById("skytyp")
	skytyp.value = skyType;
    skytyp.addEventListener("click", () => {
        SkyType()
    });
     
	function SkyType() {
		var skytyp = document.getElementById("skytyp")
		var valuee = skytyp.value;
		config.set("skyType", valuee);
	};
	
    var angletyp = document.getElementById("angletyp")
	angletyp.value = angleType;
    angletyp.addEventListener("click", () => {
        angletype()
    });
     
	function angletype() {
		var valuewe = angletyp.value;
		config.set("angleType", valuewe);
		if (valuewe === "default") {
			ipcRenderer.send('anglenone');
		} else {
			ipcRenderer.send('angletype', valuewe);
		};
	};
	
    var bool = enableTimer;
    if (bool == "true") {
        document.getElementById("menuTimerBox").setAttribute("checked", "");
        menuTimer()
    } else {
        document.getElementById("menuTimerBox").removeAttribute("checked", "");
    }

    var bool2 = enableCustomSky;
    if (bool2 == "true") {
        document.getElementById("skyBox").setAttribute("checked", "");
    } else {
        document.getElementById("skyBox").removeAttribute("checked", "");
    }
	
	var bool3 = fpscap;
    if (bool3 == "true") {
        document.getElementById("fpsBox").setAttribute("checked", "");
    } else {
        document.getElementById("fpsBox").removeAttribute("checked", "");
    }

};

function clientTab() {
    document.getElementById("menuWindow").innerHTML = menuwinhtml;
    document.getElementById("menuWindow").style.display = "block!important";
	document.getElementById('windowCloser').addEventListener("click", () => {
		restartGame();
    },{once : true});
};

function TimerWatch() {
    var box = document.getElementById("menuTimerBox");
    var bool = box.checked;
    if (bool == true) {
        config.set("enableTimer", 'true');
        menuTimer()
    } else {
        config.set("enableTimer", 'false');
    }
};

function skyWatch() {
    var box = document.getElementById("skyBox");
    var bool = box.checked;
    if (bool == true) {
        config.set("enableCustomSky", 'true');
    } else {
        config.set("enableCustomSky", 'false');
    }
};

function fpsWatch() {
    var box = document.getElementById("fpsBox");
    var bool = box.checked;
    if (bool == true) {
		ipcRenderer.send('fpsfalse');
        config.set("fpscap", 'false');
    } else {
		ipcRenderer.send('fpstrue');
        config.set("fpscap", 'true');
    }
};

function PickerWatch(Event) {
    try {
        config.set("SkySolidColor", Event.target.value);
    } catch {
        console.log("Color picker failed to apply local change to storage.");
    }
};

function timerColor(Event) {
	try {
        config.set("timercolor", Event.target.value);
    } catch {
        console.log("Color picker failed to apply local change to storage.");
    }
};
function restartGame() {
	if (window.confirm("Would you like to apply the changes now? All changes will be lost if you abort the restart.") == true) {
		ipcRenderer.send('restart');
	} else {
		return;
	}
};
//Client popup workaround from idkr
window.OffCliV = true;