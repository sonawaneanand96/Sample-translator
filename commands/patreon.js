module.exports = {
  command: "patreon",
  execute: async (bot, msg, args) => {
    await msg.channel.createMessage("Join here if you want to support this bot!\nhttps://discord.gg/r7utYPu")
  }
}
