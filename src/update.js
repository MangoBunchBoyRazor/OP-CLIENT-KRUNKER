console.log('Update Module.');
module.exports.download = function (version, updatepath) {
	
        var options = {
            fileName: `update.exe`,
            progressThrottle: 1000,
            override: true
        };
        const {
            DownloaderHelper
        } = require('node-downloader-helper');
		console.log('Downloading Update..');
        const dl = new DownloaderHelper(`https://github.com/BluZed/OP-CLIENT-KRUNKER/releases/download/v${version}/WIN.x64.Bit.exe`, updatepath, options);
        dl.on('end', () => console.log('Update Downloaded, Install pending...'))
        dl.on('end', () => installUpdate())
        dl.start();

};
module.exports.install = function (updatepath) {
	
        var BatFilePath = (`${updatepath}/install.bat`);
        const {
            shell
        } = require('electron');
        shell.openPath(BatFilePath);
        setTimeout(function() {
            ipcRenderer.send("quit");
        }, 1000);

};


function update() {

    const versionNew = document.getElementById("version").innerHTML;
    console.log(version);
    console.log(`Newest version - ${versionNew}`);

    function checkforupdates() {
        var thevar = versionNew; //version-new
        if (thevar > version) {
            updateDownload();
            console.log('update downloading')
            setTimeout(function() {
                ipcRenderer.send("UpdateAvailable");
            }, 1000);
        } else {
            ipcRenderer.send("noupdate");
        }
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
        shell.openPath(BatFilePath);
        setTimeout(function() {
            ipcRenderer.send("quit");
        }, 1000);
    }

    function updateDownload() {
        var options = {
            fileName: `update.exe`,
            progressThrottle: 1000,
            override: true
        };
        var version1 = versionNew;
        const {
            DownloaderHelper
        } = require('node-downloader-helper');
		console.log('Downloading Update..');
        const dl = new DownloaderHelper(`https://github.com/BluZed/OP-CLIENT-KRUNKER/releases/download/v${version1}/WIN.x64.Bit.exe`, updatepath, options);
        dl.on('end', () => console.log('Update Downloaded, Install pending...'))
        dl.on('end', () => installUpdate())
        dl.start();
    };

    checkforupdates()
};