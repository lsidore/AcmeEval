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

export type GeneratedGroundTruth = {
	groundTruth: string;
};

export type GeneratedQnA = {
	context: string;
	question: string;
	questionPertinance: number;
	groundTruth: string;
	path: string;
};

export type GeneratedTestSet = GeneratedQnA[];
