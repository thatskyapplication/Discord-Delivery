import { Buffer } from "node:buffer";
import { writeFileSync } from "node:fs";
import process from "node:process";
import { URL } from "node:url";
import { API } from "@discordjs/core";
import type { RawFile } from "@discordjs/rest";
import { REST } from "@discordjs/rest";
import type { APIMessage, RESTPostAPIChannelMessageJSONBody, Snowflake } from "discord-api-types/v10";
import { MessageFlags } from "discord-api-types/v10";
import { fetch } from "undici";
import type { InformationChannelData } from "./setup.js";
import informationChannels from "./setup.js";
import { isBulkDeletable } from "./utility.js";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("Cannot locate a token.");
const { channels } = new API(new REST().setToken(token));

async function createMessage(
	channelId: Snowflake,
	options: RESTPostAPIChannelMessageJSONBody & { files: (RawFile | string)[] },
) {
	const { components, content, files } = options;
	const filesToSend = [];

	for (const file of files) {
		filesToSend.push({
			name: typeof file === "string" ? "image.png" : file.name,
			data: typeof file === "string" ? Buffer.from(await (await fetch(file)).arrayBuffer()) : file.data,
		});
	}

	return channels.createMessage(channelId, {
		allowed_mentions: { parse: [] },
		components,
		content,
		files: filesToSend,
		flags: MessageFlags.SuppressEmbeds,
		nonce: "markdown-delivery",
	});
}

async function deleteMessages(channelId: Snowflake, messageIds: Snowflake[]) {
	const bulkDeletableMessages = [];
	const nonBulkDeletableMessages = [];

	for (const messageId of messageIds) {
		if (isBulkDeletable(messageId)) {
			bulkDeletableMessages.push(messageId);
		} else {
			nonBulkDeletableMessages.push(messageId);
		}
	}

	if (bulkDeletableMessages.length >= 2) {
		await channels.bulkDeleteMessages(channelId, messageIds).catch(() => null);
	} else {
		nonBulkDeletableMessages.push(...bulkDeletableMessages);
	}

	await Promise.all(
		nonBulkDeletableMessages.map(async (messageId) => channels.deleteMessage(channelId, messageId).catch(() => null)),
	);
}

async function regenerate(data: InformationChannelData, fetchedMessages: (APIMessage | null)[] = []) {
	const _data = data;

	await deleteMessages(
		_data.channelId,
		_data.storedIds.filter((_, index) => fetchedMessages[index] !== null),
	);

	_data.storedIds = [];

	for (const parsedMessage of _data.parsedMessages) {
		const { id } = await createMessage(_data.channelId, parsedMessage);
		_data.storedIds.push(id);
	}
}

for (const data of informationChannels) {
	console.log(`Checking channel ${data.channelName}...`);

	if (data.storedIds.length === 0) {
		console.log(`${data.channelName} had no message ids. Immediately regenerating.`);
		await regenerate(data);
		continue;
	}

	let No = 0;
	let regenerated = false;
	const fetchedMessages: (APIMessage | null)[] = [];

	for (const messageId of data.storedIds) {
		console.log(`Fetching message id ${messageId}...`);
		const fetchedMessage = await channels.getMessage(data.channelId, messageId).catch(() => null);

		// Push in the fetched message.
		fetchedMessages.push(fetchedMessage);

		// Detect if there is a message that cannot be fetched.
		if (fetchedMessage === null) {
			console.log(`The message id could not be fetched. Regenerating...`);
			await regenerate(data, fetchedMessages);
			regenerated = true;
			break;
		}

		// Detect if there is a change between the local file and the existing content.
		if (data.parsedMessages[No++]?.content !== fetchedMessage.content) {
			console.log(`The message id is different to local data. Regenerating...`);
			await regenerate(data, fetchedMessages);
			regenerated = true;
			break;
		}

		console.log("No change detected for the message id. Continuing...");
	}

	if (!regenerated) {
		if (data.parsedMessages[No] === undefined) {
			console.log(`No changes detected for channel ${data.channelName}. Continuing...`);
		} else {
			// An addition exists locally.
			console.log(`Detected additional local data. Regenerating...`);
			await regenerate(data, fetchedMessages);
		}
	}

	console.log("- - - - - - - - - - - - - - -");
}

writeFileSync(
	new URL("../source/storedIds.json", import.meta.url),
	JSON.stringify(
		Object.fromEntries(informationChannels.map(({ channelName, storedIds }) => [channelName, storedIds])),
		null,
		2,
	),
);
