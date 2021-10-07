module.exports = function getVideoId(url) {
	if (url.length == 43) {
		return url.substr(32);
	} else if (url.length == 39) {
		return url.substr(28);
	} else if (url.length == 28) {
		return url.substr(17);
	}
};
