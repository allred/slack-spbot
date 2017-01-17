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
  'C0KMSM430', //general sp
]
if (process.env.NODE_ENV === 'dev') {
  channels_valid.push('C3S2XJA1L') // test-bot sp
  channels_valid.push('C3SB2FN2G') // test-bot gl1
}

spbot = controller.spawn({
  token: process.env.TOKEN_SPBOT
})
spbot.startRTM()

// get list of users

var members = [] 
spbot.api.users.list({}, function(err, response) {
  members = response.members
  console.log(members)
})

// purpose: determine if a reaction was added/removed, save the message

function reactionSave(bot, message) {
  if (message['type'] === 'reaction_added' || message['type'] === 'reaction_removed') {
    if (!_.includes(channels_valid, message['item']['channel'])) {
      return
    }
    console.log(message)
    console.log(message.user + " -> " + message.item_user + " " + message.type + " "  + message.reaction)
    controller.storage.teams.save({id: message.team, message: message})
  }
}

function reactionStat(bot, message) {
  controller.storage.teams.all(function(err, all_team_data) {
    bot.startConversation(message, function(err, convo) {
      convo.say('data: ' + JSON.stringify(all_team_data))
    })
  })
}

controller.on('message_received', function(bot, message) {
  reactionSave(bot, message)
})

controller.hears(['stat'], ['direct_message'], function(bot, message) {
  reactionStat(bot, message)
})

controller.hears(['hello', 'version'], ['direct_message'], function(bot, message) {
  bot.reply(message, JSON.stringify(bot.identifyBot()) + " " + process.env.npm_package_homepage + " v" + process.env.npm_package_version)
  //bot.reply(message, JSON.stringify(process.env))
})

controller.hears(['die', 'exit'], ['direct_message'], function(bot, message) {
  bot.reply(message, 'adios muchacho')
  console.log('exit requested')
  spbot.destroy(bot)
})
