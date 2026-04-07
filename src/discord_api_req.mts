import { isEqual } from 'lodash-es';
import { getAtabookStatus } from './atabook-scraper.mts';
import Conf from 'conf';
import 'discord-emoji-converter';

function randomDelay(s: number) {
	const time = s + (Math.random() * 10);
	console.log(`Checking again in ${Math.round(time)} seconds.`)
	return new Promise(resolve => setTimeout(resolve, time*1000));
}

const USER_URL = "https://discord.com/api/v10/users/@me/settings"

interface StatusChangeArguments {
	discordToken: string,
	atabookUrl: string,
	textQuestion?: string,
	emojiQuestion?: string
}

export async function statusChange({discordToken, atabookUrl, textQuestion = "", emojiQuestion = ""}: StatusChangeArguments) {
	// save the original most recent message and catch deviations from it
	const config = new Conf({ projectName: 'atabook-discord-status' });
	let oldStatusJson = {
		submitter: config.get("recentMsg.submitter"),
		time: config.get("recentMsg.time"),
		statusText: config.get("recentMsg.statusText"),
		statusEmoji: config.get("recentMsg.statusEmoji"),
		message: config.get("recentMsg.message")
	}
	while (true) {
		const newStatusJson = await getAtabookStatus({
			url: atabookUrl,
			n: 1,
			tq: textQuestion,
			eq: emojiQuestion
		});
		if (Array.isArray(newStatusJson)) {
			console.error("Atabook scraper output multiple messages. Unexpected output of this.");
			return;
		}
		if (newStatusJson !== undefined && !isEqual(newStatusJson, oldStatusJson)) {
			if (newStatusJson.statusEmoji !== "" && newStatusJson.statusText !== "") {
				console.log(`Changing status to "${newStatusJson.statusEmoji} ${newStatusJson.statusText}" at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.`);
			} else if (newStatusJson.statusEmoji !== "" && newStatusJson.statusText === "") {
				console.log(`Changing status emoji to "${newStatusJson.statusEmoji}" at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.`);
			} else if (newStatusJson.statusEmoji === "" && newStatusJson.statusText !== "") {
				console.log(`Changing status text to "${newStatusJson.statusText}" at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.`);
			} else {
				console.log("No messages yet.");	
			}

			// deep copies to update what the previous newest message is
			oldStatusJson = JSON.parse(JSON.stringify(newStatusJson));
			const payloadJson = {
				"custom_status": {
				}
			}
			if (newStatusJson.statusText !== "") {
				payloadJson.custom_status.text = newStatusJson.statusText;
			}
			if (newStatusJson.statusEmoji !== "") {
				// let emojiStr = newStatusJson.statusEmoji;

				payloadJson.custom_status.emoji_name = newStatusJson.statusEmoji;
			}
			const payloadStr = JSON.stringify(payloadJson);
			await fetch(USER_URL, {
				method: 'PATCH',
				headers: {
					'Authorization': discordToken,
					'Content-Type': 'application/json',
					'Host': 'discord.com',
					'Origin': 'https://discord.com',
					'Referer': 'https://discord.com',
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv146.0) Gecko/20100101 Firefox/146.0',
				},
				body: payloadStr,
			});
			console.log(`Setting config file to hold most recent message of ${JSON.stringify(newStatusJson)}`);
			config.set("recentMsg", newStatusJson); 
		}
		else {
			console.log(`No status updates at ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}.`);
		}
		await randomDelay(20);
	}
}
