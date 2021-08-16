const {
    ipcRenderer
} = require("electron");
var fs = require('fs');
const path = require("path");
const {
    app
} = require("electron").remote;

const dir5 = "C:/OP-Client/Resources";

var angle = fs.readFileSync(`${dir5}/angle.txt`, 'utf8'); //white #ffffff
var fpstog = fs.readFileSync(`${dir5}/fps.txt`, 'utf8'); //true

function enableswap() {
    fs.writeFile(`${dir5}/fps.txt`, '', "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
};

function disableswap() {
    fs.writeFile(`${dir5}/fps.txt`, '--disable-frame-rate-limit', "utf8", (err) => {
        if (err)
            console.log(err);
        else {
            console.log("Sets written");
        }
    });
};

function swapFunction() {
    var checkBox = document.getElementById("swapcheck");
    if (checkBox.checked == true) {
        enableswap()
    } else {
        disableswap()
    }
}

window.addEventListener("DOMContentLoaded", () => {
    allfuncs()
});

function allfuncs() {

    if (fpstog === "") {
        document.getElementById("swapcheck").setAttribute("checked", "");
    } else {};

    var swapbtn = document.getElementById("swapcheck");
    swapbtn.addEventListener("click", () => {
        swapFunction();
    });

	var angle = document.getElementById("angle");
    angle.value = `${angle}`;
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