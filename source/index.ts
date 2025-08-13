import { writeFile } from "node:fs/promises";
import { DiscordDelivery } from "discord-delivery";
import dailiesGuide from "./channels/dailies-guide.js";
import howToTranslate from "./channels/how-to-translate.js";
import rules from "./channels/rules.js";
import welcome from "./channels/welcome.js";
import messageIds from "./message-ids.json" with { type: "json" };
import { DISCORD_TOKEN, FORCE } from "./utility/configuration.js";

const discordDelivery = new DiscordDelivery({
	data: messageIds,
	informationChannels: [welcome, rules, dailiesGuide, howToTranslate],
	token: DISCORD_TOKEN,
	force: FORCE,
});

const updatedMessageIds = await discordDelivery.start();

// Write the new message ids to the file.
await writeFile(
	// Need to double-check the source folder because of the distribution folder.
	new URL("../source/message-ids.json", import.meta.url),
	JSON.stringify(updatedMessageIds, null, "\t"),
	{ encoding: "utf8" },
);
