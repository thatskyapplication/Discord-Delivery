import { InformationChannel } from "../models/information-channel.js";
import { WELCOME_CHANNEL_ID } from "../utility/constants.js";

const CONTENT_1 = `# Caelus

Welcome to the <@982740693070012506> support server!
## Information

This is the place to be for anything Caelus. Check out these channels to see what you can do:
- Keep updated by reading <#1092932721812193330>!
- Need some help with <@982740693070012506>? Head on over to <#1113528928427049050>!
- Did something go wrong? Maybe you saw an error? Perhaps even <@982740693070012506> raided your fridge? You can let us know over in <#1113529092113965106>!
- Share any feedback you have in <#1080528991028523059>! We'd love to hear!
- Daily guides are sent in <#1071076627037044766>!

On top of all of that, check out <id:customize> to customise your experience!
## Links

Here are some useful links:
🔗 **Website**: https://thatskyapplication.com
🔗 **Invite**: https://discord.com/oauth2/authorize?client_id=982740693070012506
🔗 **Support**: https://thatskyapplication.com/support` as const;

export default new InformationChannel(WELCOME_CHANNEL_ID, [{ content: CONTENT_1 }]);
