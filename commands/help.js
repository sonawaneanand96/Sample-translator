module.exports = {
  command:"help",
  execute:async function(bot, msg, args){
    await msg.channel.createMessage({embed: {
      color: 0xFFFFFF,
      author: {
        name: 'Learning How To Use Your New Translator',
        icon_url: msg.author.avatarURL
      },
      fields: [
        {
          name: 'Translating your messages',
          value: 'Translate makes it easy to translate any message you want to just about any language you can think of! All you have to do is type **":t (language) (text to be translated)"** and translate will handle the rest! For example, if I want to tell somebody what my name is in korean, I just have to type **":t korean Hi, my name is Tanner!"**'
        },
        {
          name: 'Finding out what language people are speaking in',
          value: 'If you see people chatting away in a language you dont know, and you want to take part in the conversaion, you can type **":t lang (text to analyze)"** and Translate will dissect the message and tell you what language they\'re speaking in! For example, All I\'d have to type is **":t lang 안녕하세요, 만나서 반가워요!"** to find out that they\'re speaking in korean'
        },
        {
          name: 'Other commands available',
          value: '```ini\n[:t patreon] Gives you a link to our patreon!\n\n[:t invite] Sends an invite link so that your friends can invite Translate to their servers too\n\n[:t bug (bug report)] Sends a bug report to the developers\n\n[:t suggest (suggestion)] Sends a suggestion to our developers\n\n[:t stats] Shows some cool technical statistic nerd-stuff about the bot\n\n[:t shards] Displays all the bot\'s shards, along with their pings\n```'
        },
        {
          name: 'More Information',
          value: 'Want to learn more about Translate? **Want to see the full list of supported languages?** Want to upvote Translate? You can learn more about Translate and can upvote the bot here: <https://discordbots.org/bot/translate>. We appreciate any and all upvotes, and *thank you* for supporting our growth'
        }
        ],
        thumbnail: {
          url: `http://ovh-is.a-shit.host/87440.png`
        }
    }});
  }
}
