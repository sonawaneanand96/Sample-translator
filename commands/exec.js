const shell = require('shelljs');
module.exports = {
  command:"exec",
  execute:async function(bot, msg, args){
    if(msg.author.id !== '205912295837138944' && msg.author.id !== '286166184402092042') return;
    if (!args.join(" ")) return msg.channel.createMessage('No arguments were given');
    msg.channel.createMessage(`\`INPUT\`\n\`\`\`ini\n${args.join(" ")}\n\`\`\``);
    shell.exec(args.join(" "), function(code, stdout, stderr) {
        return msg.channel.createMessage(`\`OUTPUT\`\n\`\`\`ini\n${stdout}\n\`\`\``);
    });
  }
}