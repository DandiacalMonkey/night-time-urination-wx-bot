import BotMessageSender from "./scripts/BotMessageSender";
import * as BotMessage from "./scripts/BotMessage";
import * as fs from "fs";

const botMessage: BotMessage.BotMessage = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
new BotMessageSender().sendMessageSchedule('https://qyapi.weixin.qq.com/cgi-bin/webhook/send', botMessage);