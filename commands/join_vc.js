//Joins voice channel

const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
module.exports = {
  data: new SlashCommandBuilder().setName('joinvc').setDescription('Joins your voice channel!'),
  async execute(interaction) {
    const channel = interaction.member.voice.channel; 

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: true,

    });
    console.log(`Attempting to join voice channel...`);
    console.log(`Bot joined voice channel: ${channel.name}`);
    interaction.channel.send(`*Joined voice channel*: **${channel.name}**`); 
    
  },
};
