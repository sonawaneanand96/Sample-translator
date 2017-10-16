module.exports = {
  command:"invite",
  execute:async function(bot, msg, args){
    await msg.channel.createMessage("Want me on your server? use this link! https://discordapp.com/oauth2/authorize?client_id=318554710929833986&scope=bot&permissions=8");
  }
}
