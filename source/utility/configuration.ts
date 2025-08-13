import process from "node:process";

// Environment variables.
if (
	!(
		process.env.DISCORD_TOKEN &&
		process.env.FORCE &&
		process.env.WELCOME_CHANNEL_ID &&
		process.env.RULES_CHANNEL_ID &&
		process.env.DAILIES_GUIDE_CHANNEL_ID &&
		process.env.HOW_TO_TRANSLATE_CHANNEL_ID
	)
) {
	throw new Error("Missing environment variables.");
}

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const FORCE = process.env.FORCE === "true";
export const WELCOME_CHANNEL_ID = process.env.WELCOME_CHANNEL_ID;
export const RULES_CHANNEL_ID = process.env.RULES_CHANNEL_ID;
export const DAILIES_GUIDE_CHANNEL_ID = process.env.DAILIES_GUIDE_CHANNEL_ID;
export const HOW_TO_TRANSLATE_CHANNEL_ID = process.env.HOW_TO_TRANSLATE_CHANNEL_ID;
