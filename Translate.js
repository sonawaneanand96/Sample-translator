const tlcfg = require('./tlcfg.json'),
      Eris = require("eris"),
      bot = new Eris(tlcfg.token, { maxShards: 2 }),
      translate = require('google-translate-api'),
      G = require('gizoogle'),
      YodaSpeak = require('yoda-speak'),
      yoda = new YodaSpeak(tlcfg.yoda),
      kpop = require('kpop'),
      stats = require('sysstats')(),
      ostb = require('os-toolbox'),
      fs = require('fs'),
      shell = require('shelljs'),
      japanese = require('japanese'),
      flip = require('flipout'),
      request = require("superagent"),
      dbotspw_token = tlcfg.dbotspw,
      dbots_token = tlcfg.dbots,
      zalgo = require('to-zalgo'),
      cmd_prefix = tlcfg.prefix;
let guild_size = null,
    shard_size = null;

console.log('Connecting...');
process.on('unhandledRejection', (reason)=>{
  console.log("unhandledRejection\n" + reason);
  return;
});
process.on('uncaughtException', (err)=>{
  console.log("uncaughtException\n" + err);
  return;
});

bot.on("ready", () => {
  let userCount = bot.users.size;
  bot.editStatus('online', {
    name: `${cmd_prefix} help | ${bot.guilds.size} servers & ${userCount} users! | Want to support Translate's existence? go here! https://www.patreon.com/TannerReynolds`,
    type: 0
  });
  console.log(`GOOGLE TRANSLATE BOT. Playing on ${bot.guilds.size} servers, currently serving ${userCount} users`);
  const gmstr = [
    `${cmd_prefix} help | ${userCount} users`,
    `${cmd_prefix} help | ${bot.guilds.size} guilds`,
    `${cmd_prefix} help | ${cmd_prefix} invite`,
    `${cmd_prefix} help | ${bot.guilds.size} servers & ${userCount} users! | Want to support Translate's existence? go here! https://www.patreon.com/TannerReynolds`,
    `${cmd_prefix} patreon | ${cmd_prefix} invite`,
    `${cmd_prefix} patreon`
  ]
  setInterval(newGame, 1000*30);
  function newGame() {
    var randomNumber = Math.floor(Math.random() * gmstr.length);
    bot.editStatus('online', {
      name: `${gmstr[randomNumber]}`,
      type: 0
    });
  }
  guild_size = bot.guilds.size; shard_size = bot.shards.size; sendDBLStats();
});

bot.on('guildCreate', guild => {
  guild_size = bot.guilds.size; shard_size = bot.shards.size; sendDBLStats();
  if (!guild.iconURL) {
    bot.createMessage('341775242839982080', { embed: {
      color: 0xFFFFFF, description: `New Guild Joined, now at ${bot.guilds.size} guilds!`,
      fields: [
        { name: 'GuildID', value: `${guild.id}` },
        { name: 'Owner', value: `${guild.ownerID}`, },
        { name: 'Region', value: `${guild.region}` },
        { name: 'Member Count', value: `${guild.memberCount}` },
        { name: 'Shard', value: `${guild.shard.id}` }
      ],
      footer: { text: `${guild.name}`, },
      thumbnail: { url: `http://is2.mzstatic.com/image/thumb/Purple128/v4/b1/9b/6c/b19b6c17-4e81-d800-3d1e-c0935f5ec5ba/source/300x300bb.jpg` }
    }});
  }else{
    bot.createMessage('341775242839982080', { embed: {
      color: 0xFFFFFF, description: `New Guild Joined, now at ${bot.guilds.size} guilds!`,
      fields: [
        { name: 'GuildID', value: `${guild.id}` },
        { name: 'Owner', value: `${guild.ownerID}`, },
        { name: 'Region', value: `${guild.region}` },
        { name: 'Member Count', value: `${guild.memberCount}` },
        { name: 'Shard', value: `${guild.shard.id}` }
      ],
      footer: { text: `${guild.name}`, },
      thumbnail: { url: `${guild.iconURL}` }
    }})
  }
});

