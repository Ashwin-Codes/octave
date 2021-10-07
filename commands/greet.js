const replies = ["Hello", "Supp", "YOO MANNN", "Ola", "Namaste"];

module.exports = function (msg, tokens) {
	const randomNumber = Math.floor(Math.random() * replies.length);
	msg.channel.send(replies[randomNumber]);
};
