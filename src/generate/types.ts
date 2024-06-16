export type Doc = {
	file: string;
	content: string;
};
export type GetRandomChunkOptions = {
	chunkSize?: number;
};

export type GeneratedQuestions = {
	questions: string[];
};

export type ScoredQuestion = {
	question: string;
	score: number;
};

export type ValidatedQuestions = {
	questions: ScoredQuestion[];
};
