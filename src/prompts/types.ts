export type Prompt = {
	prompt: string;
	exemples: PromptExemple[];
	formatPrompt: (...args: any[]) => string;
};
export type PromptExemple = {
	input: string | object;
	output: string | object;
};
