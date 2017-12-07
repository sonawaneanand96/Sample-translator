const translate = require('google-translate-api'),
      G = require('gizoogle'),
      tlcfg = require('./../tlcfg.json'),
      YodaSpeak = require('yoda-speak'),
      yoda = new YodaSpeak(tlcfg.yoda),
      zalgo = require('to-zalgo'),
      flip = require('flipout'),
      kpop = require('kpop'),
      lang = require('./../langs.json'),
      japanese = require('japanese');

module.exports = {
  execute:async function(bot, msg, args, command, cmdCounts){
    var thingToTranslate = args.join(" ");
    switch(command){
      case "korean": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_kr:');
      case "arabic": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_sa:');
      case "afrikaans": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_za:');
      case "albanian": return translateFunction("sq", thingToTranslate, ':flag_al:');
      case "armenian": return translateFunction("hy", thingToTranslate, ':flag_am:');
      case "azerbaijani": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_az:');
      case "basque": return translateFunction("eu", thingToTranslate, ':flag_fr:');
      case "belarusian": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_by:');
      case "bengali": return translateFunction("bn", thingToTranslate, ':flag_bd:');
      case "bosnian": return translateFunction("bs", thingToTranslate, ':flag_ba:');
      case "bulgarian": return translateFunction("bg", thingToTranslate, ':flag_bg:');
      case "catalan": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_ad:');
      case "cebuano": return translateFunction(command.substring(0, 3), thingToTranslate, ':flag_ph:');
      case "chichewa": return translateFunction("ny", thingToTranslate, ':flag_zw:');
      case "chinese-simplified": return translateFunction("zh-cn", thingToTranslate, ':flag_cn:');
      case "chinese-traditional": return translateFunction("zh-tw", thingToTranslate, ':flag_cn:');
      case "corsican": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_it:');
      case "croatian": return translateFunction("hr", thingToTranslate, ':flag_hr:');
      case "czech": return translateFunction("cs", thingToTranslate, ':flag_cz:');
      case "danish": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_dk:');
      case "dutch": return translateFunction("nl", thingToTranslate, ':flag_nl:');
      case "english": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_um:');
      case "esperanto": return translateFunction("eo", thingToTranslate, ':flag_hu:');
      case "estonian": return translateFunction("et", thingToTranslate, ':flag_ee:');
      case "filipino": return translateFunction("tl", thingToTranslate, ':flag_ph:');
      case "finnish": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_fi:');
      case "french": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_fr:');
      case "frisian": return translateFunction("fy", thingToTranslate, ':flag_nl:');
      case "galician": return translateFunction("gl", thingToTranslate, ':flag_ea:');
      case "georgian": return translateFunction("ka", thingToTranslate, ':flag_ge:');
      case "german": return translateFunction("de", thingToTranslate, ':flag_de:');
      case "greek": return translateFunction("el", thingToTranslate, ':flag_gr:');
      case "gujarati": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_in:');
      case "haitian": return translateFunction("ht", thingToTranslate, ':flag_ht:');
      case "hausa": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_ne:');
      case "hawaiian": return translateFunction(command.substring(0, 3), thingToTranslate, ':flag_um:');
      case "hebrew": return translateFunction("iw", thingToTranslate, ':flag_il:');
      case "hindi": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_in:');
      case "hmong": return translateFunction("hmn", thingToTranslate, ':flag_cn:');
      case "hungarian": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_hu:');
      case "icelandic": return translateFunction("is", thingToTranslate, ':flag_is:');
      case "igbo": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_ng:');
      case "indonesian": return translateFunction("id", thingToTranslate, ':flag_id:');
      case "irish": return translateFunction("ga", thingToTranslate, ':flag_ie:');
      case "italian": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_it:');
      case "japanese": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_jp:');
      case "javanese": return translateFunction("jw", thingToTranslate, ':flag_id:');
      case "kannada": return translateFunction("kn", thingToTranslate, ':flag_in:');
      case "kazakh": return translateFunction("kk", thingToTranslate, ':flag_kz:');
      case "khmer": return translateFunction("km", thingToTranslate, ':flag_kh:');
      case "kurdish": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_tr:');
      case "kyrgyz": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_cn:');
      case "lao": return translateFunction("lo", thingToTranslate, ':flag_la:');
      case "latin": return translateFunction(command.substring(0, 2), thingToTranslate, ':flag_va:');
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

      // DETECT LANGUAGE
      case "lang": return languageDetection(thingToTranslate);

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
            return msg.channel.createMessage({embed: {color:0xFFFFFF, fields: [{ name: 'Detected Language', value: lang[res.from.language.iso] }] } })
        }).catch(err => { console.error(err) });
    }
  }
}
