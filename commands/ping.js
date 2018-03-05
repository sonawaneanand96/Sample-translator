module.exports = {
  command: "ping",
  execute: async (bot, msg, args) => {
    let botPing = Math.floor(msg.channel.guild.shard.latency);
    return await msg.channel.createMessage({embed: {
      color:0xFFFFFF, description: `:satellite_orbital: ${botPing}ms`
    }})
  }
}
