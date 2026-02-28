//
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { spawn } = require('node:child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');


async function runCommand (commandString, argsCmd, interaction) {
    

  const commandChildProcess = spawn (
    `${commandString}`, [`${argsCmd}`],
    {
      shell: true,
    }
  );
  
  commandChildProcess.stdout.on('data', (data) => {
    data = String(data);        //Change object type of 'data' from "object" --> "String"
    let i = 0;
    let j = (data.length <= 2000) ? data.length - 1 : 1900;
    if (j == data.length - 1) {
      interaction.channel.send(`${data}`);
    }
    else {
      while (j <= data.length - 1) {
        let dataChunk = data.substring(i, j);
        interaction.channel.send(`${dataChunk}`);
      
        if (j == (data.length - 1)) {   //if j is at its last possible position
          break;
        }

        i = ((i + 1900) > data.length) ? data.length - 1 : i + 1900;
        j = ((j + 1900) > data.length) ? data.length - 1 : j + 1900;
      }
    }

  });

  commandChildProcess.stderr.on('data', (data) => {
    interaction.channel.send(`stderr: ${data}`);
  });

  commandChildProcess.on('close', (code) => {
    interaction.channel.send(`child process exited with code ${code}`);
  });



}


module.exports = {
  data: new SlashCommandBuilder()
    .setName('bash_command')
    .setDescription('Run a bash command from a discord channel of choice')
    .addStringOption(option =>
      option.setName('command_string')
        .setDescription('The command of your choice')
        .setRequired(true) 
    )
    .addStringOption(option =>
      option.setName('args')
        .setDescription('The flags you wish to use')
        .setRequired(false)
    ),
  async execute(interaction) {






    const commandString = interaction.options.getString(`command_string`);
    const argsCmd = interaction.options.getString(`args`);

    interaction.channel.send({
      content: `<@${interaction.member.user.id}>`,
      embeds: [new EmbedBuilder()
        .setDescription(`**${commandString} ${argsCmd}**`)
        .setTitle(`\n***COMMAND:***`)
        .setAuthor({
          name: interaction.member.user.displayName,
          iconURL: interaction.member.user.displayAvatarURL(),
        })
        .setColor(0xcec1e6),
      ],
    }); 

    

    runCommand(commandString, argsCmd, interaction);
    interaction.reply(`***RUNNING COMMAND *** **${commandString}**`);
  },
    
};
