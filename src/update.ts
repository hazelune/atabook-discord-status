import { isCancel, cancel, confirm, select, text } from '@clack/prompts';
import Conf from 'conf';
import type { StatusChangeArgs } from './interfaces.mts';
import { setConfigJson } from './atabook-scraper.mts';

export async function main() {
	const config = new Conf({ projectName: 'atabook-discord-status' });

	let discordTokenInput = config.get("discordAuthToken");
	let urlInput = config.get("ataUrl");
	let textQuestionInput = config.get("statusTextQuestion");
	let emojiQuestionInput = config.get("statusEmojiQuestion");

	const updatedConf: StatusChangeArgs = {
		discordToken: discordTokenInput,
		atabookUrl: urlInput,
		textQuestion: textQuestionInput,
		emojiQuestion: emojiQuestionInput 
	}

	while (true) {
		const updateChoice = await select({
			message: 'What would you like to update?',
			options: [
				{ value: 'url', label: 'Atabook URL' },
				{ value: 'text', label: 'Text question' },
				{ value: 'emoji', label: 'Emoji question' },
				{ value: 'auth', label: 'Discord auth token' },
				{ value: 'exit', label: 'Exit setup' }
			]
		})
		if (isCancel(updateChoice)) {
			cancel('Ending update without saving.');
			process.exit(0);
		} else if (updateChoice === 'url') {
			urlInput = await text({
				message: 'Input the link to your Atabook page:',
				validate(value) {
					if (!value.trim().endsWith('.atabook.org') || value === undefined) return `Not a valid link.`
				},
			});
			if (isCancel(urlInput)) {
				cancel('Ending update without saving.');
				process.exit(0);
			}
			updatedConf.atabookUrl = urlInput.trim();
		} else if (updateChoice === 'text') {
			textQuestionInput = "";
			const textChange = await confirm({
				message: "Would you like others to be able to change your status's text?"
			});
			if (isCancel(textChange)) {
				cancel('Ending update without saving.');
				process.exit(0);
			}
			if (textChange) {
				textQuestionInput = await text({
					message: "Input the question of your Atabook that should alter your status's text:",
					validate(value) {
						if (value === undefined) return `Not a valid input.`
					},
				});
				if (isCancel(textQuestionInput)) {
					cancel('Ending update without saving.');
					process.exit(0);
				}
			}
			updatedConf.textQuestion = textQuestionInput.trim();
		} else if (updateChoice === 'emoji') {
			emojiQuestionInput = "";
			const emojiChange = await confirm({
				message: "Would you like others to be able to change your status's emoji?"
			});
			if (isCancel(emojiChange)) {
				cancel('Ending update without saving.');
				process.exit(0);
			}
			if (emojiChange) {
				emojiQuestionInput = await text({
					message: "Input the question of your Atabook that should alter your status's emoji:",
					validate(value) {
						if (value === undefined) return `Not a valid input.`
					},
				});
				if (isCancel(emojiQuestionInput)) {
					cancel('Ending update without saving.');
					process.exit(0);
				}
			}
			updatedConf.emojiQuestion = emojiQuestionInput.trim();
		} else if (updateChoice === 'auth') {
			discordTokenInput = await text({
				message: 'Input your Discord authentification token:',
				validate(value) {
					if (value === undefined) return `Not a valid input.`
				},
			});
			if (isCancel(discordTokenInput)) {
				cancel('Ending update without saving.');
				process.exit(0);
			}
			updatedConf.discordToken = discordTokenInput.trim();
		} else {
			const saveChanges = await confirm({
				message: "Would you like to save your changes?"
			});
			if (isCancel(saveChanges)) {
				cancel('Ending update without saving.');
				process.exit(0);
			}
			if (saveChanges) {
				config.set('discordAuthToken', updatedConf.discordToken);
				config.set("ataUrl", updatedConf.atabookUrl);
				config.set("statusTextQuestion", updatedConf.textQuestion);
				config.set("statusEmojiQuestion", updatedConf.emojiQuestion);
				const getRecentMsg = {
					url: updatedConf.atabookUrl,
					n: 1,
					tq: updatedConf.textQuestion,
					eq: updatedConf.emojiQuestion,
					verbose: true 
				};
				await setConfigJson(getRecentMsg);
			}
			process.exit(0);
		}
	}
}
