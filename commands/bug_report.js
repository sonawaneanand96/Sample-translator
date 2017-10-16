const config = require('./../tlcfg.json');
module.exports = {
  command:"bug",
  execute:async function(bot, msg, args){
    if(args[0] == undefined || args[0] == null || args[0] == "")
      return bot.createMessage(msg.channel.id, `You need to type something first...`);
    if(args.length > 1024)
      return bot.createMessage(msg.channel.id, `Your bug report is too long.`);
    bot.createMessage(config.bug_report_channel, { embed: {
      color: 0xFFFFFF,
      author: { name: msg.author.username+"#"+msg.author.discriminator, icon_url: msg.author.avatarURL },
      footer: { text: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
      fields: [
        { name: 'Author ID', value: msg.author.id },
        { name: 'Guild ID', value: msg.channel.guild.id },
        { name: 'Bug Report', value: args.join(" ") }
      ]
    }});
    return msg.channel.createMessage(`:wrench: Bug report sent! If the developer has any questions regarding your bug report, this bot will DM you the developer's question/message, so be sure to allow DMs from people within the guild.`);
  }
}
