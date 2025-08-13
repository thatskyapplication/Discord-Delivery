import { InformationChannel } from "discord-delivery";
import { HOW_TO_TRANSLATE_CHANNEL_ID } from "../utility/constants.js";

const CONTENT_1 = `# How to translate

Hello all translators! <:bow:1313931609732419654> If you are willing to help translate <@982740693070012506>, you're off to a good start by being here!
## Crowdin

Crowdin is where you can help translate <@982740693070012506> into your own language.

https://thatskyapplication.crowdin.com is where the magic happens. This is also where you can view a list of supported languages, which is defined by the languages both Discord and Sky support.

You need to sign up to start translating. Then, simply translate away!
## Translator role

There is no way to identify which Crowdin user belongs to which Discord account. <@&1389531773905539073> serves that purpose and lets others know you help translate.

To obtain the role, visit https://thatskyapplication.com/discord-crowdin to begin the process. Once successful, you'll have the role!
## Help

Need help? Ask around in <#1389597535164698789>, the communication channel for translators. We'd be happy to lend you a helping hand!` as const;

export default new InformationChannel({
	id: HOW_TO_TRANSLATE_CHANNEL_ID,
	messages: [{ content: CONTENT_1 }],
});
