//TENOR API KEY MUST BE ADDED BEFORE USING THIS COMMAND.
//ERROR CATCHES ARE NOT MADE ON FETCH. DEVELOPERS CAN ADD THEIR OWN IF REQUIRED.

const fetch = require("node-fetch");
const message = require("../utilities/message");

module.exports = async function (msg, tokens) {
	let keyword = "JavaScript"; //fallback keyword if none passed by user.
	if (tokens.length > 0) {
		keyword = tokens.join(" ");
	}
	const url = `https://g.tenor.com/v1/search?q=${keyword}&key=${process.env.TENORKEY}`;
	const response = await fetch(url);
	const gifs = await response.json();
	if (gifs.results == 0 || gifs.results == undefined || gifs.results == null) {
		message(msg, "No Gifs Found..");
	} else {
		const randomNumber = Math.floor(Math.random() * gifs.results.length);
		msg.channel.send(gifs.results[randomNumber].url);
	}
};
