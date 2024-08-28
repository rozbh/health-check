import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";
dotenv.config();
let botStatusMsgId: number;
const bot = new Telegraf(process.env.TG_BOT_TOKEN!);
// Enable graceful stop
const time = new Date().toUTCString();
bot.telegram
  .sendMessage(process.env.TG_CHANNEL_ID!, `bot is up ${time}`)
  .then(async (data) => {
    botStatusMsgId = data.message_id;
    await bot.telegram.pinChatMessage(
      process.env.TG_CHANNEL_ID!,
      Number(botStatusMsgId),
      { disable_notification: false }
    );
  });

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
export { bot, botStatusMsgId };
