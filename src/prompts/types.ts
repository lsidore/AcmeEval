export type Prompt = {
	prompt: string;
	exemples: PromptExemple[];
};
export type PromptExemple = {
	input: string | object;
	output: string | object;
};
