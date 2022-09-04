require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const intents = new Intents().add('GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_BANS', 'GUILD_INTEGRATIONS', 'GUILD_INVITES', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_VOICE_STATES', 'GUILD_WEBHOOKS', 'DIRECT_MESSAGE_REACTIONS', 'GUILD_MESSAGE_REACTIONS');
const client = new Client({intents: [intents], partials: ["CHANNEL", "USER", "GUILD_MEMBER", "MESSAGE", "REACTION"], presence: {status: 'online', activity: {name: 'My Sister Servers', type: 'WATCHING'}}});
const fs = require('fs');

client.adChannels = new Collection();

var channels = fs.readFileSync('channels.txt', 'utf8').split(",");
channels.shift();
for (channel of channels){
    if(!channel == ""){
        client.adChannels.set(channel, channel);
    }
}

client.on('ready', async () =>{
    await console.log(`${client.user.username} AD: Ready`);
});
    
client.on('messageCreate', async (message) => {
    if(client.adChannels.has(message.channel.id)){
        await setTimeout(() => {
            message.delete();
        }, 60000);
    } 
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    if(interaction.member.permissions.has('MANAGE_CHANNELS')){
        if (interaction.commandName === 'addchannel') {
            const channel = interaction.options.getChannel('channel');
            if (client.adChannels.has(channel.id)){
                await interaction.reply(`Channel ${channel} is already in the list!`);
            } else {
                await interaction.reply(`Channel ${channel} has been added to the list! Please remember to grant it MANAGE_MESSAGES permissions and VIEW_CHANNEL permissions!`);
                client.adChannels.set(channel.id, channel.id);
                fs.appendFileSync('channels.txt', "," + channel.id);
            }
        }
        else if(interaction.commandName === 'removechannel'){
            const channel = interaction.options.getChannel('channel');
            if (client.adChannels.has(channel.id)){
                await interaction.reply(`Channel ${channel} has been removed from the list! Please remember to remove its MANAGE_MESSAGES permissions and VIEW_CHANNEL permissions!`);
                client.adChannels.delete(channel.id);
                var channels = fs.readFileSync('channels.txt', 'utf8').split(",");
                var index = channels.indexOf(channel.id);
                if (index > -1) {
                    channels.splice(index, 1);
                }
                fs.writeFileSync('channels.txt', channels.join(","));
            } else {
                await interaction.reply(`Channel ${channel} is not in the list!`);
            }
        }
        else if(interaction.commandName === 'listchannels'){
            var channels = fs.readFileSync('channels.txt', 'utf8').split(",");
            var reply = "Channels: ";
            for (var i = 0; i < client.adChannels.size; i++){
                reply += `<#${client.adChannels.at(i)}>, `;
            }
            await interaction.reply(reply);
        }
    }
    else{
        await interaction.reply("Sorry, you dont have permission to perform this action");
    }
});

client.on('channelDelete', async (channel) => {
    if (client.adChannels.has(channel.id)){
        client.adChannels.delete(channel.id);
        var channels = fs.readFileSync('channels.txt', 'utf8').split(",");
        var index = channels.indexOf(channel.id);
        if (index > -1) {
            channels.splice(index, 1);
        }   
        fs.writeFileSync('channels.txt', channels.join(","));
    }
});

client.on('unhandledRejection', error => {
});

client.login(process.env.Token);