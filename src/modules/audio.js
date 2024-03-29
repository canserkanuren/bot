const YoutubeStream = require('youtube-audio-stream');
const auth = require('../../config/auth.json');
const {google} = require('googleapis');
let youtube = google.youtube({
    version: 'v3',
    auth: auth.youtubeToken
});

module.exports = class Audio {
    static match(message) {
        return message.content.startsWith("!play");
    }

    static hasUrl(message) {
        return message.content.includes("https://");
    }

    static playFromUrl(message) {
        let args = message.content.split(" ");
        let voiceChannel = this.currentChannel(message);

        if (args[1]) {
            voiceChannel
                .join()
                .then(connection => {
                    try {
                        message.channel.send({
                            embed: {
                                title: ":fast_forward: Now Playing :" + message.embeds[0].title,
                                color: 3447003,
                                description: message.embeds[0].description
                            }
                        })
                        let stream = YoutubeStream(args[1]);
                        connection.playStream(stream).on('end', () => {
                            // connection.disconnect();
                        })
                    } catch (e) {
                        message.channel.send("WOLA YA EU UN PROBLEME JSE PO C KOA");
                        console.log(e);
                    }
                })
        } else {
            message.channel.send("ENCULE DTA MERE T'AS PAS RENTRE D'URL DE VIDEO OU WOLA TU SAIS PAS ECRIRE");
            console.log("No url has been given to me");
        }
    }

    static playFromWords(message) {
        let args = message.content.split(" ");
        
        let query = "";
        args.splice(0,1);
        args.forEach(arg => {
            query += arg + " ";
        })

        this.searchVideoFromYoutube(query).then(data => {
            let videoUrl = "https://www.youtube.com/watch?v=" + data.id.videoId;
            let voiceChannel = this.currentChannel(message);
            if (videoUrl) {
                if(message.author.username != "music-bot") {
                    voiceChannel
                        .join()
                        .then(connection => {
                            try {
                                message.channel.send(":fast_forward: Now Playing : " + data.snippet.title);
                                let stream = YoutubeStream(videoUrl);
                                connection.playStream(stream).on('end', () => {
                                    // connection.disconnect();
                                })
                            } catch (e) {
                                message.channel.send("WOLA YA EU UN PROBLEME JSE PO C KOA");
                                console.log(e);
                            }
                        })
                }
            } else {
                message.channel.send("ENCULE DTA MERE T'AS PAS RENTRE D'URL DE VIDEO OU WOLA TU SAIS PAS ECRIRE");
                console.log("No url has been given to me");
            }
        }, err => {
            message.channel.send(err);
        })
    }

    static searchVideoFromYoutube(videoName) {
        return new Promise((resolve, reject) => {
            youtube.search.list({
                part: 'snippet',
                q: videoName
            }, (err, data) => {
                if (err) {
                    reject("WOLA LA VIDEO EST PAS DISPO");
                }
                if (data) {
                    resolve(data.data.items[0]);
                }
            });
        })
    }

    static currentChannel(message) {
        let channels = message.guild.channels.filter(channel => { return channel.type == 'voice' });

        let messageAuthor = message.author;
        let voiceChannel = null;
        channels.forEach(channel => {
            channel.members.forEach(member => {
                if (member.user.id == messageAuthor.id) {
                    voiceChannel = channel;
                }
            })
        })
        return voiceChannel;
    }
}