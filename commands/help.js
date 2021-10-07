//Extracts message from helpmsg file and sends to user.
const message = require("../utilities/message");
const fs = require("fs");

let helpMsg = "Something Went Wrong.."; //Fallback msg

fs.readFile("./helpmsg", "utf8", function (err, text) {
	if (err) {
		console.log(err);
	} else {
		helpMsg = text;
	}
});
module.exports = function (msg) {
	message(msg, helpMsg);
};
