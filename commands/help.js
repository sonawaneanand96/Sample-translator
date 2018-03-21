module.exports = {
  command:"help",
  execute: async (bot, msg, args) => {
    return await msg.channel.createMessage({embed: {
      color: 0x7188d9,
      author: {
        name: 'Learning How To Use Your New Translator',
        icon_url: msg.author.avatarURL
      },
      description: "You can view all of Translate's features here on our website: https://havanabot.com/translate",
      thumbnail: {
        url: `https://cdn.discordapp.com/avatars/318554710929833986/933ce1c2b7fbd67b8eedd6cef6b588f8.jpg?size=128`
      }
    }})
    .then(async () => {
      return await msg.channel.createMessage('Do you want to contribute to the development of this bot? Want to see updates and our other services before anybody else? Are you a translator? Join our development server to help us continue translating! https://discord.gg/J2E8GRM')
    })
  }
}
