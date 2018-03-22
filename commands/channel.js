module.exports = {
  command: "channel",
  execute: async (bot, msg, args, conn) => {
    let manageChannels = msg.channel.permissionsOf(msg.author.id).has("manageChannels")
    if (!manageChannels) return await msg.channel.createMessage("You do not have the manageChannels permission")
    if (args[0].toLowerCase() === "none") {
      return await conn.table("channels").get(msg.channel.id).delete()
      .run(async (err, res) => {
        if (err) return await msg.channel.createMessage(`An error occurred\n${e}`)
        return await msg.channel.createMessage("Successfully removed the automatic translation channel!")
      })
    }
    if (!args[0] || !args[1]) return msg.channel.createMessage("You need to type in some language ISOs to set the languages.")
    return await conn.table("channels").get(msg.channel.id).run().then(async (Tres) => {
      if (!Tres) {
        return await conn.table("channels")
        .insert({ channelID: msg.channel.id, firstLang: args[0], secondLang: args[1] })
        .run(async (err, res) => {
          if (err) return await msg.channel.createMessage(`An error occurred\n${e}`)
          return await msg.channel.createMessage(`Successfully setup the automatic translation channel!`)
        })
      } else if (Tres) {
        return await conn.table("channels")
        .get(msg.channel.id).replace({ channelID: msg.channel.id, firstLang: args[0], secondLang: args[1] })
        .run(async (err, res) => {
          if (err) return await msg.channel.createMessage(`An error occurred\n${e}`)
          return await msg.channel.createMessage("Successfully setup the automatic translation channel!")
        })
      }
    })
  }
}
