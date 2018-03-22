module.exports = {
  command: "reply",
  execute: async (bot, msg, args) => {
    let devs = ["205912295837138944", "286166184402092042"]
    if(!devs.includes(msg.author.id)) return
    if (args[0] === undefined || args[0] === null || !args[0] || !bot.users.get(args[0])) return await bot.createMessage(msg.channel.id, `This user is no longer within reach`);
    if (isNaN(args[0]) === true) {
      return msg.channel.createMessage("This is not a valid ID")
    } else {
      let guy = bot.users.get(`${args[0]}`);
      let rep = args.slice(1).join(" ");
      if (!rep) return bot.createMessage(msg.channel.id, "You didn't type a reply");
      guy.getDMChannel().then(pm=> pm.createMessage(`\`MESSAGE FROM DEVELOPER\`\n\`\`\`${rep}\n\`\`\`\nIf you need further assistance or want to contact the developer, you can either add "${msg.author.username}#${msg.author.discriminator}" or join the Discord https://discord.gg/r7utYPu`))
      return await bot.createMessage(msg.channel.id, `Sent a dev reply to ${guy.username}#${guy.discriminator}`)
    }
  }
}
