module.exports = {
  command: "invite",
  execute: async (bot, msg, args) => {
    await msg.channel.createMessage("https://havanabot.com/translate/invite")
  }
}
