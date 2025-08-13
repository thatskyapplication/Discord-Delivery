import { InformationChannel } from "discord-delivery";
import { WELCOME_CHANNEL_ID } from "../utility/configuration.js";

const CONTENT_1 = `# Caelus

Welcome to the <@982740693070012506> support server! This is the place for anything Caelus.
## General

- Keep updated by reading <#1092932721812193330>!
- Need some help with <@982740693070012506>? Did something go wrong? Head on over to <#1113528928427049050>!
- Share any feedback you have in <#1080528991028523059>! We'd love to hear!
- Daily guides are sent in <#1071076627037044766>!

On top of all of that, check out <id:customize> to customise your experience!
## Helping out

You can definitely help out! Please see the Helping category below to see just how you can do this. 🩵
## Links

Here are some useful links:
🔗 **Website**: https://thatskyapplication.com
🔗 **Invite**: https://discord.com/oauth2/authorize?client_id=982740693070012506
🔗 **Support**: https://thatskyapplication.com/support` as const;

export default new InformationChannel({
	id: WELCOME_CHANNEL_ID,
	messages: [{ content: CONTENT_1 }],
});
