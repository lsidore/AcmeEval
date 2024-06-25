import ollama from 'ollama';

export const ollamaGenerate = async (
	prompt: string,
	model: string = 'llama3:8b-instruct-q8_0',
	format: 'json' | 'str' = 'json',
) =>
	(
		await ollama.generate({
			prompt,
			model,
			format,
			options: {
				temperature: 0.5,
			},
		})
	).response;
