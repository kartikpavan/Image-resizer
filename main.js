const path = require("path");
const os = require("os");
const fs = require("fs");
const resizeImg = require("resize-img");
const { app, BrowserWindow, shell } = require("electron");
const { ipcMain } = require("electron/main");

const isDev = process.env.NODE_ENV !== "production";
let win;

const createWindow = () => {
	win = new BrowserWindow({
		width: isDev ? 1000 : 700,
		height: 650,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js"),
		},
	});
	// open dev tools by default if in DEV_MODE
	if (isDev) {
		win.webContents.openDevTools();
	}

	win.loadFile("index.html");
};

app.whenReady().then(() => {
	createWindow();

	//remove win from memory when closed
	win.on("closed", () => (win = null));
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

//Respong of ipcRenderer
ipcMain.on("image:resize", (e, options) => {
	// creating new property
	options.destination = path.join(os.homedir(), "imageresizer");

	resizeImage(options);
});

async function resizeImage(options) {
	const { imgPath, width, height, destination } = options;
	try {
		const image = await resizeImg(fs.readFileSync(imgPath), {
			width: Number(width),
			height: Number(height),
		});
		//create newFile name
		const newFileName = path.basename(imgPath);
		// create destination folder
		if (!fs.existsSync(destination)) {
			fs.mkdirSync(destination);
		}
		// write to destination folder
		fs.writeFileSync(path.join(destination, newFileName), image);
		// send success message
		win.webContents.send("image:done");
		// Open destination folder to see the result
		shell.openPath(destination);
	} catch (error) {
		console.log(error.message);
	}
}

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
