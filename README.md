# TheGCbot 
---
## Project Overview
---
A bot made with the Telegram API, used for automating and organizing tasks in group chats. This bot has features such as pinging everyone in the chat, storing addresses for users specific to the user that executed the command in a database, and adding/storing/fetching group events from a database. Made in Javascript with MongoDB.
## Features
---
### Commands
    /everyone
Pings every person in the chat.

    /pin 
Reply to a message with /pin to pin a message to the chat without needing to have the privileges.

    /catfact
Uses the [meowfacts API](https://github.com/wh-iterabb-it/meowfacts) to post a random cat fact in the current chat!

    /insult
Uses the [Evil insult API](https://evilinsult.com/) to generate and post a random insult in chat. Can be sent by itself for a message or it can be sent as a reply to a message in which case the bot will reply to the original

    /storeid
The telegram API offers no way to relate user_id to username so this command stores both a user's user_id and username in a database to be used with the upcoming commands

    //needs for both parties to have used /storeid
    /setaddress [username] [address]
A command that lets users individually store another users address. This command writes the setUser (user who issued the command) targetUser (person whose address is being stored) and address of the target user to a database to be pulled later with /address. This command cannot be used in public chats for protection of the target user's address.

    //user needs to have used /setaddress on the targetUser
    /address [username]

This command fetches the address of the targetUser from the database. All addresses are user specific so if User A stored an address for User C, User B could not execute /address User C to get User C's address. This command sends a message to the user via a bot dm to protect privacy

    // (beta) 
    /addevent [[name]] [[location]] [[date]] [desc]

This command add's an event to a database which then can be retrived with /events. Fields in [[]] have to be entered within parenthesis, for example if the name of the event is "Pizza party!" the user would have to execute /addevent [Pizza Party!]. The Date is best entered in the format mm/dd/yyyy hh:mm am/pm. 

    //(beta)
    /events [day/week/month/all]

Filters and lists every event within the given timeframe.