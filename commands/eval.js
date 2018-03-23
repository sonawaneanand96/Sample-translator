const { inspect } = require("util")

module.exports = {
  command: "eval",
  execute: async (bot, msg, args, conn) => {
    let devs = ["205912295837138944", "286166184402092042"]
    let result
    let input = args.join(" ")
    if (!devs.includes(msg.author.id)) return
    try {
      result = eval(`((m, a) => { ${(args[0] === "return") ? input : "return " + input} })(msg, args)`)
      if (typeof result !== "string") {
        result = inspect(result)
      }
    } catch (err) {
      result = err.message;
    }
    return await msg.channel.createMessage({embed:{
      color: 0x7188d9,
      fields: [
        {
          name: "📥 Input",
          value: "```JS\n" + input + "\n```"
        },
        {
          name: "📤 Result",
          value: "```JS\n" + result.substr(0, 1000) + "\n```"
        }
      ]
    }})
  }
}
