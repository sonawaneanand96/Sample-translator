module.exports = {
  command:"eval",
  execute:async function(bot, msg, args){
    let devs = ["205912295837138944", "286166184402092042"];
    if(!devs.includes(msg.author.id)) return msg.channel.createMessage("You cant use this lol.");
    try{
      var code = args.join(" ");
      var evaled = eval(code);
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      return msg.channel.createMessage({embed: {
        color:0xFFFFFF,
        fields: [ { name: 'Input', value: "```JS\n"+code+"```" }, { name: 'Output', value: "```JS\n"+clean(evaled)+"```" } ]
      }});
    }catch(err){
      msg.channel.createMessage({embed: {
        color:0xFFFFFF,
        fields: [ { name: 'Input', value: "```JS\n"+code+"```" }, { name: 'Error Output', value: "```JS\n"+clean(err)+"```" } ]
      }});
      return console.log(`EVAL ERROR:\n${err}`);
    }
  }
}
function clean(text){
  if(typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}
