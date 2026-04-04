import { isCancel, cancel, confirm, outro, text } from '@clack/prompts';
import Conf from 'conf';
import type { StatusChangeArgs } from './interfaces.mts';

const config = new Conf({ projectName: 'atabook-discord-status' });

const urlInput = await text({
	message: 'Input the link to your Atabook page:',
	validate(value) {
		if (!value.trim().endsWith('.atabook.org')) return `Not a valid link.`
	},
});

if (isCancel(urlInput)) {
	cancel('Ending setup');
	process.exit(0);
}

let textQuestionInput = "";
let emojiQuestionInput = "";

const textChange = await confirm({
	message: "Would you like others to be able to change your status's text?"
});

if (isCancel(textChange)) {
	cancel('Ending setup');
	process.exit(0);
}

if (textChange) {
	textQuestionInput = await text({
		message: "Input the question of your Atabook that should alter your status's text:"
	});
	if (isCancel(textQuestionInput)) {
		cancel('Ending setup');
		process.exit(0);
	}
}

const emojiChange = await confirm({
	message: "Would you like others to be able to change your status's emoji?"
});

if (isCancel(emojiChange)) {
	cancel('Ending setup');
	process.exit(0);
}

if (emojiChange) {
	emojiQuestionInput = await text({
		message: "Input the question of your Atabook that should alter your status's emoji:"
	});
	if (isCancel(emojiQuestionInput)) {
		cancel('Ending setup');
		process.exit(0);
	}
}

const discordTokenInput = await text({
	message: 'Input your Discord authentification token:',
});

if (isCancel(discordTokenInput)) {
	cancel('Ending setup');
	process.exit(0);
}

config.set('ataUrl', urlInput.trim());
config.set('statusTextQuestion', textQuestionInput.trim());
config.set('statusEmojiQuestion', emojiQuestionInput.trim());
config.set('discordAuthToken', discordTokenInput.trim());

outro('Finished setup');

