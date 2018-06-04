const YoutubeStream = require('youtube-audio-stream');

module.exports = class Audio {
    static match(message) {
        return message.content.startsWith("!play");
    }
    
    static play(message) {
        let voiceChannel = message.guild.channels.filter(channel => {return channel.type == 'voice';}).first();
    
        let authorChannel = null;
        let args = message.content.split(" ");
        
        voiceChannel
            .join()
            .then(connection => {
                try {
                    let stream = YoutubeStream(args[1]);
                    connection.playStream(stream).on('end', () => {
                        connection.disconnect();
                    })
                } catch (e) {
                    message.reply("NTM TA VIDEO EST PAS DISPO");
                }
            })
    }
}