bot.on('guildDelete', guild => {
  guild_size = bot.guilds.size; shard_size = bot.shards.size; sendDBLStats();
  if (!guild.iconURL) {
    bot.createMessage('341775242839982080', { embed: {
      color: 0xFFFFFF, description: `Guild Left, now at ${bot.guilds.size} guilds!`,
      fields: [
        { name: 'GuildID', value: `${guild.id}` },
        { name: 'Owner', value: `${guild.ownerID}`, },
        { name: 'Region', value: `${guild.region}` },
        { name: 'Member Count', value: `${guild.memberCount}` },
        { name: 'Shard', value: `${guild.shard.id}` }
      ],
      footer: { text: `${guild.name}`, },
      thumbnail: { url: `http://is2.mzstatic.com/image/thumb/Purple128/v4/b1/9b/6c/b19b6c17-4e81-d800-3d1e-c0935f5ec5ba/source/300x300bb.jpg` }
    }});
  }else{
    bot.createMessage('341775242839982080', { embed: {
      color: 0xFFFFFF, description: `Guild Left, now at ${bot.guilds.size} guilds!`,
      fields: [
        { name: 'GuildID', value: `${guild.id}` },
        { name: 'Owner', value: `${guild.ownerID}`, },
        { name: 'Region', value: `${guild.region}` },
        { name: 'Member Count', value: `${guild.memberCount}` },
        { name: 'Shard', value: `${guild.shard.id}` }
      ],
      footer: { text: `${guild.name}`, },
      thumbnail: { url: `${guild.iconURL}` }
    }})
  }
});

