const yts = require("yt-search");
const getVideoId = require("../utilities/getVideoId");

module.exports = async function getVideoInfo(url) {
	let video_id = getVideoId(url);
	const video = await yts({
		videoId: video_id,
	});
	return video;
};
