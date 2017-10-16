const gfw = require('get-first-words');
module.exports = {
  command:"reply",
  execute:async function(bot, msg, args){
      let devs = ["205912295837138944", "286166184402092042"];
        if(!devs.includes(msg.author.id)) return msg.channel.createMessage("You cant use this lol.");
        let trunum = gfw(args.join(" "));
        if (trunum === undefined || trunum === null || !trunum || !bot.users.get(trunum)) return bot.createMessage(msg.channel.id, `This user is no longer within reach`);
        if (isNaN(trunum) === true) {return bot.createMessage(msg.channel.id, `${trunum} is not an id`);}
        else {
            let guy = bot.users.get(`${trunum}`);
            let rep = args.slice(1).join(" ");
            if (!rep) return bot.createMessage(msg.channel.id, 'You didn\'t type a reply');
            guy.getDMChannel().then(pm=> pm.createMessage(`\`MESSAGE FROM DEVELOPER\`\n\`\`\`${rep}\n\`\`\`\nIf you need further assistance or want to contact the developer, you can either add "${msg.author.username}#${msg.author.discriminator}" or join the Discord https://discord.gg/3bWf3a2`))
            bot.createMessage(msg.channel.id, `Sent a dev reply to ${guy.username}#${guy.discriminator}`);
        }
  }
}