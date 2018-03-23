const config = require("./../tlcfg.json");
module.exports = {
  update:async (bot, guild, type) => {
    let guildState = type ? "Joined New Guild" : "Left Guild"
    bot.createMessage(config.guildStatChannel, { embed: {
      color: 0xFFFFFF, description: `${guildState}, now at ${bot.guilds.size} guilds!`,
      fields: [
        { name: "GuildID", value: guild.id },
        { name: "Owner", value: guild.ownerID, },
        { name: "Region", value: guild.region },
        { name: "Member Count", value: guild.memberCount },
        { name: "Shard", value: guild.shard.id }
      ],
      footer: { text: guild.name, },
      thumbnail: { url: guild.iconURL ? guild.iconURL : "http://is2.mzstatic.com/image/thumb/Purple128/v4/b1/9b/6c/b19b6c17-4e81-d800-3d1e-c0935f5ec5ba/source/300x300bb.jpg" }
    }})
  }
}
