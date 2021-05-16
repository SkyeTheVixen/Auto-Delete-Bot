const {Client} = require('discord.js');
const client = new Client();
require('dotenv').config();

// process.on('unhandledRejection', async () =>{
//     console.log("error with promise");
// });
client.on('ready', async () =>{
    await console.log(`${client.user.username} AD: Ready`);
});
    
client.on('message', async (message) =>{
    //General
    if(message.channel.name.toLowerCase().includes("auto-delete")){
        await message.delete({timeout: 6000}).catch(async error => {
            await console.log("Error: Message Not available to delete!")
        });
    } 
})


client.login(process.env.Token);