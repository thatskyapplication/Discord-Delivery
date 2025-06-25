import process from "node:process";

// Environment variables.
if (!(process.env.DISCORD_TOKEN && process.env.FORCE)) {
	throw new Error("Missing environment variables.");
}

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const FORCE = process.env.FORCE === "true";
