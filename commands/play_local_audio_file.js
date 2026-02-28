//Joins voice channel

const { SlashCommandBuilder } = require('discord.js'); //Permits slash commands 
const { joinVoiceChannel, createAudioPlayer, createAudioResource, voiceConnection, AudioPlayerStatus  } = require('@discordjs/voice'); //Necessary for audio functionality
const { join } = require('path'); 
module.exports = {
  data: new SlashCommandBuilder()       //Creation of a new SlashCommandBuilder
    .setName('play_local_audio_file')       //Command Name (/play_local_audio_file)
    .setDescription('Play locally downloaded audio from your computer into VC')        //Desc 
    .addStringOption(option =>        //Adding a string argument that records the local path to audio file
      option.setName('local_file_path')       //Set the custom name of option to 'local_file_path'
        .setDescription('The local file path of your audio file')       //Provide description of command in SlashCommandMenu
        .setRequired(true)      //Make the string argument named 'local_file_path' required for execution of the command
    ),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;       //Get the channel of the member in the server issuing the command 
    console.log(`Attempting to join voice channel...`);       //Log of attempt
    const connection = joinVoiceChannel({       //Creates a VoiceConnection to a Discord voice channel
      channelId: channel.id,      //Get the specific channel id using the .id property of a channel object
      guildId: channel.guild.id,      //Standard way to retrieve the unique identifier of a Discord server (guild) from a guildchannel object
      adapterCreator: channel.guild.voiceAdapterCreator,      //Required property in discord.js v13+ to join voice channels, enables the bot to connect to voi 
      selfMute: false,        //Mute set to false
      selfDeaf: true,         //Deafen set to true
    
    });
    const input = interaction.options.getString('local_file_path');        //This is the conversion of the user input of a local file path, to a string that can be made into an audio resource
    const player = createAudioPlayer();       //This is the audio player, which is designed to load, decode and play audio files within discord vc. I create one here for the discord bot to use
    const resource = createAudioResource(`${input}`);       //This is the audio resource itself, or we can say it is the file that will be played by the bot. It takes the first argument as the file path

    player.play(resource);        //This plays the audio file(audioResource) with the audioPlayer we have created
    connection.subscribe(player);       //This links the audio player to the specific voice channel (specified above with joinVoiceChannel), so that audio can be transmitted to all users within that channel
    
    const mentionNickname = interaction.member.user.id;       //Gets the id of the user for the sake of pinging them
    //const memberNickname = interaction.member.user.displayName;       //Get username of server member issuing command (nickname if exists, otherwise username)
    interaction.channel.send(`*Joined voice channel ==>* **${channel.name}** \n\n*User ==>* <@${mentionNickname}> \n\n*Local Directory ==>* **${input}**`);       //Sends reply to person of details
    player.on(AudioPlayerStatus.Playing, () => {
      console.log('The audio player has started playing!');       //Audio player confirmation
    });

    player.on('error', error => {
      console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    }); 
  },
};
