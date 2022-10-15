const path = require("path");
const { app, BrowserWindow } = require("electron");

const isDev = process.env.NODE_ENV !== "production";

const createWindow = () => {
	const win = new BrowserWindow({
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

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

//Menu template

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
