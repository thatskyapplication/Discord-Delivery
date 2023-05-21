import { type Snowflake, FormattingPatterns, ButtonStyle } from "discord-api-types/v10";

function timestampFromSnowflake(snowflake: Snowflake) {
	return Number(BigInt(snowflake) >> 22n) + 1_420_070_400_000;
}

export function isBulkDeletable(messageId: Snowflake) {
	return Date.now() - timestampFromSnowflake(messageId) < 1_209_600_000;
}

export function parseEmoji(text: string) {
	if (!text.includes(":")) return { animated: false, name: text, id: undefined };
	const match = FormattingPatterns.Emoji.exec(text);
	if (!match?.groups) return undefined;
	const { animated, name, id } = match.groups;
	return { animated: Boolean(animated), name, id };
}

export function parseRawButtonStyle(style: `${ButtonStyle}`) {
	switch (style) {
		case "1":
			return ButtonStyle.Primary;
		case "2":
			return ButtonStyle.Secondary;
		case "3":
			return ButtonStyle.Success;
		case "4":
			return ButtonStyle.Danger;
		case "5":
			return ButtonStyle.Link;
	}
}
