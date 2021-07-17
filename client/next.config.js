module.exports = {
	async rewrites() {
		return [
			{
				source: "/:path*",
				destination: "http://localhost:8000/api/:path*", // Proxy to Backend
			},
		];
	},
};
