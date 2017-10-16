const ostb = require('os-toolbox'),
      fs = require('fs');
module.exports = {
  command:"d.guilds",
  execute:async function(bot, msg, args){
    let devs = ["205912295837138944", "286166184402092042"];
    if(!devs.includes(msg.author.id)) return msg.channel.createMessage("You cant use this lol.");
    let translateGuilds = bot.guilds.map(g => `"${g.name}": { "MEMBER ACOUNT": "${g.memberCount}", "GUILD ID": "${g.id}", "OWNER ID": "${g.ownerID}", "LARGE GUILD": "${g.large}", "HAS ADMIN": "${g.members.get(bot.user.id).permission.allow === 2146958591}" },`).join("\n");
    fs.writeFile(`${msg.id}${bot.uptime}GUILDINFO.json`, JSON.stringify(translateGuilds), (err)=>{
      if(err){
        console.log(err);
        return msg.channel.createMessage('Error while processing guild information.');
      }else{
        return msg.channel.createMessage(`Guild Info file made! Reporting info on ${bot.guilds.size} guilds!`);
      }
    });
  }
}
