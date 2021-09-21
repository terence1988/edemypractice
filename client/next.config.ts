// export {};
// module.exports = {
// 	async rewrites() {
// 		return [
// 			{
// 				source: "/api/:path*",
// 				destination: "http://localhost:8000/api/:path*",
// 			},
// 		];
// 	},
// };

//This works but as Next uses both FE/BE, on the same link, it can only tell the addr based on url so the url for FE/BE must be seperated

//The next.config.js file must be a JavaScript file as it does not get parsed by Babel or TypeScript,
//however you can add some type checking in your IDE using JSDoc as below:

// // @ts-check

// /**
//  * @type {import('next').NextConfig}
//  **/
//  const nextConfig = {
// 	/* config options here */
//   }

//   module.exports = nextConfig
