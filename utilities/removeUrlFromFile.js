const fs = require("fs");

function clearFile(path) {
	fs.writeFile(path, "", (err) => {
		if (err) {
			console.log(err);
		}
	});
}

function appendToFile(path, ele) {
	fs.appendFile(path, `${ele}\n`, (err) => {
		if (err) {
			message(msg, "Cannot Complete The request. Try Again !");
		} else {
		}
	});
}

module.exports = function (path, num, cb, msg) {
	const indexToDelete = num - 1;
	fs.readFile(path, "utf8", function (err, text) {
		if (err) {
			console.log(err);
		} else {
			let textArray = text.split("\n").filter((ele) => {
				if (!ele == " ") {
					return ele;
				}
			});
			if (textArray.length == 0) {
				cb(msg, "Playlist is Empty !");
				return;
			}
			clearFile(path);
			textArray.forEach((ele, index) => {
				if (!(index == indexToDelete)) {
					appendToFile(path, ele);
				}
			});
			cb(msg, "Song Removed !");
		}
	});
};
