const greet = require("./commands/greet");
const gif = require("./commands/gif");
const voice = require("./commands/voice");
const playlist = require("./commands/playlist");
const help = require("./commands/help");

const commands = {
	greet: greet,
	gif: gif,
	music: voice,
	playlist: playlist,
	help: help,
};

module.exports = async function (msg) {
	let tokens = msg.content.split(" ").filter((ele) => {
		if (!ele == " " || !ele == /\n/) {
			return ele;
		}
	});

	let command = tokens.shift();
	if (command) {
		if (command.charAt(0) === ".") {
			command = command.substring(1); //removing dot (.)
			commands[command](msg, tokens);
		}
	}
};
