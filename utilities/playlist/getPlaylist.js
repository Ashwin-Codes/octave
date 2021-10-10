const axios = require("axios");
require("dotenv").config();

module.exports = async function (msg) {
	const url = process.env.FIREBASEDBURL;
	let data = await axios(url + "/playlist/" + `${msg.author.id}.json`).then((data) => {
		return data.data;
	});
	return data;
};
