declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			PORT?: string;
			JWT_SECRET: string;
			AWS_ACCESS_KEY_ID: string;
			AWS_SECRET_ACCESS_KEY: string;
			AWS_REGION: string;
			AWS_API_VERSION: string;
			EMAIL_FROM: string;
			STRIPE_SECRET: string;
			STRIPE_REDIRECT_URL: string;
		}
	}
}
export {};
///having issue after a few restarts, imported automatically -- Final
