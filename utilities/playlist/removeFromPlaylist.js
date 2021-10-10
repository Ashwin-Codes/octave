const axios = require("axios");
const getVideoInfo = require("../getVideoInfo");
const message = require("../message");
require("dotenv").config();

module.exports = async function (msg, num) {
	const url = process.env.FIREBASEDBURL;
	// getting ID and URL of song user want to delete.
	let songObj = await axios(url + "/playlist/" + `${msg.author.id}.json`).then((data) => {
		const playlist = data.data;
		let index = 1;
		for (const i in playlist) {
			if (index == num) {
				//Bot will need ID to send Delete Request and url for sending message to user.
				return { id: i, url: playlist[i] };
			}
			index++;
		}
	});

	if (!songObj) {
		message(msg, "Could not find the song you want to delete.");
		return;
	}

	//Sending Delete Request/
	const deleteResponse = await axios({
		method: "delete",
		url: url + "/playlist/" + `${msg.author.id}/${songObj.id}.json`,
	});

	//Handling success and error messages.
	if (deleteResponse.status == 200) {
		const songInfo = await getVideoInfo(songObj.url);
		const songTitle = songInfo.title;
		message(msg, `${songTitle} **REMOVED**`);
	} else {
		message(msg, "Song Could not be deleted.");
	}
};
