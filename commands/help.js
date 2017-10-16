module.exports = {
  command:"help",
  execute:async function(bot, msg, args){
    await msg.channel.createMessage(`Want to know how to use the Translate Bot? View the helppage here! <https://discordbots.org/bot/translate> | **If you like Translate, please consider making a pledge on our Patreon, every little bit helps pay for the costs to keep Translate online** <https://www.patreon.com/TannerReynolds>`);
  }
}
