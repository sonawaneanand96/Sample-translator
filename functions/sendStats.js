const request = require("superagent") 
const config = require("./../tlcfg.json")
const dbotspwToken = config.dbotspw
const dbotsToken = config.dbots
module.exports = {
  send:async (guildSize, shardSize) => {
    if(guildSize == null || shardSize == null) return;
    request.post(`https://discordbots.org/api/bots/318554710929833986/stats`)
    .set("Authorization", dbotsToken)
    .send({ server_count: guildSize, shard_count: shardSize })
    .end((err, res) => {
      err ? console.log(`ERROR SENDING STATS TO BOTS.DISCORD.PW: ${err}`) : console.log(`Successfully sent stats to https://bots.discord.pw! Now at ${guildSize} servers!`)
    });
  }
}
