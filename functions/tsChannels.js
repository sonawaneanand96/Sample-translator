const lang = require("./../langs.json")
const langs = require("./../langmap.json")
const translate = require("google-translate-api")
module.exports = {
    translate: async (bot, msg, args, command, conn) => {
        if(!msg.channel.name.startsWith("ts-")) return
        let date = new Date()
        let month = date.getMonth() + 1;
        month = month.toString();
        let tsChannels = []
        msg.channel.guild.channels.map(c => {
            if(c.name.startsWith("ts-")) tsChannels.push({name: c.name, id: c.id})
        })
        for(i = 0; i < tsChannels.length; i++) {
            let channelLangReg = /(?<=ts\-)\S+/i
            let channelLang = channelLangReg.exec(tsChannels[i].name.toLowerCase());
            channelLang = channelLang[channelLang.length - 1]
            for (let l in langs) {
                for (let a in langs[l].alias) {
                  if(langs[l].alias[a] === channelLang) {
                    tsChannelTranslate(l, msg.content, `:flag_${langs[l].flag}:`, msg.channel.id, tsChannels[i].id)
                  }
                }
              }
        }
        let charCount
        await conn.table('stats').get(month).run().then(entry => {
          if(!entry) return
          charCount = entry.characters
        })
        charCount = parseInt(charCount) + msg.content.length
        let replaced = {
          month: month,
          characters: charCount.toString()
        }
        await conn.table('stats').get(month).replace(replaced).run()
        function tsChannelTranslate(lang, string, flag, sourceChannel, targetChannel) {
            if(string == "" || string == null || string == undefined) return;
            if(targetChannel !== sourceChannel) {
                translate(string, { to: lang }).then(res => {
                    if (res.text.length > 200) {
                      bot.createMessage(targetChannel, `**${msg.author.username}#${msg.author.discriminator}**: ${res.text}`);
                    } else {
                      bot.createMessage(targetChannel, { embed: {
                          color: 0xFFFFFF, description: `${flag} ${res.text}`, author: {name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: msg.author.avatarURL ? msg.author.avatarURL : msg.author.defaultAvatarURL}
                        }});
                    }
                  }).catch(err => console.error(err) );
            }
        }
    }
}