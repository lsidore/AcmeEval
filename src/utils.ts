/**
 * Stringify a json object with 2 spaces indentation
 * @param json  - The json to stringify
 * @returns
 */
export const stringify = (json: any) => JSON.stringify(json, null, 2);

export const checkForMissingFields = (
	props: Record<string, any>,
	method?: string,
) => {
	const missingKeys = Object.keys(props).filter((key) => !props[key]);

	if (missingKeys.length) {
		const methodMessage = method ? `${method} - ` : '';
		const keysMessage = `The following keys are missing: ${missingKeys.join(', ')}`;
		throw new Error(methodMessage + keysMessage);
	}
};

export /**
 * @param {number} step - The step to increment
 * @param {number} total - The total number of steps
 * @example
 * const progressBar = new ProgressBar(1, 100);
 * progressBar.update(1);
 *
 */
class ProgressBar {
	step: number;
	total: number;
	current = 0;
	text: string;
	startTime: number;
	lastStepTime: number;
	clearConsole: boolean;
	loader: NodeJS.Timeout | undefined;

	constructor(
		step: number,
		total: number,
		text: string,
		clearConsole = true,
	) {
		this.step = step;
		this.total = total;
		this.text = text;
		this.startTime = Date.now();
		this.lastStepTime = this.startTime;
		this.clearConsole = clearConsole;
	}

	loadingAnimation(
		text = '',
		chars = ['⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉'],
		delay = 100,
	) {
		let x = 0;

		return setInterval(function () {
			process.stdout.write('\r' + chars[x++] + ' ' + text);
			x = x % chars.length;
			process.stdout.cursorTo(18);
		}, delay);
	}

	start() {
		this.loader = this.loadingAnimation();
		this.update(0); // Display the loading bar at 0
	}

	update(step = this.step) {
		const now = Date.now();
		const timeSinceLastStep = (now - this.lastStepTime) / 1000; // in seconds
		this.lastStepTime = now;

		const eta =
			this.current === 0
				? '~~'
				: (
						(this.total - this.current) *
						(timeSinceLastStep / step)
					).toFixed(2);
		const totalTime = ((now - this.startTime) / 1000).toFixed(2);

		this.current += step;
		this.clearConsole && process.stdout.write('\x1Bc');
		process.stdout.write(
			`- Total: ${totalTime}s\n- ${timeSinceLastStep.toFixed(2)}s / ${this.text}s\n- ETA: ${eta}s\n- ${this.text}s: ${this.current}/${this.total}`,
		);
		process.stdout.cursorTo(18);

		if (this.current === this.total) {
			process.stdout.write('\n');
			clearInterval(this.loader);
		}
	}
}
