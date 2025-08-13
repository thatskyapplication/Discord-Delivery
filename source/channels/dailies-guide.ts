import { InformationChannel } from "discord-delivery";
import { DAILIES_GUIDE_CHANNEL_ID } from "../utility/constants.js";

const CONTENT_1 = `# Dailies guide

Thank you for expressing interest for updating the daily guides! This will tell you how to do just that.
## Quests
Simply log into Sky to check the dailies and then update them with <@982740693070012506> via \`/daily-guides set\`. Checking daily quests in Aviary Village is slower than the traditional Home, but that's up to you.

Once you use the command, <https://thatskyapplication.com/daily-guides> will _immediately_ update, so be sure you're doing it correctly! However, daily guides on Discord will _not_ immediately update. Use the "Distribute" button if everything seems good. You'll know if it'll work because you'll see it updated in <#1071076627037044766>.

Miscellaneous utilities include reordering daily quests in case you mix them up and viewing daily guides in a locale just to be sure localisation works (you will probably never need to use that).
## Travelling rock

You may notice the travelling rock! The rock that appears around Aviary Village is also part of the daily guides, but this has pretty much never been done as it is viewed as unavailing. If you want, feel free to upload an image of where it is!
## Everything else
Everything else is automated, but there are some quirks.

At the start of the month, the treasure candles rotation may change. If you really want to, check the first treasure candle's location, which should take about 10 seconds. If it matches with the daily guides, it's all good.

Seasonal candles may change too. If you really want to, you can double-check the first placement is also good, akin to the aforementioned treasure candles quirk.

If something is wrong, let a <@&1261199790759481438> know as it will need to be changed in the code. You could also do it yourself if you know how to!
## Activity

<#1131896865378549832> exists to log modifications of the daily guides. This is to:
- Help minimise abuse through transparency
- Ensure an audit trail is left for a possible unforeseeable scenario` as const;

export default new InformationChannel({
	id: DAILIES_GUIDE_CHANNEL_ID,
	messages: [{ content: CONTENT_1 }],
});
