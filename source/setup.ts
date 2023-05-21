/* eslint-disable prefer-named-capture-group */
import { readFileSync } from "node:fs";
import { URL } from "node:url";
import type { RawFile } from "@discordjs/rest";
import {
	type APIActionRowComponent,
	type RESTPostAPIChannelMessageJSONBody,
	type Snowflake,
	type APIButtonComponent,
	ButtonStyle,
	ComponentType,
} from "discord-api-types/v10";
import { channels, users } from "./constants.js";
import storedIds from "./storedIds.json" assert { type: "json" };
import { parseEmoji, parseRawButtonStyle } from "./utility.js";

export interface InformationChannelFile extends Omit<RawFile, "data"> {
	url: string;
}

export class InformationChannelData {
	public readonly channelName: keyof typeof storedIds;

	public readonly channelId: Snowflake;

	public readonly parsedMessages: (RESTPostAPIChannelMessageJSONBody & { files: InformationChannelFile[] })[] = [];

	public storedIds: Snowflake[];

	public constructor(channelName: keyof typeof storedIds) {
		this.channelName = channelName;
		this.channelId = channels[channelName];

		// Parse the contents.
		const contents = readFileSync(new URL(`../Channels/${channelName}.md`, import.meta.url), "utf8")
			.split(/^(# .+)/m)
			.map((content) => content.trim());

		// The first iteration is always an empty string.
		contents.shift();

		// Move the message content alongside headings.
		const parsedContents = contents
			.slice(0, contents.length - (contents.length % 2))
			.reduce<string[]>((result, _, index) => {
				if (index % 2 === 0) result.push(`${contents[index]!}\n\n${contents[index + 1]!}`);
				return result;
			}, []);

		for (let message of parsedContents) {
			const components: RESTPostAPIChannelMessageJSONBody["components"] = [];
			const files: InformationChannelFile[] = [];

			message = message
				.replaceAll(/ {2}$/gm, "")
				.replaceAll(/\[channel\|([\w- ]+)]/g, (_, channel: keyof typeof channels) => `<#${channels[channel]}>`)
				// .replaceAll(
				// 	/\[command\|([\w- ]+)]/g,
				// 	(_, command: keyof typeof commands) => `</${command}:${commands[command]}>`,
				// )
				// .replaceAll(
				// 	/\[emoji\|(a:)?(\w+)]/g,
				// 	(_, animated: "a:" | undefined, emoji: keyof typeof emojis) =>
				// 		`<${animated ? `${animated}${emoji}` : `:${emoji}`}:${emojis[emoji]}>`,
				// )
				// .replaceAll(/\[(role|roleid)\|([\w ()-]+)]/g, (_, type: "role" | "roleid", role: keyof typeof roles) =>
				// 	type === "role" ? `<@&${roles[role]}>` : roles[role],
				// )
				.replaceAll(/\[user\|(\w+)]/g, (_, user: keyof typeof users) => `<@${users[user]}>`)
				.replaceAll(/!\[(.+)]\((.+)\)/g, (_, name: string, url: string) => {
					files.push({ url, name: `${name}${url.slice(url.lastIndexOf("."))}` });
					return "";
				})
				.replaceAll(
					/\[row([1-5])\|\[(button)\|(.{1,100})\|(true|false)\|(.+)\|(.+)\|([1-5])\|(.+)]]/g,
					(
						_,
						rowNo: "1" | "2" | "3" | "4" | "5",
						_type: "button",
						customId: string,
						disabled: `${boolean}`,
						emoji: string,
						label: string,
						rawStyle: `${ButtonStyle}`,
						url: string,
					) => {
						const rowIndex = (Number(rowNo) - 1) as 0 | 1 | 2 | 3 | 4;
						const subcomponents = components[rowIndex];

						const actionRow =
							subcomponents === undefined
								? ({
										type: ComponentType.ActionRow,
										components: [],
								  } as APIActionRowComponent<APIButtonComponent>)
								: subcomponents;

						let button: APIButtonComponent;
						const style = parseRawButtonStyle(rawStyle);

						if (style === ButtonStyle.Link) {
							button = {
								type: ComponentType.Button,
								label,
								style,
								emoji: emoji === "null" ? undefined : parseEmoji(emoji),
								disabled: disabled === "true",
								url,
							};
						} else {
							button = {
								type: ComponentType.Button,
								custom_id: customId,
								label,
								style,
								emoji: emoji === "null" ? undefined : parseEmoji(emoji),
								disabled: disabled === "true",
							};
						}

						actionRow.components.push(button);
						if (subcomponents === undefined) components.push(actionRow);
						return "";
					},
				);

			this.parsedMessages.push({ content: message.trim(), components, files });
		}

		this.storedIds = storedIds[channelName];
	}
}

export default [new InformationChannelData("welcome"), new InformationChannelData("rules")];
