const fs = require("fs");
module.exports = {
  command: "guilds",
  execute: async (Client, msg, args) => {
    let devs = ["205912295837138944", "286166184402092042"];
    if (!devs.includes(msg.author.id)) return
    let translateGuilds = Client.guilds.map(g => `"${g.name}": {
        "MEMBER COUNT": "${g.memberCount}",
        "GUILD ID": "${g.id}",
        "OWNER ID": "${g.ownerID}",
        "LARGE GUILD": "${g.large}",
        "HAS ADMIN": "${g.members.get(Client.user.id).permission.allow === 2146958591}",
        "REGION": "${g.region}"
    },`).join("\n")
    return await fs.writeFile(`${msg.id}_${Client.uptime}GUILDINFO.json`, JSON.stringify(translateGuilds), async (err) => {
      if (err){
        console.log(err)
        return await msg.channel.createMessage("Error while processing guild information.")
      } else {
        return await msg.channel.createMessage(`Guild Info file made! Reporting info on ${Client.guilds.size} guilds!`)
        .then(async () => {
          let fileContent = `{\n${translateGuilds}\n}`.replace("\\", "/")
          return await msg.channel.createMessage("", {name: "GuildInfo.json", file: fileContent})
        })
      }
    })
  }
}
