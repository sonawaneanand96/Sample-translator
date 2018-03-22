const translate = require("google-translate-api")
const G = require("gizoogle")
const tlcfg = require("./../tlcfg.json")
const YodaSpeak = require("yoda-speak")
const yoda = new YodaSpeak(tlcfg.yoda)
const zalgo = require("to-zalgo")
const flip = require("flipout")
const kpop = require("kpop")
const lang = require("./../langs.json")
const japanese = require("japanese")

let langs = require("./../langmap.json")
let LangMap = new Map()

module.exports = {
  execute: async (bot, msg, args, command, cmdCounts) => {
    let thingToTranslate = args.join(" ");

    if (command === "lang") return languageDetection(thingToTranslate)

    for (let l in langs) {
      for (let a in langs[l].alias) {
        LangMap.set(langs[l].alias[a], (args) => {
          return translateFunction(l, args.join(" "), `:flag_${langs[l].flag}:`)
        })
      }
    }
    
    let toT = LangMap.get(command)

    if (toT) {
      return toT(args)
    }

    switch(command){
      case "romanized-korean": return funTranslation(kpop.romanize(thingToTranslate), ":flag_kr:");
      case "hangulified-korean": return funTranslation(kpop.hangulify(thingToTranslate), ":flag_kr:");
      case "romanized-japanese": return funTranslation(japanese.romanize(thingToTranslate), ":flag_jp:");
      case "katakanized-japanese": return funTranslation(japanese.katakanize(thingToTranslate), ":flag_jp:");
      case "hiraganized-japanese": return funTranslation(japanese.hiraganize(thingToTranslate), ":flag_jp:");
      case "flip": case "flipped": return funTranslation(flip(thingToTranslate), ":upside_down:");
      case "zalgo": return funTranslation(zalgo(thingToTranslate), ":upside_down:");
      case "gang": case "gangsta": G.string(thingToTranslate, (err, result)=>{ if(err){ return msg.channel.createMessage("Oops, there was an error!\nDid you forget to enter something to translate?") } return funTranslation(result, ":gun:") }); break;
      case "yoda": yoda.convert(thingToTranslate, (err, result)=>{ if(err){ return msg.channel.createMessage("Oops, there was an error!\nDid you forget to enter something to translate?") } return funTranslation(result.toString(), ":rocket:") }); break;
    }

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

    function funTranslation(text, emoji){
      if(text == "" || text == null || text == undefined || text.includes("<!DOCTYPE")) return msg.channel.createMessage("Translation failed.");
      if (text.length > 200) { return msg.channel.createMessage(text); }
      msg.channel.createMessage({ embed: {
        color: 0xFFFFFF,
        description: emoji+" "+text
      }});
    }

    function languageDetection(string) {
      if(string == "" || string == null || string == undefined) return msg.channel.createMessage("Nothing to analyze!");
      translate(string).then((res)=>{
        return msg.channel.createMessage({embed: {color:0xFFFFFF, fields: [{ name: "Detected Language", value: lang[res.from.language.iso] }] } })
      }).catch(err => { console.error(err) });
    }
  }
}
