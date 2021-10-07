const fs = require("fs");

module.exports = function (path) {
	fs.readFile(path, "utf8", function (err, text) {
		if (err) {
			console.log(err);
		} else {
			let textArray = text.split("\n").filter((ele) => {
				if (!ele == " ") {
					return ele;
				}
			});
			return textArray;
		}
	});
};
