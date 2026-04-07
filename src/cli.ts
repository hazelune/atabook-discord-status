import { main as setup } from './setup.ts';
import { main as update } from './update.ts';
import { main as start } from './start.ts';
 
// 0 is runtime directory, 2 is file in directory?
const fnToRun = process.argv[2];
if (fnToRun === undefined) {
	console.log(`Append this command with one of three acceptable commands: "setup", "update", or "start".`)
	process.exit(1);
}

// weirddddd; the value stored at each key is an async function :(
const commands: Record<string, () => Promise<void> | void> = {
	setup: setup,
	update: update,
	start: start 
};

// undefined if argument is not a valid command
const handler = commands[fnToRun];

// checks if handler is a valid function, runs if so
if (typeof handler !== "function") {
	console.error(`Must a command from "setup", "update", or "start".`);
} else {
	handler();
}

// yay!


