# doomBotOS
#### An earnest attempt at programming a discord bot, capable of running an emulated version of doom live in a text-channel/VC channel.[^1]
[^1]: PS: Also does other things I required for utility, like simple music commands for personal reasons.





## CHECKLIST:
##### - [x] Make own version of remoteDiscordShell https://github.com/EnriqueMoran/remoteDiscordShell, allowing me to run commands from a discord channel => Bot => Host Machine 
  ##### - Made /bash_command capable of running commands and returning the stdout

##### - [x] Run the discord bot from a docker container that has capability to run doom on an emulator.

##### - [ ] \(Optional) Make a slash command driven 'text editor' for the discord bot that allows for file editing from a discord channel
#####  - At the present moment, nano, vi, and other text editors don't work from the channel. My idea was using shell commands that the virtual machine can execute, with discord slash commands that map to bash commands for a barebones, makeshift text-editor capable of applying changes to files via a discord channel.
#####    - This wouldn't be necessary to run doom on a discord bot, however being able to operate your docker container from a discord channel without ANY external assistance would be amusing, despite the impracticality.


## USAGE
```
/bash_command [string_args]
/ping
/play_local_directory [local_directory_string]
/play_local_audio_file [local_file_path_string]
```

###COMMANDS

/bash_command *[string_args]* 
> <sub>//Executes a bash_command on a virtual machine in docker running alpine:v3.23 (where the bot currently runs), was thinking to modify this to execute the command from the host machine, and return the standard output of the virtual machine.</sub>



/ping
> <sub>//Delivers the messaging ping of the bot</sub>



### ***(REQUIRES HOSTING A UNIQUE BOT, RUNNING CODE CLONED FROM MY GITHUB, ON YOUR MACHINE)***
/play_local_directory *[local_directory_string]*
> <sub>//Plays the mp3, wav, or flac files in a local directory of choice, as if it were a playlist.</sub>

/play_local_audio_file *[local_file_path_string]*
> <sub>//Plays a mp3, wav, or flac file in a local directory of choice.</sub>










