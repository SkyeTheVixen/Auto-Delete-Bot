const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Routes } = require('discord-api-types/v10');
require('dotenv').config();

const commands = [
	new SlashCommandBuilder().setName("addchannel").setDescription("Add a channel for flashie to autodelete from").addChannelOption(option => option.setName("channel").setDescription("The channel to add").setRequired(true)),
	new SlashCommandBuilder().setName("listchannels").setDescription("List All Channels"),
	new SlashCommandBuilder().setName("removechannel").setDescription("Remove a channel from flashie").addChannelOption(option => option.setName("channel").setDescription("The channel to remove").setRequired(true)),

]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.token);

rest.put(Routes.applicationCommands("814457419891081217"), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);