# Update Your Discord Status Through Atabook
## Description:
This command allows Discord a user to have themselves or others update their status through an [Atabook](https://atabook.org) guestbook of their making. Through setting up the package by inputting the link to their page, the questions that contain requests for status changes, and their Discord authentication token (all stored in a local config file), users can set this to run, updating your status as responses come in. 

Atabook allows the host of the guestbook to set a number of filtering options: blocking IPs, screening users on VPNs, blocking the use of certain words outright, and more. In addition to keeping a log of statuses (should you desire it), this also makes my job much easier. [Kicya.net](https://kicya.net) has done an excellent job with this guestbook site, as with their other projects. Substantial kudos to them.

## Usage:
First, create the guestbook on Atabook that you'd like to use to update your status, and include one question to indicate what emoji you'd like others to change your status's emoji to and one question for the text you'd like others to change your status's text to (later updates will allow this to be one question). Answers to these questions will be grabbed and used to update your discord status.

Next, download the release of this project for your system from the releases page; there are releases for Mac, Windows, and Linux, whether x64 or arm64. For Windows, this is just any old .exe; for Mac and Linux, these are binaries that will need to be run in the command line. 

**For Mac or Linux binaries:**
Open a terminal in the location the binary was downloaded to and run the following to enable execution permissions:
```
chmod +x atabook-status-[linux or mac]-[x64 or arm64]
```
Next, to setup the utility, run
```
./atabook-status-[linux or mac]-[x64 or arm64] setup
```
This will prompt you for the URL of your atabook page (e.g., https://hazelune.atabook.org), the questions you wish to scan for emoji or text answers (if you'd like either or both of these), and your Discord authentication token. To get your auth token, follow the instructions described [here](https://gist.github.com/MarvNC/e601f3603df22f36ebd3102c501116c6). All of this information is stored locally in a config file, which is located at:
- Linux: `~/.config/atabook-discord-status-nodejs`
- Mac: `~/Library/Preferences/atabook-discord-status-nodejs` 
- Windows: `%AppData%\atabook-discord-status-nodejs\Config`

To update any of this information later (whether you change URLs, questions, or your auth token updates via updating your Discord password), run
```
./atabook-status-[linux or mac]-[x64 or arm64] update
```
Upon running either the setup script or update script, the most recent answers to the questions you provided will also be stored locally. To start scanning for status updates, enter
```
./atabook-status-[linux or mac]-[x64 or arm64] start
```
If there is a response newer than the one stored at setup or update, your Discord status will be updated accordingly, and this updated status message will be stored instead. If the most recent answers to those questions are different from what the saved one is, it will be updated again, and so on. 

To stop the utility from running, you can either close the terminal or enter `Ctrl+C`.

## Note on Safety:
Users will note that, upon starting this tool, there will be periodic messages in the console indicating that it will check again in 20-30 seconds. This serves two purposes: first to lessen the load on Atabook, and second, to prevent the usage of this from being caught by Discord. The use of this utility falls under ["self-botting"](https://support.discord.com/hc/en-us/articles/115002192352-Automated-User-Accounts-Self-Bots), **which is against Discord's terms of service**. This is because self-botting can be incredibly harmful when done maliciously, often to spam or scam others. However, the enforcement of this tends to be non-existent provided it is not either being done maliciously or spamming Discord's servers. 

This utility works by mimicking the API request made by your Discord client when you update your status yourself; when a new status message is detected by the script, it sends something similar to what ordinary status changing looks like Discord's servers. Therefore, provided these requests are not being spammed dozens of times a minute, it is hardly visible that these requests are not being made in the ordinary way. This is not to say it is undetectable; however, it is difficult to detect and places virtually no additional load on Discord's server capacity. In actuality, unless you are getting a new status update request every 20-30 seconds, Discord will only receive a request to update your status every few minutes at most. Enforcement against uses of self-botting in this way is something I have not heard of, and I have used this tool at least a dozen times during testing and received no warning or ban. Caution is advised, however, and if you do receive a warning, I wouldn't recommend using it again.
