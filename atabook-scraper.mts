import * as cheerio from 'cheerio';

// read from url and get full dom

interface AtabookParameters {
	url: string;
	n: number;
	tq?: string;
	eq?: string;
	verbose?: boolean;
}

export async function getAtabookStatus({url, n, tq = "", eq = "", verbose = true}: AtabookParameters) {
	// in case people forget the https:// that cheerio needs
	if (!url.startsWith('https://')) {
		url = 'https://' + url;
	}
	try {
		// output string describing process and throw error if no questions given
		if (verbose) {
			if (tq !== "" && eq !== "") {
				console.log(`Fetching ${n} emoji and text submissions from ${url} for answers to "${eq}" and "${tq}", respectively.`);
			} else if (tq === "" && eq !== "") {
				console.log(`Fetching ${n} emoji submissions from ${url} for answers to "${eq}".`);
			} else if (tq !== "" && eq === "") {
				console.log(`Fetching ${n} text submissions from ${url} for answers to "${tq}".`);
			} else {
				throw new Error("No status-related questions given.")
			}
		}
		// error automatically thrown if this fails
		const $ = await cheerio.fromURL(url);
		// get all messages and filter based on whether tq or eq are found
		const messages = $('.message').filter((whatever, element) => {
			const $element = $(element);
			// get just ones with questions
			const questions = $element.find('.question').toArray();
			// and get just the text of the question (have to be very particular)
			const questionsText = questions.map(question => $(question).text().trim().split('\n')[0]);
			// check if either tq or eq are found in the array of questions for that message
			if (
				(tq !== "" && questionsText.includes(`${tq}`)) ||
				(eq !== "" && questionsText.includes(`${eq}`))
			) {
				// if so, include this message in the filtered one
				return true;
			} else {
				// if false, exclude it
				return false;
			}
		});
		// for each message
		const cheerioOutput = messages.map((i, element) => {
			// get dom of it
			const $element = $(element)
			// this part gets submitter and time
			const $split = $element.find('.split');
			const submitter = $split.children('strong').text();
			const time = $split.children('span').attr("data-time");

			// this part gets the actual questions
			// this is an array of (pretty messy) text containing one question and answer per entry
			const statusQAArr = $element.find('.question').toArray().map((el, i) => $(el).text());
			// default to empty
			let statusText = "";
			let statusEmoji = "";
			// for each row in the array of q/a
			for (let j = 0; j < statusQAArr.length; j++) {
				// change the text or emoji depending on which question is answered
				if (tq !== "" && statusQAArr[j].includes(tq)) {
					statusText = statusQAArr[j].trim().split('\n')[1].trim();
				}
				if (eq !== "" && statusQAArr[j].includes(eq)) {
					 statusEmoji = statusQAArr[j].trim().split('\n')[1].trim();
				}
			}
			// this is just the message part of it
			const message = $element.find(".message-text").text();

			// create return object
			return {
				"submitter": submitter,
				"time": Number(time),
				"statusText": statusText,
				"statusEmoji": statusEmoji,
				"message": message
			};
			// console.log($element.find('question'):contains("change my status:");
		});
		// .sort((a,b) => fn) places a before b if the function return is less than 0 and vice versa if the function return is greater than 0
		const returnArr = cheerioOutput.toArray().sort((a, b) => {
			return b.time - a.time
		}).slice(0, n);
		
		if (returnArr.length === 1) {
			return returnArr[0];
		}
		return returnArr;
	} catch (error) {
		console.error("Error:", error.message);
		
	}
}

