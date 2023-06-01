require('dotenv').config()
const TeleBot = require('telebot');
const bot = new TeleBot(process.env.TOKEN);

bot.on('/everyone', (msg) => msg.reply.text("@Dihsarr @benoji @paytoncollins @involutex @neeguss @Cranbaeri @puffpuff26 @Jayvid12 @mobu2 @p4rs33 @DimSum9000 @Yahootoyou @omegadeecee"));

bot.start();