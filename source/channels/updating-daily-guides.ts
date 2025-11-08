import { InformationChannel } from "discord-delivery";
import { UPDATING_DAILY_GUIDES_CHANNEL_ID } from "../utility/configuration.js";

const CONTENT_1 = `# Updating daily guides

Thank you for expressing interest for updating the daily guides! This will tell you how to do just that.
## Process
Simply log in to Sky to check the quests and then update them with <@982740693070012506> via \`/daily-guides set\`.

There is also the travelling rock that appears around Aviary Village! Feel free to upload an image of its location!

Once you use the command, <https://thatskyapplication.com/daily-guides> will _immediately_ update, so be sure you're doing it correctly! However, daily guides on Discord will _not_ immediately update. Use the "Distribute" button if everything seems good. You'll know if it'll work because you'll see it updated in <#1071076627037044766>.

Miscellaneous utilities include reordering daily quests in case you mix them up and viewing daily guides in a locale just to be sure localisation works (you will probably never need to use that).
## Quirks
Everything else is automated, but there are some quirks:
- If there is a new daily quest, <@982740693070012506> needs to be updated to include it
  - Feel free to do the rest of the daily quests
- At the start of the month, the treasure candles rotation may change. If you want to, check the first treasure candle's location. If it matches with the daily guides, it's all good
- The seasonal candles' rotation may change. If you want to, you can double-check the first cluster matches with the daily guides, akin to the aforementioned treasure candles quirk

Let a <@&1261199790759481438> know if something needs updating as it requires a code change. You could also do it yourself if you know how to!
## Activity

<#1131896865378549832> exists to log modifications of the daily guides. This is to:
- Help minimise abuse through transparency
- Ensure an audit trail is left for a possible unforeseeable scenario` as const;

export default new InformationChannel({
	id: UPDATING_DAILY_GUIDES_CHANNEL_ID,
	messages: [{ content: CONTENT_1 }],
});
