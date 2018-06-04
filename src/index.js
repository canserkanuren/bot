const Discord = require('discord.js');
const Audio = require('./modules/audio');
const auth = require('../config/auth');

const bot = new Discord.Client();

bot.on("ready", () => {
    console.log("Connecté");
})

bot.on("message", message => {
    if(Audio.match(message)) {
        Audio.play(message);
    }
})

bot.login(auth.token);