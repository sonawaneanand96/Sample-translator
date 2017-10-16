module.exports = {
  command:"patreon",
  execute:async function(bot, msg, args){
    await msg.channel.createMessage(`https://www.patreon.com/TannerReynolds`);
  }
}
