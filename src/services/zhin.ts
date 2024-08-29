import { CronJob } from "cron";
import * as dotenv from "dotenv";
import axios from "axios";
import { bot, botStatusMsgId } from "../transport/telegram";
dotenv.config();
let healthy: boolean = false;

export const job = new CronJob(
  process.env.CRON_PERIOD!,
  async function () {
    try {
      if (!!botStatusMsgId == true) {
        const time = new Date().toUTCString();
        console.log(time);

        await bot.telegram.editMessageText(
          process.env.TG_CHANNEL_ID!,
          botStatusMsgId,
          undefined,
          `bot is up ${time}`
        );
      }
      const rs = await axios.get(process.env.HEALTH_ENDPOINT!);
      if (!healthy && rs.status >= 200 && rs.status < 300) {
        await bot.telegram.sendMessage(
          process.env.TG_CHANNEL_ID!,
          "Backend Server Status : ✅"
        );
        healthy = true;
      }
    } catch (e) {
      await bot.telegram
        .sendMessage(process.env.TG_CHANNEL_ID!, "Backend Server Status : ❌")
        .catch();
      healthy = false;
      console.log(e);
    }
  },
  null, // onComplete
  true, // start
  "Asia/Tehran" // timeZone
);
