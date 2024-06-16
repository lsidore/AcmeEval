import { stringify } from '../utils';
import { PromptExemple } from './types';

export const exemplesToString = (exemples: PromptExemple[]): string =>
	exemples
		.map((exemple) => {
			const input =
				typeof exemple.input === 'object'
					? stringify(exemple.input)
					: exemple.input;
			const output =
				typeof exemple.output === 'object'
					? stringify(exemple.output)
					: exemple.output;
			return `input: ${input}\noutput: ${output}`;
		})
		.join('\n\n');
