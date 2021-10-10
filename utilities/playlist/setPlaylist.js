const axios = require("axios");
const ytdl = require("ytdl-core");
require("dotenv").config();

module.exports = function (msg, song, cb) {
	const url = process.env.FIREBASEDBURL;
	if (ytdl.validateURL(song)) {
		axios({
			method: "post",
			url: url + "/playlist/" + `${msg.author.id}.json`,
			data: JSON.stringify(song),
		}).then((response) => {
			cb(response);
		});
	}
};
