const getVideoInfo = require("./getVideoInfo");

module.exports = async function linkToTitle(text, cb, msg, title = "") {
	let arr = [];
	let textArray = text.split("\n").filter((ele) => {
		if (!ele == " ") {
			return ele;
		}
	});
	if (textArray.length == 0) {
		console.log(arr);
		return;
	}
	for (ele of textArray) {
		let videoInfo = await getVideoInfo(ele);
		arr.push(videoInfo.title);

		if (arr.length == textArray.length) {
			let msgText = title;
			let index = 0;
			arr.forEach((ele) => {
				index++;
				msgText = msgText.concat(`${index}) ${ele}\n`);
			});
			cb(msg, msgText);
			return arr;
		}
	}
};
