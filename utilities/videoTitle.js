const getVideoInfo = require("../utilities/getVideoInfo");

module.exports = async function (url, cb, msg) {
	let videoInfo = await getVideoInfo(url);
	console.log("Yo");
	cb(msg, `Song Added ${videoInfo.title}`);
};
