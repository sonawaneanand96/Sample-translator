module.exports = {
    command:"channel",
    execute:async function(bot, msg, args, counts, conn){
        let manageChannels = msg.channel.permissionsOf(bot.user.id).has('manageChannels') && msg.channel.permissionsOf(msg.author.id).has('manageChannels');
        if(!manageChannels) return msg.channel.createMessage('Either you or the bot does not have the manageChannels permission');
        if(!args[0] || !args[1]) return msg.channel.createMessage('You need to type in some language ISOs to set the languages.')
        conn.table('channels')
        .insert({
            channelID: msg.channel.id,
            firstLang: args[0],
            secondLang: args[1]
        })
        .run()
        .then(function(res) {
            msg.channel.createMessage(`Successfully setup the automatic translation channel!`);
        })
        .error(function(e) {
            msg.channel.createMessage(`An error occurred\n${e}`);
        })
    }
}      