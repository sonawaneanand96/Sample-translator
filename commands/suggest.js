const config = require('./../tlcfg.json');
module.exports = {
  command: "suggest",
  execute: async (bot, msg, args) => {
    if(args[0] == undefined || args[0] == null || args[0] == "") return await bot.createMessage(msg.channel.id, `You need to type something first...`)
    if(args.length > 1024) return await bot.createMessage(msg.channel.id, `Your Suggestion is too long.`)

    return await bot.createMessage(config.suggestion_channel, { embed: {
      color: 0xFFFFFF,
      author: { name: msg.author.username+"#"+msg.author.discriminator, icon_url: msg.author.avatarURL },
      footer: { text: msg.channel.guild.name, icon_url: msg.channel.guild.iconURL },
      fields: [
        { name: 'Author ID', value: msg.author.id },
        { name: 'Guild ID', value: msg.channel.guild.id },
        { name: 'Suggestion', value: args.join(" ") }
      ]
    }}).then(async () => {
      return await msg.channel.createMessage(`:wrench: Suggestion sent! If you like Translate, please consider making a pledge on our Patreon, every little bit helps pay for the costs to keep Translate online https://www.patreon.com/TannerReynolds`)
    })
  }
}
