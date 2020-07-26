# Idle miner bot created by CerealKillahh#8026
This program is made for the Idle Miner Discord bot:
https://top.gg/bot/518759221098053634

You can find what Idle Miner does on the website above.

This program i wrote will automatically do several commands every few minutes;
- ;sell => every 120-170 seconds
- ;fish => every 312 seconds
- ;hunt => every 312 seconds
- ;quiz (and will answer the quiz question) => every 312 seconds
- ;claimall (daily/hourly kits) => every hour
- ;open all (open crates received from fishing and opening kits) => every hour

The program uses the npm package `Puppeteer`. This allows us to log in to discord, read everything from the page and type stuff on the discordapp.

# Installation
- Download and install NodeJs https://nodejs.org/en/

- Open up cmd/terminal/powershell and clone this repository

    `$ git clone https://github.com/cerealkillahh/idleminerbot.git`

- Install dependencies

    `$ npm install`

- Create a file called `.env` inside the idleminerbot folder.
- Put the following things in it:
```
EMAIL="YOUR_DISCORD@EMAIL"

PASSWORD="YOUR_DISCORD_PASSWORD"

CHANNELURL="THE URL TO THE SERVER/CHANNEL U WANT TO USE THE IDLE MINER BOT COMMANDS IN"
```

The channelurl can be found by opening the channel you want to use the bot commands in in a browser. 
The url at the top will be the one you need to enter.

Example url: https://discord.com/channels/518774827360976896/540643915137548321

- Run `bot.js` by typing:
    `$ node .\bot.js`
    
- If you want to run the bot on the background you can run it with `mp2 start bot`
  and then close your terminal. If you want to stop the bot you open your terminal again and type `mp2 stop bot`.
  
# Disclaimer
This program is free to use but keep in mind that this can be qualified as a `Discord self bot` which is not allowed.

I'm not sure if the developers of the Idle Miner Discord Bot allow automating/botting so use this at your own risk.
