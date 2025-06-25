import type { APIMessageTopLevelComponent, MessageFlags } from "@discordjs/core";
import messageIds from "../message-ids.json" with { type: "json" };

interface InformationMessageFiles {
	name: string;
	url: `https://${string}`;
}

interface InformationMessage {
	components?: APIMessageTopLevelComponent[];
	content?: string;
	files?: readonly InformationMessageFiles[];
	flags?: MessageFlags.IsComponentsV2;
}

export class InformationChannel {
	public readonly channelId: keyof typeof messageIds;
	public readonly messages: readonly InformationMessage[];

	public constructor(channelId: keyof typeof messageIds, messages: readonly InformationMessage[]) {
		this.channelId = channelId;
		this.messages = messages;
	}
}
