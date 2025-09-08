import {
	type APIMessageTopLevelComponent,
	ButtonStyle,
	ComponentType,
	MessageFlags,
} from "discord-api-types/v10";
import { InformationChannel } from "discord-delivery";
import { FRIENDSHIP_ACTIONS_CHANNEL_ID } from "../utility/configuration.js";

const COMPONENTS_1_TEXT_DISPLAY_1 = `# Friendship actions

You can express yourself to others through GIFs through commands such as \`/hug\`, \`/high-five\`, \`/hair-tousle\`, etc.!
## Examples` as const;

const COMPONENTS_1_TEXT_DISPLAY_2 = `## Contributing

Love what you see? These were all created by our amazing community! You can contribute your own GIF too! Please ensure you follow these requirements:
- Recorded on a device with native screen recording (iOS, macOS, etc.) to ensure elements are not visible (or have the experimental setting enabled to hide the UI)
- Recorded in the highest definition mode possible
- Must be an aspect ratio of 1:1
- Must not exceed 512x512
- Must not exceed 5 MB
- Must not have noticeable compression

Once you've ensured your GIF meets the requirements, interact with the button below and let's get started! You may also choose to submit the raw video and we'll handle it for you!` as const;

const COMPONENTS_1: APIMessageTopLevelComponent[] = [
	{
		type: ComponentType.TextDisplay,
		content: COMPONENTS_1_TEXT_DISPLAY_1,
	},
	{
		type: ComponentType.MediaGallery,
		items: [
			{ media: { url: "https://cdn.thatskyapplication.com/hugs/36.gif" } },
			{ media: { url: "https://cdn.thatskyapplication.com/hair_tousles/3.gif" } },
		],
	},
	{
		type: ComponentType.MediaGallery,
		items: [
			{ media: { url: "https://cdn.thatskyapplication.com/high_fives/8.gif" } },
			{ media: { url: "https://cdn.thatskyapplication.com/play_fights/7.gif" } },
			{ media: { url: "https://cdn.thatskyapplication.com/krills/1.gif" } },
		],
	},
	{
		type: ComponentType.TextDisplay,
		content: COMPONENTS_1_TEXT_DISPLAY_2,
	},
	{
		type: ComponentType.ActionRow,
		components: [
			{
				type: ComponentType.Button,
				style: ButtonStyle.Primary,
				custom_id: "FRIENDSHIP_ACTIONS_CONTRIBUTE_BUTTON_CUSTOM_ID",
				label: "Contribute",
				emoji: { name: "🩵" },
			},
		],
	},
] as const;

export default new InformationChannel({
	id: FRIENDSHIP_ACTIONS_CHANNEL_ID,
	messages: [{ components: COMPONENTS_1, flags: MessageFlags.IsComponentsV2 }],
});
