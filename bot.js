// Bot Configuration

const Discord = require("discord.js");
const client = new Discord.Client();

require("dotenv").config();
client.login(process.env.BOTTOKEN);

function readyDiscord() {
	console.log("Bot Online");
	client.user.setActivity(".help", { type: "LISTENING" });
}
client.on("ready", readyDiscord);

const commandHandler = require("./commands");
client.on("message", commandHandler);
