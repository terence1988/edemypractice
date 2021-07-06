declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			PORT?: string;
			JWT_SECRET: string;
		}
	}
}
export {};
///still having issue, where was it imported
