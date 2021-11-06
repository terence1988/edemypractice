const a = [
	"https://www.bilibili.com/video/BV1Nu411Z7Tz?share_source=copy_web",
	"https://www.bilibili.com/video/av83829164",
	"https://www.bilibili.com/video/BV1qJ411E7dy",
	"https://www.youtube.com/watch?v=byc0zrVPlI8",
];

const getVideoBVID = (url: string): any => {
	if (!url) return "";
	if (!url.match(/^.*(bilibili.com)/g)) {
		console.log("WRRRRRRROOOOONNNGGG");
		return "";
	}
	const [youtubeOriginorId, some, videoId] = url
		.replace(/\?.*/g, "")
		.split(/(\/video\/)/g);
	console.log(youtubeOriginorId, "=======", some, "=========", videoId);
};

for (const item of a) getVideoBVID(item);
