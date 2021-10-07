const fs = require("fs");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const linkToTitle = require("../utilities/linkToTitle");

let songs = [];
let songIndex = 0;
let searchedSongs = [];

function message(msgObj, msgText) {
	msgObj.channel.send({
		embed: {
			color: 3447003,
			description: msgText,
		},
	});
}

function getVideoId(url) {
	if (url.length == 43) {
		return url.substr(32);
	} else if (url.length == 39) {
		return url.substr(28);
	}
}

async function getVideoInfo(url) {
	let video_id = getVideoId(url);
	const video = await yts({
		videoId: video_id,
	});
	return video;
}

function urlValidityHandler(url, msg) {
	if (ytdl.validateURL(url)) {
		songs.push(url);
		message(msg, `Song Added | Currently in Queue : ${songs.length}`);
	} else {
		message(msg, "Please give me a valid URL.");
	}
}

async function messageCurrentSongName(msg, url) {
	const video_title = (await getVideoInfo(url)).title;
	message(msg, `Now Playing ${video_title}`);
}

function play(voiceChannel, msg, seek = 0) {
	console.log("Array of present Songs : ", songs);
	if (songs[songIndex]) {
		voiceChannel
			.join()
			.then((connection) => {
				console.log("Bot Joined VC.");
				let stream = ytdl(songs[songIndex], {
					filter: "audioonly",
				});
				messageCurrentSongName(msg, songs[songIndex]);
				const dispatcher = connection.play(stream, {
					seek: seek,
					volume: 0.7,
				});
				dispatcher.on("finish", (end) => {
					songIndex++;
					play(voiceChannel, msg);
				});
			})
			.catch((err) => console.log(err));
	} else {
		songs = [];
		songIndex = 0;
		message(msg, "No Songs to Play ! Bye Bye");
		voiceChannel.leave();
	}
}

async function searchYT(term) {
	try {
		let arr = [];
		const searchResult = await yts.search(term);
		await searchResult.all.forEach((sr) => {
			arr.push(sr);
		});
		searchedSongs = arr;
	} catch (err) {
		console.log(err);
	}
}

async function playYTSong(msg, tokens, voiceChannel) {
	if (searchedSongs.length > 0) {
		let chosenNumber = parseInt(tokens[1] - 1);
		if (typeof chosenNumber == "number") {
			if (chosenNumber >= 0 || chosenNumber <= 9) {
				let urlOfSongToPlay = searchedSongs[chosenNumber].url;
				if (songs.length <= 0) {
					songs.push(urlOfSongToPlay);
					songIndex = songs.length - 1;
					play(voiceChannel, msg);
				} else if (songs.length > 0) {
					songs.push(urlOfSongToPlay);
					message(msg, "Song Added To queue");
				}
			} else {
				message(msg, "Please Enter a number from 1 to 10 !");
			}
		} else {
			message(msg, "Please Enter a number !");
		}
	} else {
		message(msg, "Search Result is Empty. Use `.music search 'search term'` to search yt.");
	}
}

module.exports = function (msg, tokens) {
	let voiceChannel = msg.member.voice.channel;
	// Checking if user have joined a voice channel
	if (voiceChannel == null) {
		message(msg, "Please Join a Voice Channel First.");
	} else {
		switch (tokens[0]) {
			case "play":
				urlValidityHandler(tokens[1], msg);
				play(voiceChannel, msg);
				break;
			case "add":
				urlValidityHandler(tokens[1], msg);
				break;
			case "stop":
				songs = [];
				songIndex = 0;
				voiceChannel.leave();
				break;
			case "clear":
				songs = [];
				songIndex = 0;
				message(msg, "Queue Cleared.");
				break;
			case "queue":
				if (songs.length == 0) {
					message(msg, "Nothing in the Queue ! use '.music add' command to add music.");
				}
				let text = songs.join("\n");
				linkToTitle(text, message, msg, "CURRENT QUEUE : \n");
				break;
			case "skip":
				songIndex++;
				play(voiceChannel, msg);
				break;
			case "prev":
				songIndex--;
				play(voiceChannel, msg);
				break;
			case "search":
				(async function func() {
					//getting all the inputs, deleting the first one and combining all others
					let keywords = [...tokens];
					keywords.shift();
					let term = keywords.join(" ");
					await searchYT(term);
					message(
						msg,
						`
					**1)** ${searchedSongs[0].title.substr(0, 70)}... __${
							searchedSongs[0].timestamp
						}__\n**2)** ${searchedSongs[1].title.substr(0, 70)}... __${
							searchedSongs[1].timestamp
						}__\n**3)** ${searchedSongs[2].title.substr(0, 70)}... __${
							searchedSongs[2].timestamp
						}__\n**4)** ${searchedSongs[3].title.substr(0, 70)}... __${
							searchedSongs[3].timestamp
						}__\n**5)** ${searchedSongs[4].title.substr(0, 70)}... __${
							searchedSongs[4].timestamp
						}__\n**6)** ${searchedSongs[5].title.substr(0, 70)}... __${
							searchedSongs[5].timestamp
						}__\n**7)** ${searchedSongs[6].title.substr(0, 70)}... __${
							searchedSongs[6].timestamp
						}__\n**8)** ${searchedSongs[7].title.substr(0, 70)}... __${
							searchedSongs[7].timestamp
						}__\n**9)** ${searchedSongs[8].title.substr(0, 70)}... __${
							searchedSongs[8].timestamp
						}__\n**10)** ${searchedSongs[9].title.substr(0, 70)}... __${
							searchedSongs[9].timestamp
						}__`
					);
				})();
				break;
			case "s":
				playYTSong(msg, tokens, voiceChannel);
				break;
			case "playlist":
				let path = `./playlist/${msg.author.id}.txt`;
				fs.readFile(path, "utf8", function (err, text) {
					if (err) {
						message(msg, "Playlist not found..");
					} else {
						let textArray = text.split("\n").filter((ele) => {
							if (!ele == " ") {
								return ele;
							}
						});
						songs = textArray;
						songIndex = 0;
						play(voiceChannel, msg);
					}
				});
				break;
			case "goto":
				let i = tokens[1] - 1;
				if (i > 0 || i < songs.length - 1) {
					songIndex = i;
					play(voiceChannel, msg);
				} else {
					message(msg, "Invalid Song Request !");
				}
				break;
			case "seek":
				play(voiceChannel, msg, tokens[1]);
				break;
			default:
				message(msg, "Please Type a Valid Command !");
				break;
		}
	}
};
