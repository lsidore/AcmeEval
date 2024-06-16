import ollama from 'ollama';

export const ollamaGenerate = async (
	prompt: string,
	format: 'json' | 'str' = 'json',
) =>
	await ollama.generate({
		prompt,
		model: 'llama3:8b-instruct-q8_0',
		format: 'json',
		options: {
			temperature: 0.5,
		},
	});
