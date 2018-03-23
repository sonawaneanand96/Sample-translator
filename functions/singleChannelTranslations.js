const translate = require("google-translate-api")
module.exports = {
    translate: async (bot, msg, args, command, conn) => {
        let date = new Date()
        let month = date.getMonth() + 1;
        month = month.toString();
        let year = date.getFullYear();
        year = year.toString();
        let statsEntry = `${month}/${year}`
        conn.table("channels").get(msg.channel.id).run().then(async tRes => {
            if (!tRes) return
            if (msg.channel.id !== tRes.channelID || msg.content.toLowerCase().startsWith(":t")) return
            if (msg.content.startsWith("<") && msg.content.endsWith(">") || msg.content.startsWith("<")) return // Ignores all messages encased with <>
            if (msg.content == "" || msg.content == null || msg.content == undefined) return
            return await translate(msg.content).then(async res => {
              
              // Stats updater //
              let charCount
              await conn.table('stats').get(statsEntry).run().then(entry => {
                if(!entry) return
                charCount = entry.characters
              })
              charCount = parseInt(charCount) + msg.content.length
              charCount = charCount.toString();
              let replaced = {
                month: statsEntry,
                characters: charCount
              }
              await conn.table('stats').get(statsEntry).replace(replaced).run()
        
        
              let iso1 = tRes.firstLang.replace(/[()]+/, "")
              let iso2 = tRes.secondLang.replace(/[()]+/, "")
              await translate(msg.content, {
                to: res.from.language.iso === iso1 ? iso2 : iso1
              }).then(async reso => {
                if (reso.text.length > 200) {
                  return await msg.channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}**: ${reso.text}`)
                }
                return await msg.channel.createMessage({embed:{
                  color: 0xFFFFFF,
                  author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL },
                  description: `${reso.text}`
                }})
              })
            })
        })
    }
}