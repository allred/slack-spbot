const botkit = require('botkit')

var controller = botkit.slackbot({
  //debug: false,
  //log: false
  stats_optout: true
})

controller.spawn({
  token: process.env.TOKEN_SLACK_BOT
}).startRTM()

controller.hears('hello', ['direct_message'], function(bot, message) {
  bot.reply(message, 'howdy')
})
