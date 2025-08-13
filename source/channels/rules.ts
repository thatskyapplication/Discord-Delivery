import { InformationChannel } from "discord-delivery";
import { RULES_CHANNEL_ID } from "../utility/configuration.js";

const CONTENT_1 = `# Rules

On top of abiding by [thatgamecompany's EULA & ToS](https://thatgamecompany.helpshift.com/hc/en/17/faq/460), you must:
1. Keep communication in English.
2. Be civil, kind, and respectful.
3. Not send any NSFW content.
4. Not perform any self-promotion.
5. Not initiate or participate in any trades regarding IAPs, hearts, etc.

This list is not exhaustive.
## Support

Should there be a case where someone is not abiding by these rules, create a private thread and mention the <@&1261199790759481438> role.` as const;

export default new InformationChannel({ id: RULES_CHANNEL_ID, messages: [{ content: CONTENT_1 }] });
