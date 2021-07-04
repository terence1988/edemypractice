import express from "express";
import next from "next";
import { createProxyMiddleware } from "http-proxy-middleware";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app
	.prepare()
	.then(() => {
		const server = express();
		if (dev) {
			server.use(
				"/",
				createProxyMiddleware({ target: "http://localhost:8000", changeOrigin: true })
			);
		}
		server.all("*", (req, res) => {
			return handler(req, res);
		});
		server
			.listen(3000, () => {
				console.log("client-server-proxy is running");
			})
			.on("error", (err) => {
				throw err;
			});
	})
	.catch((err) => {
		console.error(err);
	});
