// to run this bot:
// NODE_ENV=test TOKEN_SPBOT=sometoken npm start

const botkit = require('botkit')
const reverse = require('reverse-string')
const _ = require('lodash')

var controller = botkit.slackbot({
  //debug: false,
  //log: 7,
  json_file_store: '/var/tmp/slack-spbot',
  stats_optout: true
})

var channels_valid = [
  'C0KMSM430', //general
]
if (process.env.NODE_ENV === 'dev') {
  channels_valid.push('C3S2XJA1L') //test-bot
}


var reactions_logged = _.map([
  'tsicar',
], reverse)

controller.spawn({
  token: process.env.TOKEN_SPBOT
}).startRTM()

function reactionStat(bot, message) {
  if (message['type'] === 'reaction_added') {
    if (!_.includes(channels_valid, message['item']['channel'])) {
      return
    }
    if (_.includes(reactions_logged, message['reaction'])) {
      console.log(message)
      console.log(message['reaction'] + " " + message['item_user'])
      //console.log(reverse('foobar'))
    }
  }
}

controller.on('message_received', function(bot, message) {
  reactionStat(bot, message)
})

controller.hears(['hello', 'version'], ['direct_message'], function(bot, message) {
  bot.reply(message, 'spbot ' + process.env.npm_package_version)
})
