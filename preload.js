const {
    ipcRenderer
} = require("electron");

var style_transparent = `
* {
    background-color: transparent!important;
}
#img {
	content: url(./media/icon-rounded-png_2048x2048.png)!important;
}
`;

var styleNode = document.createElement("style");
styleNode.innerHTML = style_transparent;

ipcRenderer.on("fade", () => {
	document.getElementById("status").remove();
	document.head.appendChild(styleNode);
	document.getElementById("img").style.animation = "fadeOut 2s, shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite";
});

ipcRenderer.on("UpdateAvailable", () => {
	document.getElementById("status").innerHTML = "OMG I AM UPDATING!";
});