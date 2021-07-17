declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: "development" | "production";
			NEXT_PUBLIC_API: string;
			NEXT_PUBLIC_STRIPE_KEY: string;
		}
	}
}
export {};
///having issue after a few restarts, imported automatically -- Final
