module.exports = function message(msgObj, msgText) {
	msgObj.channel.send({
		embed: {
			color: 3447003,
			description: msgText,
		},
	});
};
