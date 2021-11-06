const fs = require("fs");
const ytdl = require("ytdl-core");
// TypeScript: import ytdl from 'ytdl-core'; with --esModuleInterop
// TypeScript: import * as ytdl from 'ytdl-core'; with --allowSyntheticDefaultImports
// TypeScript: import ytdl = require('ytdl-core'); with neither of the above

// ytdl("http://www.youtube.com/watch?v=aqz-KE-bpKQ").pipe(
// 	fs.createWriteStream("video.mp4")
// );
const videoID = "https://youtu.be/h6osNS72sG8";

const getID = async (id) => {
	let info = await ytdl.getInfo(videoID, { downloadURL: true });
	let data = JSON.stringify(info, null, 2);
	let number = parseInt(Math.random() * 100);
	await fs.writeFile(`ytdata-${number}.json`, data, (err) => {
		if (err) throw err;
		console.log(`Data written to file ytdata-${number}.json`);
	});
	let format = ytdl.chooseFormat(info.formats, { quality: "134" });
	console.log("Format found!", format);
};

getID(videoID);
