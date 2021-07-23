require("v8-compile-cache");
const {
    ipcRenderer
} = require("electron");
var fs = require('fs');
const path = require("path");
const {
    app
} = require("electron").remote;

const dir5 = path.join(app.getPath("documents"), "OP-Client/Updates/Client-Settings");

var timercolor = fs.readFileSync(`${dir5}/timercolor.txt`, 'utf8'); //white #ffffff
var enableTimer = fs.readFileSync(`${dir5}/timertog.txt`, 'utf8'); //true
var enableCustomSky = fs.readFileSync(`${dir5}/skytog.txt`, 'utf8'); //false
var skyType = fs.readFileSync(`${dir5}/skyType.txt`, 'utf8'); //solid;
var SkySolidColor = fs.readFileSync(`${dir5}/skycolor.txt`, 'utf8'); //#ffffff;
var enableSwap = fs.readFileSync(`${dir5}/swaptog.txt`, 'utf8'); //true
var angletyp = fs.readFileSync(`${dir5}/angle.txt`, 'utf8'); //default

function skyFunction() {
    var checkBox = document.getElementById("skycheck");
    if (checkBox.checked == true) {
        enablesky()
    } else {
        disablesky()
    }
}

function swapFunction() {
    var checkBox = document.getElementById("swapcheck");
    if (checkBox.checked == true) {
        enableswap()
    } else {
        disableswap()
    }
}

function timFunction() {
    var checkBox = document.getElementById("timercheck");
    if (checkBox.checked == true) {
        timercheck(true)
    } else {
        timercheck(false)
    }
}

function enablesky() {
    fs.writeFile(`${dir5}/skytog.txt`, 'true', "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
};

function disablesky() {
    fs.writeFile(`${dir5}/skytog.txt`, 'false', "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
};

function enableswap() {
    fs.writeFile(`${dir5}/swaptog.txt`, 'true', "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
};

function disableswap() {
    fs.writeFile(`${dir5}/swaptog.txt`, 'false', "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
};

function timercheck(val) {
    fs.writeFile(`${dir5}/timertog.txt`, val, "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
};

window.addEventListener("DOMContentLoaded", () => {
    allfuncs()
});

function allfuncs() {

    if (enableCustomSky === "true") {
        document.getElementById("skycheck").setAttribute("checked", "");
    } else {};

    if (enableSwap === "true") {
        document.getElementById("swapcheck").setAttribute("checked", "");
    } else {};
	
	if (enableTimer === "true") {
        document.getElementById("timercheck").setAttribute("checked", "");
    } else {};

    var skybtn = document.getElementById("skycheck");
    skybtn.addEventListener("click", () => {
        skyFunction();
    });

    var swapbtn = document.getElementById("swapcheck");
    swapbtn.addEventListener("click", () => {
        swapFunction();
    });
	
	var timbtn = document.getElementById("timercheck");
    timbtn.addEventListener("click", () => {
        timFunction();
    });

    var colorval1 = document.getElementById("timer__col");
    colorval1.setAttribute("value", `${timercolor}`);
    var applybutton1 = document.getElementById("applybutton1");
    applybutton1.addEventListener("click", () => {
        updateColor1();
    });

    function updateColor1() {
        var v_i1 = document.getElementById("timer__col").value;
        console.log(`Value- ${v_i1}`)
        fs.writeFile(`${dir5}/timercolor.txt`, `${v_i1}`, "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });
    }

    var colorval = document.getElementById("sky__col");
    colorval.setAttribute("value", `${SkySolidColor}`);
    var applybutton = document.getElementById("applybutton");
    applybutton.addEventListener("click", () => {
        updateColor();
    });

    function updateColor() {
        var v_i = document.getElementById("sky__col").value;
        console.log(`Value- ${v_i}`)
        fs.writeFile(`${dir5}/skycolor.txt`, `${v_i}`, "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });
    }

    var skytype = document.getElementById("skytyp");
    skytype.value = `${skyType}`;
    skytype.addEventListener("click", () => {
        idk();
    });

    function idk() {
        skytype.onchange = updateType();
    };

    function updateType() {
        var newtype = document.getElementById("skytyp").value;
        console.log(newtype);
        fs.writeFile(`${dir5}/skyType.txt`, `${newtype}`, "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });
    }

	var angle = document.getElementById("angle");
    angle.value = `${angletyp}`;
    angle.addEventListener("click", () => {
        idk2();
    });

    function idk2() {
        angle.onchange = updateType2();
    };

    function updateType2() {
        var newtype = document.getElementById("angle").value;
        console.log(newtype);
        fs.writeFile(`${dir5}/angle.txt`, `${newtype}`, "utf8", (err) => {
            if (err)
                console.log(err);
            else {
                console.log("Sets written");
            }
        });
    }
	
	var closebtn = document.getElementById("close");
	closebtn.addEventListener("click", () => {
        ipcRenderer.send("closesettings");
    });


};