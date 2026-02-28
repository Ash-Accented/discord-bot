//Joins voice channel

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); //Permits slash commands 
const { joinVoiceChannel, createAudioPlayer, createAudioResource, voiceConnection, AudioPlayerStatus  } = require('@discordjs/voice'); //Necessary for audio functionality
const { userMention } = require('@discordjs/formatters');
const path = require('path'); 
const fs = require('fs');
const queue = new Map();



async function playSong(guild, track, audioDirectoryString, interaction) {
  const filteredLastPart = path.basename(audioDirectoryString);
  interaction.channel.send({
    content: `<@${interaction.member.user.id}>`,
    embeds: [new EmbedBuilder()
      .setDescription(`**${track}**`)
      .setTitle(`\n***CURRENT TRACK:***`)
      .setAuthor({
        name: interaction.member.user.displayName,
        iconURL: interaction.member.user.displayAvatarURL(),
      })
      .addFields({ name: `***\nALBUM: ***`, value: `**${filteredLastPart}**`, inline: true })
      .addFields({ name: `***\nLOCAL_DIRECTORY: ***`, value: `**${audioDirectoryString}**`, inline: true })
      .addFields({ name: `***\nVOICE_CHANNEL: ***`, value: `**${interaction.member.voice.channel}**`, inline: true })

      .setColor(0xcec1e6),
    ],
  }); 

  const serverQueue = queue.get(guild.id);        //Tracks the mapping of songs for the server as a queue
  if(!track){
      serverQueue.voiceChannel.destroy();
      queue.delete(guild.id);
      return;
  }
  try {
    const resource = createAudioResource(path.join(audioDirectoryString, track));
    await serverQueue.player.play(resource);
    serverQueue.playing = true;
  } catch (error) {
    console.log(`ERROR WHEN PLAYING RESOURCE: ${error}`);
  }
  
  serverQueue.player.removeAllListeners(AudioPlayerStatus.Idle);
  serverQueue.player.removeAllListeners('error');

  serverQueue.player.on(AudioPlayerStatus.Playing, async () => {
     console.log(`The audio player has started playing! ${track} `);       //Audio player confirmation
  });
  

  serverQueue.player.on(AudioPlayerStatus.Idle, async () => {
    await serverQueue.songs.shift();
    if (serverQueue.songs.length > 0){
      await playSong(guild, serverQueue.songs[0], audioDirectoryString, interaction);
    }
  });
  
  serverQueue.player.on('error', error => {
      console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
  }); 
}
//PLAYSONG FUNCTION 


//DATA PROPERTY AND EXECUTE FUNCTION 
module.exports = {
  data: new SlashCommandBuilder()       //Creation of a new SlashCommandBuilder
    .setName('play_local_directory')       //Command Name (/play_local_audio_file)
    .setDescription('Play locally stored playlist from your computer in VC')        //Desc 
    .addStringOption(option =>        //Adding a string argument that records the local path to audio file
      option.setName('local_directory')       //Set the custom name of option to 'local_file_path'
        .setDescription('The local directory of your audio files')       //Provide description of command in SlashCommandMenu
        .setRequired(true)      //Make the string argument named 'local_file_path' required for execution of the command
    ),
  async execute(interaction) {
    const audioDirectoryString = interaction.options.getString('local_directory');        //Playlist directory text
    const filteredLastPart = path.basename(audioDirectoryString);
    interaction.reply(`***NEW ALBUM INSERTED TO QUEUE: *** **${filteredLastPart}**`);



    const audioDirectory = fs.readdirSync(audioDirectoryString);     //Reading all files in directory and setting it as one object
    const audioFiles = audioDirectory.filter(audioFile => 
      ['.mp3', '.wav', '.flac'].includes(path.extname(audioFile))
    );

    audioFiles.forEach(song => console.log(song));
    let serverQueue = queue.get(interaction.guild.id);
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (!serverQueue) {
      
      //Generate the construct holding all of the songs added IF the serverQueue is not already defined 
      const queueConstruct = {
        textChannel: interaction.channel,
        voiceChannel: null,
        connection: null,
        songs: audioFiles,        //List/Array
        player: createAudioPlayer(),
        volume: 1,
        playing: false,
        playlist: audioDirectoryString.split
      };
      
      queue.set(interaction.guild.id, queueConstruct);        //Setting up the map for the guild id, and the queueConstruct
      const channel = interaction.member.voice.channel;       //Get the channel of the member in the server issuing the command 
      queueConstruct.voiceChannel = channel;          //Set the channel property for the queueConstruct
      guild = interaction.guild;

      const connection = joinVoiceChannel({       //Creates a VoiceConnection to a Discord voice channel
        channelId: channel.id,      //Get the specific channel id using the .id property of a channel object
        guildId: channel.guild.id,      //Standard way to retrieve the unique identifier of a Discord server (guild) from a guildchannel object
        adapterCreator: channel.guild.voiceAdapterCreator,      //Required property in discord.js v13+ to join voice channels, enables the bot to connect to voi 
        selfMute: false,        //Mute set to false
        selfDeaf: true,         //Deafen set to true
      });
      
      queueConstruct.connection = connection;         //Set the connection of the queueConstruct to connection
      connection.subscribe(queueConstruct.player);       //This links the audio player to the specific voice channel (specified above with joinVoiceChannel), so that audio can be transmitted to all users within that channel
      //const memberNickname = interaction.member.user.displayName;       //Get username of server member issuing command (nickname if exists, otherwise username)
      
      //const serverQueue = queue.get(interaction.guild.id);        //Tracks the mapping of songs for the server as a queue
      playSong(guild, queueConstruct.songs[0], audioDirectoryString, interaction);
      
    }
    else {
      audioFiles.forEach(audioFile => serverQueue.songs.set(audioFiles));
      return interaction.channel.send(`Playlist Added! \n\nLength: ${audioDirectory.length}`);
    }
    
    
    
    

    
    
    

    
  },
};
