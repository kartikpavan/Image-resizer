const form = document.querySelector("#img-form");
const img = document.querySelector("#img");
const outputPath = document.querySelector("#output-path");
const filename = document.querySelector("#filename");
const heightInput = document.querySelector("#height");
const widthInput = document.querySelector("#width");
const uploadedImage = document.querySelector("#uploaded-image");

function loadImage(e) {
	const file = e.target.files[0];
	if (!isFileImage(file)) {
		customAlert("please selecte an image", "error");
		return;
	}

	//get original dimenshions
	const image = new Image();
	image.src = URL.createObjectURL(file);
	image.onload = function () {
		widthInput.value = this.width;
		heightInput.value = this.height;
	};

	form.style.display = "block";
	filename.innerText = file.name;
	outputPath.innerText = path.join(os.homedir(), "imageresizer");
}

// handle image submit
function sendImage(e) {
	e.preventDefault();
	const width = widthInput.value;
	const height = heightInput.value;
	const imgPath = img.files[0].path;

	if (!img.files[0]) {
		customAlert("Please Upload an Image", "error");
		return;
	}
	if (width === "" || height === "") {
		customAlert("Height and width cannot be empty", "error");
		return;
	}
	// Send to Main.js using ipc renderer (Built in Electron)
	ipcRenderer.send("image:resize", { imgPath, width, height });
}

//  Display Uploaded Image on the screen
function readURL(input) {
	console.log(input);
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			uploadedImage.setAttribute("src", e.target.result);
		};
		reader.readAsDataURL(input.files[0]);
	}
}
// Make sure uploaded file is an image
function isFileImage(file) {
	const acceptedImageTypes = ["image/gif", "image/png", "image/jpeg"];
	return file && acceptedImageTypes.includes(file["type"]);
}

// Alert Function
function customAlert(message, type) {
	if (type === "success") {
		Toastify.toast({
			text: message,
			duration: 3000,
			close: false,
			style: {
				background: "linear-gradient(to right, #FDFC47 ,#7B920A )",
				color: "white",
				textAlign: "center",
				height: "2rem",
			},
		});
	}
	if (type === "error") {
		Toastify.toast({
			text: message,
			duration: 3000,
			close: false,
			style: {
				background: "linear-gradient(to right, #ED213A, #93291E)",
				color: "white",
				textAlign: "center",
				height: "2rem",
			},
		});
	}
}

// handling events
img.addEventListener("change", loadImage);
form.addEventListener("submit", sendImage);
