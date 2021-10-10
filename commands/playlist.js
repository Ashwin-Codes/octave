// REFERENCE TO INFORMATION FOR HOW TO PERFORM
// CRUD OPERATIONS IN FIREBASE REALTIME DATABASE :
// https://firebase.google.com/docs/reference/rest/database

const ytdl = require("ytdl-core");

const getPlaylist = require("../utilities/playlist/getPlaylist");
const setPlaylist = require("../utilities/playlist/setPlaylist");
const removeFromPlaylist = require("../utilities/playlist/removeFromPlaylist");
const message = require("../utilities/message");

const getVideoInfo = require("../utilities/getVideoInfo");

module.exports = async function (msg, tokens) {
	switch (tokens[0]) {
		case "add":
			const songUrl = tokens[1];
			if (!ytdl.validateURL(songUrl)) {
				message(msg, "Please give me a valid url.");
				return;
			}
			// responseHandler is a callback function for setPlaylist function.
			async function responseHandler(response) {
				if (!response.data.name) {
					message(msg, "something went wrong.");
					return;
				}
				let videoInfo = await getVideoInfo(songUrl);
				message(msg, `'${videoInfo.title}' **added to your playlist.**`);
			}
			setPlaylist(msg, songUrl, responseHandler);
			break;

		case "show":
			//Longer the playlist longer playlistMessageHandler will take.
			message(msg, "Reading Your Playlist...");

			//playlistMessageHandler takes a playlist object => gets title for each song => sends a message with all song title combined to user.
			async function playlistMessageHandler(playlist) {
				let messageText = "";
				let index = 0; // using index variable for listing.
				for (const i in playlist) {
					const songUrl = playlist[i];
					const songInfo = await getVideoInfo(songUrl);
					const songTitle = songInfo.title;
					index++;

					messageText = messageText.concat(`**${index})** ${songTitle}\n`);
				}
				message(msg, messageText);
			}
			//getPlaylist sends an object like {ID : "Song Url", ID2 : "Song Url"}
			const playlist = await getPlaylist(msg);
			playlistMessageHandler(playlist);
			break;

		case "remove":
			removeFromPlaylist(msg, tokens[1]);
			break;

		default:
			message(msg, "Please give me a valid command.");
			break;
	}
};
