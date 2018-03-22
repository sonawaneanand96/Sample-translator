const shell = require("shelljs");
module.exports = {
  command:"exec",
  execute: async (bot, msg, args) => {
    if(msg.author.id !== "205912295837138944" && msg.author.id !== "286166184402092042") return
    if (!args.join(" ")) return await msg.channel.createMessage("No arguments were given")
    return await msg.channel.createMessage(`\`INPUT\`\n\`\`\`ini\n${args.join(" ")}\n\`\`\``)
    .then(async () => {
      return await shell.exec(args.join(" "), async (code, stdout, stderr) => {
        return await msg.channel.createMessage(`\`OUTPUT\`\n\`\`\`ini\n${stdout}\n\`\`\``)
      })
    })
  }
}
