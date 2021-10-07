const fs = require("fs");
const ytdl = require("ytdl-core");
const message = require("../utilities/message");
const linkToTitle = require("../utilities/linkToTitle");
const removeUrlFromFile = require("../utilities/removeUrlFromFile");
const videoTitle = require("../utilities/videoTitle");

module.exports = function (msg, tokens) {
	let path = `./playlist/${msg.author.id}.txt`;

	if (fs.existsSync(path)) {
		console.log(`Playlist for user ${msg.author.id} exists.`);
	} else {
		fs.writeFile(path, "", (err) => {
			if (err) {
				console.log(err);
			} else {
				console.log(
					`Playlist file for user ${msg.author.id} created Successfully.`
				);
			}
		});
	}
	switch (tokens[0]) {
		case "add":
			if (ytdl.validateURL(tokens[1])) {
				fs.appendFile(path, `${tokens[1]}\n`, (err) => {
					if (err) {
						console.log(err);
						message(
							msg,
							"Cannot Complete The request. Try Again !"
						);
					} else {
						videoTitle(tokens[1], message, msg);
					}
				});
			} else {
				message(msg, "Please give me valid url without line break!");
			}
			break;
		case "show":
			message(msg, "Reading Files...");
			fs.readFile(path, "utf8", function (err, text) {
				if (err) {
					console.log(err);
				} else {
					linkToTitle(text, message, msg, "PLAYLIST : \n"); //msg obj is required for "message" function
				}
			});
			break;
		case "remove":
			removeUrlFromFile(path, tokens[1], message, msg);
			break;
		default:
			message(msg, "Enter a Valid Command !");
			break;
	}
};