bot.on("messageCreate", (msg) => {
  if(!msg.content.toLowerCase().startsWith(cmd_prefix)) return;
  const args = msg.content.slice(2).trim().split(/ +/g);

  if(msg.content.toLowerCase() === cmd_prefix){
    return msg.channel.createMessage(cmd_prefix+" `[help | language] [text_to_translate]`");
  }
  if(msg.content.toLowerCase() === cmd_prefix+" help") {
    return msg.channel.createMessage(`Want to know how to use the Translate Bot? View the helppage here! <https://discordbots.org/bot/translate> | **If you like Translate, please consider making a pledge on our Patreon, every little bit helps pay for the costs to keep Translate online** <https://www.patreon.com/TannerReynolds>`);
  }
  if (msg.content.toLowerCase() === cmd_prefix+" patreon") {
    return msg.channel.createMessage(`https://www.patreon.com/TannerReynolds`);
  }
  if(msg.content.toLowerCase() === cmd_prefix+" shards") {
    let shardMap = bot.shards.map(s => `[ID]: ${s.id} | [Ping]: ${s.latency} | [Status]: ${s.status}`).join("\n");
    msg.channel.createMessage(shardMap);
  }
  if (msg.content.toLowerCase() === cmd_prefix+" stats") {
    let servers = bot.guilds.size,
        playercount = bot.users.size,
        mintime = ostb.uptime() / 60,
        uptime = Math.floor(mintime / 60),
        serversLarge = bot.guilds.filter(m => m.large).size,
        botPing = Math.floor(msg.channel.guild.shard.latency);
    ostb.cpuLoad().then((cpuusage)=>{ ostb.memoryUsage().then((memusage)=>{ ostb.currentProcesses().then((processes)=>{
      const curpro = processes;
      const meuse = memusage;
      const acusage = cpuusage;
      msg.channel.createMessage(
        "```INI\n[CPU]: "+acusage+"%\n\n"+
        "[RAM]: "+meuse+"%\n\n"+
        "[Shards]: "+bot.shards.size+"\n\n"+
        "[Network Speed]: 1gbps\n\n"+
        "[Ping]: "+botPing+"\n\n"+
        "[Guilds bot is running on]: "+servers+"\n\n"+
        "[Total Member Count]: "+playercount+"\n\n"+
        "[Platform]: CentOS 7 x64 - Linux\n\n"+
        "[Server Location]: San Jose\n\n"+
        "[Hosting Provider]: Vultr Holdings LLC\n\n"+
        "[Client Uptime]: "+Math.floor(((bot.uptime / (1000*60*60)) % 24))+" hours\n\n"+
        "[Server Uptime]: "+JSON.stringify(uptime)+" hours```"
      );
    });});});
  }
  if(msg.content.toLowerCase() === cmd_prefix+" guild list") {
    if(msg.author.id !== "205912295837138944") return msg.channel.send("You do not have access to this command.");
    let translateGuilds = bot.guilds.map(g => `"${g.name}": { "MEMBER ACOUNT": "${g.memberCount}", "GUILD ID": "${g.id}", "OWNER ID": "${g.ownerID}", "LARGE GUILD": "${g.large}", "HAS ADMIN": "${g.members.get(bot.user.id).permission.allow === 2146958591}" },`).join("\n");
    fs.writeFile(`${msg.id}${bot.uptime}GUILDINFO.json`, JSON.stringify(translateGuilds), (err)=>{
      if(err){
        console.log(err);
        bot.createMessage(msg.channel.id, 'Error while processing guild information.');
      }else{
        bot.createMessage(msg.channel.id, `Guild Info file made! Reporting info on ${bot.guilds.size} guilds!`);
      }
    });
  }
  if(msg.content.toLowerCase().startsWith(cmd_prefix+" suggest")){
    let args = msg.content.split(" ").slice(2).join(" ");
    if (msg.channel.guild.name === "Null") return;
    if (!args) {
      return bot.createMessage(msg.channel.id, `You need to type something first...`);
    }
    if (args.length > 1024) {
      return bot.createMessage(msg.channel.id, `Your Suggestion is too long.`);
    }
    bot.createMessage('314819480817762304', { embed: {
      color: 0xFFFFFF,
      author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: `${msg.author.avatarURL}` },
      footer: { text: `${msg.channel.guild.name}`, icon_url: `${msg.channel.guild.iconURL}` },
      fields: [
        { name: 'Author ID', value: `${msg.author.id}` },
        { name: 'Guild ID', value: `${msg.channel.guild.id}` },
        { name: 'Suggestion', value: `${args}` }
      ]
    }});
    return msg.channel.createMessage(`:wrench: Suggestion sent! If you like Translate, please consider making a pledge on our Patreon, every little bit helps pay for the costs to keep Translate online https://www.patreon.com/TannerReynolds`);
  }
  if(msg.content.toLowerCase().startsWith(cmd_prefix+" bug")) {
    let args = msg.content.split(" ").slice(2).join(" ");
    if (!args) {
      return msg.channel.createMessage(`You need to type something first...`);
    }
    if (args.length > 1024) {
      return msg.channel.createMessage(`Your bug report is too long.`);
    }
    bot.createMessage('315280472378966016', { embed: {
      color: 0xFFFFFF,
      author: { name: `${msg.author.username}#${msg.author.discriminator}`, icon_url: `${msg.author.avatarURL}` },
      footer: { text: `${msg.channel.guild.name}`, icon_url: `${msg.channel.guild.iconURL}` },
      fields: [
        { name: 'Author ID', value: `${msg.author.id}` },
        { name: 'Guild ID', value: `${msg.channel.guild.id}` },
        { name: 'Bug Report', value: `${args}` }
      ]
    }});
    return msg.channel.createMessage(`:wrench: Bug report sent! If the developer has any questions regarding your bug report, this bot will DM you the developer's question/message, so be sure to allow DMs from people within the guild.`);
  }
  if (msg.content.toLowerCase() === cmd_prefix+" invite") {
    return msg.channel.createMessage("Want me on your server? use this link! https://discordapp.com/oauth2/authorize?client_id=318554710929833986&scope=bot&permissions=8");
  }
  if (msg.content.toLowerCase() === cmd_prefix+" ping") {
    let botPing = Math.floor(msg.channel.guild.shard.latency);
    return msg.channel.createMessage({embed: {
      color:0xFFFFFF, description: `:satellite_orbital: ${botPing}ms`
    }});
  }
  var thingToTranslate = args.join(" ").split(" ").slice(1).join(" ").toString();
  switch(args[0]){
    case "korean": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_kr:');
    case "arabic": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_sa:');
    case "afrikaans": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_za:');
    case "albanian": return translateFunction("sq", thingToTranslate, ':flag_al:');
    case "armenian": return translateFunction("hy", thingToTranslate, ':flag_am:');
    case "azerbaijani": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_az:');
    case "basque": return translateFunction("eu", thingToTranslate, ':flag_fr:');
    case "belarusian": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_by:');
    case "bengali": return translateFunction("bn", thingToTranslate, ':flag_bd:');
    case "bosnian": return translateFunction("bs", thingToTranslate, ':flag_ba:');
    case "bulgarian": return translateFunction("bg", thingToTranslate, ':flag_bg:');
    case "catalan": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_ad:');
    case "cebuano": return translateFunction(args[0].substring(0, 3), thingToTranslate, ':flag_ph:');
    case "chichewa": return translateFunction("ny", thingToTranslate, ':flag_zw:');
    case "chinese-simplified": return translateFunction("zh-cn", thingToTranslate, ':flag_cn:');
    case "chinese-traditional": return translateFunction("zh-tw", thingToTranslate, ':flag_cn:');
    case "corsican": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_it:');
    case "croatian": return translateFunction("hr", thingToTranslate, ':flag_hr:');
    case "czech": return translateFunction("cs", thingToTranslate, ':flag_cz:');
    case "danish": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_dk:');
    case "dutch": return translateFunction("nl", thingToTranslate, ':flag_nl:');
    case "english": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_um:');
    case "esperanto": return translateFunction("eo", thingToTranslate, ':flag_hu:');
    case "estonian": return translateFunction("et", thingToTranslate, ':flag_ee:');
    case "filipino": return translateFunction("tl", thingToTranslate, ':flag_ph:');
    case "finnish": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_fi:');
    case "french": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_fr:');
    case "frisian": return translateFunction("fy", thingToTranslate, ':flag_nl:');
    case "galician": return translateFunction("gl", thingToTranslate, ':flag_ea:');
    case "georgian": return translateFunction("ka", thingToTranslate, ':flag_ge:');
    case "german": return translateFunction("de", thingToTranslate, ':flag_de:');
    case "greek": return translateFunction("el", thingToTranslate, ':flag_gr:');
    case "gujarati": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_in:');
    case "haitian": return translateFunction("ht", thingToTranslate, ':flag_ht:');
    case "hausa": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_ne:');
    case "hawaiian": return translateFunction(args[0].substring(0, 3), thingToTranslate, ':flag_um:');
    case "hebrew": return translateFunction("iw", thingToTranslate, ':flag_il:');
    case "hindi": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_in:');
    case "hmong": return translateFunction("hmn", thingToTranslate, ':flag_cn:');
    case "hungarian": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_hu:');
    case "icelandic": return translateFunction("is", thingToTranslate, ':flag_is:');
    case "igbo": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_ng:');
    case "indonesian": return translateFunction("id", thingToTranslate, ':flag_id:');
    case "irish": return translateFunction("ga", thingToTranslate, ':flag_ie:');
    case "italian": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_it:');
    case "japanese": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_jp:');
    case "javanese": return translateFunction("jw", thingToTranslate, ':flag_id:');
    case "kannada": return translateFunction("kn", thingToTranslate, ':flag_in:');
    case "kazakh": return translateFunction("kk", thingToTranslate, ':flag_kz:');
    case "khmer": return translateFunction("km", thingToTranslate, ':flag_kh:');
    case "kurdish": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_tr:');
    case "kyrgyz": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_cn:');
    case "lao": return translateFunction("lo", thingToTranslate, ':flag_la:');
    case "latin": return translateFunction(args[0].substring(0, 2), thingToTranslate, ':flag_va:');
    case "latvian": return translateFunction("lv", thingToTranslate, ':flag_lv:');
    case "lithuanian": return translateFunction("lt", thingToTranslate, ':flag_lt:');
    case "luxembourgish": return translateFunction("lb", thingToTranslate, ':flag_lu:');
    case "macedonian": return translateFunction("mk", thingToTranslate, ':flag_mk:');
    case "malagasy": return translateFunction("mg", thingToTranslate, ':flag_mg:');
    case "malay": return translateFunction("ms", thingToTranslate, ':flag_id:');
    case "malayalam": return translateFunction("ml", thingToTranslate, ':flag_in:');
    case "maltese": return translateFunction("mt", thingToTranslate, ':flag_mt:');
    case "maori": return translateFunction("mi", thingToTranslate, ':flag_nz:');
    case "marathi": return translateFunction("mr", thingToTranslate, ':flag_in:');
    case "mongolian": return translateFunction("mn", thingToTranslate, ':flag_mn:');
    case "myanmar": return translateFunction("my", thingToTranslate, ':flag_mm:');
    case "nepali": return translateFunction("ne", thingToTranslate, ':flag_np:');
    case "norwegian": return translateFunction("no", thingToTranslate, ':flag_no:');
    case "pashto": return translateFunction("ps", thingToTranslate, ':flag_af:');
    case "persian": return translateFunction("fa", thingToTranslate, ':flag_ir:');
    case "polish": return translateFunction("pl", thingToTranslate, ':flag_pl:');
    case "portuguese": return translateFunction("pt", thingToTranslate, ':flag_br:');
    case "punjabi": return translateFunction("ma", thingToTranslate, ':flag_pk:');
    case "romanian": return translateFunction("ro", thingToTranslate, ':flag_ro:');
    case "russian": return translateFunction("ru", thingToTranslate, ':flag_ru:');
    case "samoan": return translateFunction("sm", thingToTranslate, ':flag_ws:');
    case "scots-gaelic": return translateFunction("gd", thingToTranslate, ':flag_gb:');
    case "serbian": return translateFunction("sr", thingToTranslate, ':flag_rs:');
    case "sesotho": return translateFunction("st", thingToTranslate, ':flag_ls:');
    case "shona": return translateFunction("sn", thingToTranslate, ':flag_zw:');
    case "sindhi": return translateFunction("sd", thingToTranslate, ':flag_pk:');
    case "sinhala": return translateFunction("si", thingToTranslate, ':flag_lk:');
    case "slovak": return translateFunction("sk", thingToTranslate, ':flag_sk:');
    case "slovenian": return translateFunction("sl", thingToTranslate, ':flag_si:');
    case "somali": return translateFunction("so", thingToTranslate, ':flag_so:');
    case "spanish": return translateFunction("es", thingToTranslate, ':flag_es:');
    case "sudanese": return translateFunction("su", thingToTranslate, ':flag_sd:');
    case "swahili": return translateFunction("sw", thingToTranslate, ':flag_ke:');
    case "swedish": return translateFunction("sv", thingToTranslate, ':flag_se:');
    case "tajik": return translateFunction("tg", thingToTranslate, ':flag_af:');
    case "tamil": return translateFunction("ta", thingToTranslate, ':flag_in:');
    case "telugu": return translateFunction("te", thingToTranslate, ':flag_in:');
    case "thai": return translateFunction("th", thingToTranslate, ':flag_th:');
    case "turkish": return translateFunction("tr", thingToTranslate, ':flag_tr:');
    case "ukrainian": return translateFunction("uk", thingToTranslate, ':flag_ua:');
    case "urdu": return translateFunction("ur", thingToTranslate, ':flag_pk:');
    case "uzbek": return translateFunction("uz", thingToTranslate, ':flag_uz:');
    case "vietnamese": return translateFunction("vi", thingToTranslate, ':flag_vn:');
    case "welsh": return translateFunction("cy", thingToTranslate, ':flag_gb:');
    case "xhosa": return translateFunction("xh", thingToTranslate, ':flag_za:');
    case "yiddish": return translateFunction("yi", thingToTranslate, ':flag_il:');
    case "yoruba": return translateFunction("yo", thingToTranslate, ':flag_ng:');
    case "zulu": return translateFunction("zu", thingToTranslate, ':flag_za:');

    // only works with fun translations (just the way i did it)
    case "romanized-korean": return funTranslation(kpop.romanize(thingToTranslate), ':flag_kr:');
    case "hangulified-korean": return funTranslation(kpop.hangulify(thingToTranslate), ':flag_kr:');

    case "romanized-japanese": return funTranslation(japanese.romanize(thingToTranslate), ':flag_jp:');
    case "katakanized-japanese": return funTranslation(japanese.katakanize(thingToTranslate), ':flag_jp:');
    case "hiraganized-japanese": return funTranslation(japanese.hiraganize(thingToTranslate), ':flag_jp:');
    // END MAIN TRANSLATIONS
    /////////////////////////////////////////////////////////////////////////////////////////
    // FUN TRANSLATIONS
    case "flip": case "flipped": return funTranslation(flip(thingToTranslate), ":upside_down:");
    case "zalgo": return funTranslation(zalgo(thingToTranslate), ":upside_down:");
    case "gang": case "gangsta": G.string(thingToTranslate, (err, result)=>{ if(err){ return msg.channel.createMessage("Oops, there was an error!\nDid you forget to enter something to translate?") } return funTranslation(result, ":gun:") }); break;
    case "yoda": yoda.convert(thingToTranslate, (err, result)=>{ if(err){ return msg.channel.createMessage("Oops, there was an error!\nDid you forget to enter something to translate?") } return funTranslation(result.toString(), ":rocket:") }); break;
  }
  // MAIN TRANSLATION
  function translateFunction(lang, string, flag){
    if(string == "" || string == null || string == undefined) return msg.channel.createMessage("Nothing to translate!");
    translate(string, { to: lang }).then((res)=>{
        if (res.text.length > 200) {
            return msg.channel.createMessage(`${flag}\n${res.text}`);
        }
        msg.channel.createMessage({ embed: {
          color: 0xFFFFFF, description: `${flag} ${res.text}`
        }});
    }).catch(err => { console.error(err) });
  }
  /////////////////////////////////////
  // FUN TRANSLATIONS
  function funTranslation(text, emoji){
    if(text == "" || text == null || text == undefined || text.includes("<!DOCTYPE")) return msg.channel.createMessage("Nothing to translate!");
    if (text.length > 200) { return msg.channel.createMessage(text); }
    msg.channel.createMessage({ embed: {
      color: 0xFFFFFF,
      description: emoji+" "+text
    }});
  }
  /////////////////////////////////////////////////////////////////////
  // EVAL COMMAND
  if (msg.content.startsWith("}=eval")){
    if(msg.author.id !== "205912295837138944") return msg.channel.createMessage("You may not use this command.");
    try{
      var code = args.join(" ");
      var evaled = eval(code);
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
      return msg.channel.createMessage({embed: {
        color:0xFFFFFF,
        fields: [ { name: 'Input', value: "```JS\n"+code+"```" }, { name: 'Output', value: "```JS\n"+clean(evaled)+"```" } ]
      }});
    }catch(err){
      return msg.channel.createMessage({embed: {
        color:0xFFFFFF,
        fields: [ { name: 'Input', value: "```JS\n"+code+"```" }, { name: 'Error Output', value: "```JS\n"+clean(err)+"```" } ]
      }});
    }
  }
});
function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}
function sendDBLStats(){
  if(guild_size == null) return;
  if(shard_size == null) return;
  request.post(`https://discordbots.org/api/bots/318554710929833986/stats`)
  .set('Authorization', dbots_token)
  .send({ server_count: guild_size, shard_count: shard_size })
  .end(function(err, res){
    if(err){
      return console.log(`ERROR SENDING STATS TO DISCORDBOTS.ORG: ${err}`);
    }else{
      console.log(`Successfully sent stats to https://discordbots.org! Now at ${guild_size} servers!`);
    }
  });
  request.post(`https://bots.discord.pw/api/bots/318554710929833986/stats`)
  .set('Authorization', dbotspw_token)
  .send({ server_count: guild_size })
  .end(function(err, res){
    if(err){
      return console.log(`ERROR SENDING STATS TO BOTS.DISCORD.PW: ${err}`);
    }else{
      console.log(`Successfully sent stats to https://bots.discord.pw! Now at ${guild_size} servers!`);
    }
  });
}
bot.connect();
