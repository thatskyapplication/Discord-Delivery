import { writeFile } from "node:fs/promises";
import {
	API,
	MessageFlags,
	type RESTGetAPIChannelMessagesResult,
	type Snowflake,
} from "@discordjs/core";
import { REST } from "@discordjs/rest";
import { request } from "undici";
import rules from "./channels/rules.js";
import welcome from "./channels/welcome.js";
import messageIds from "./message-ids.json" with { type: "json" };
import type { InformationChannel } from "./models/information-channel.js";
import { DISCORD_TOKEN, FORCE } from "./utility/configuration.js";
import { isBulkDeletable } from "./utility/functions.js";

const api = new API(new REST({ version: "10" }).setToken(DISCORD_TOKEN));
const messageIdsCurrent = JSON.parse(JSON.stringify(messageIds, null, 2)) as typeof messageIds;

async function regenerate(
	channel: InformationChannel,
	messages: RESTGetAPIChannelMessagesResult,
): Promise<Snowflake[]> {
	// Delete existing messages.
	const bulkDeletableMessages: Snowflake[] = [];
	const nonBulkDeletableMessages: Snowflake[] = [];

	for (const { id } of messages) {
		if (isBulkDeletable(id)) {
			bulkDeletableMessages.push(id);
		} else {
			nonBulkDeletableMessages.push(id);
		}
	}

	if (bulkDeletableMessages.length >= 2) {
		try {
			await api.channels.bulkDeleteMessages(channel.channelId, bulkDeletableMessages);
		} catch (error) {
			console.error(
				`Failed to bulk delete messages for channel id ${channel.channelId}. Pushing to non-bulk deletable messages.`,
			);

			console.error(error);
			nonBulkDeletableMessages.push(...bulkDeletableMessages);
		}
	} else {
		nonBulkDeletableMessages.push(...bulkDeletableMessages);
	}

	for (const messageId of nonBulkDeletableMessages) {
		try {
			await api.channels.deleteMessage(channel.channelId, messageId);
		} catch (error) {
			console.error(`Failed to delete message id ${messageId} in channel id ${channel.channelId}.`);
			console.error(error);
		}
	}

	// Regenerate messages.
	const messageIds: Snowflake[] = [];

	for (const message of channel.messages) {
		try {
			let flags = MessageFlags.SuppressEmbeds;

			if (message.flags) {
				flags |= message.flags;
			}

			const { id: messageId } = await api.channels.createMessage(channel.channelId, {
				...message,
				allowed_mentions: { parse: [] },
				files: await Promise.all(
					message.files?.map(async (file) => ({
						name: file.name,
						data: new Uint8Array(await (await request(file.url)).body.arrayBuffer()),
					})) ?? [],
				),
				flags,
			});

			messageIds.push(messageId);
		} catch (error) {
			console.error(`Failed to create message in channel id ${channel.channelId}.`);
			console.error(error);
		}
	}

	return messageIds;
}

iteration: for (const channel of [rules, welcome]) {
	console.info(`Checking channel id ${channel.channelId}`);

	let messages: RESTGetAPIChannelMessagesResult;

	try {
		messages = await api.channels.getMessages(channel.channelId, { limit: 100 });
	} catch (error) {
		console.error("Failed to fetch messages.");
		console.error(error);
		continue;
	}

	// If there is a length of exactly 100, there is a problem. There should not be so many messages.
	if (messages.length === 100) {
		console.error("100 messages fetched. This is not expected. Continuing...");
		continue;
	}

	if (FORCE) {
		console.info("Forcing regeneration...");
		const newMessageIds = await regenerate(channel, messages);
		messageIdsCurrent[channel.channelId] = newMessageIds;
		continue;
	}

	// Detect a difference in length.
	if (messages.length !== channel.messages.length) {
		console.info("Detected a difference in the amount of messages. Regenerating...");
		const newMessageIds = await regenerate(channel, messages);
		messageIdsCurrent[channel.channelId] = newMessageIds;
		continue;
	}

	// Iterate over the messages and check for any differences.
	for (const [index, message] of messages.reverse().entries()) {
		const localMessage = channel.messages[index];

		if (message.content === "" && !localMessage?.content) {
			// There is no content to compare. Continue for now.
			continue;
		}

		if (message.content !== localMessage?.content) {
			console.info(`Detected a difference in message content for ${message.id}. Regenerating...`);
			console.info(`Old: ${message.content}`);
			console.info(`New: ${localMessage?.content}`);
			const newMessageIds = await regenerate(channel, messages);
			messageIdsCurrent[channel.channelId] = newMessageIds;
			continue iteration;
		}
	}

	console.info("No changes found. Continuing...");
}

// Write the new message ids to the file.
await writeFile(
	// Need to double-check the source folder because of the distribution folder.
	new URL("../source/message-ids.json", import.meta.url),
	JSON.stringify(messageIdsCurrent, null, "\t"),
	{ encoding: "utf8" },
);
