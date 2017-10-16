const config = require('./../tlcfg.json');
module.exports = {
  update:async function(bot, guild, type){
    var guild_state = (type ? "New Guild Joined" : "Guild Left");
    if (!guild.iconURL){
      bot.createMessage(config.guild_stat_channel, { embed: {
        color: 0xFFFFFF, description: `${guild_state}, now at ${bot.guilds.size} guilds!`,
        fields: [
          { name: 'GuildID', value: `${guild.id}` },
          { name: 'Owner', value: `${guild.ownerID}`, },
          { name: 'Region', value: `${guild.region}` },
          { name: 'Member Count', value: `${guild.memberCount}` },
          { name: 'Shard', value: `${guild.shard.id}` }
        ],
        footer: { text: `${guild.name}`, },
        thumbnail: { url: `http://is2.mzstatic.com/image/thumb/Purple128/v4/b1/9b/6c/b19b6c17-4e81-d800-3d1e-c0935f5ec5ba/source/300x300bb.jpg` }
      }});
    }else{
      bot.createMessage(config.guild_stat_channel, { embed: {
        color: 0xFFFFFF, description: `${guild_state}, now at ${bot.guilds.size} guilds!`,
        fields: [
          { name: 'GuildID', value: `${guild.id}` },
          { name: 'Owner', value: `${guild.ownerID}`, },
          { name: 'Region', value: `${guild.region}` },
          { name: 'Member Count', value: `${guild.memberCount}` },
          { name: 'Shard', value: `${guild.shard.id}` }
        ],
        footer: { text: `${guild.name}`, },
        thumbnail: { url: `${guild.iconURL}` }
      }});
    }
  }
}
