import {
	generateGroundTruthPrompt,
	generateQuestionsPrompt,
	validateQuestionsPrompt,
} from '../prompts';
//@ts-ignore
import dirtyJson from 'dirty-json';
import { ollamaGenerate } from '../llm';
import {
	GeneratedGroundTruth,
	GeneratedQuestions,
	ScoredQuestion,
	ValidatedQuestions,
} from './types';
import { checkForMissingFields } from '../utils';

// Generate a response from the LLM and extract the desired data
const generateResponse = async <T extends { [key: string]: any }>(
	finalPrompt: string,
	keyToExtract: keyof T = 'questions',
	retryCount = 0,
): Promise<T[typeof keyToExtract]> => {
	if (retryCount > 5) {
		throw new Error('generateResponse - Too many retries');
	}

	const prompt = finalPrompt.replaceAll('-', '').replaceAll(/(\n{3,})/g, '');

	let response: string;
	try {
		response = await ollamaGenerate(prompt);
	} catch (error) {
		throw new Error(
			`generateResponse - Error generating response: ${error}`,
		);
	}

	const result: T = response && dirtyJson.parse(response);
	if (!result[keyToExtract]) {
		return await generateResponse(
			finalPrompt,
			keyToExtract,
			retryCount + 1,
		);
	}

	return result[keyToExtract];
};

// Generate questions based on the provided context
export const generateQuestions = async (
	context: string,
): Promise<GeneratedQuestions['questions']> => {
	if (!context) {
		throw new Error('generateQuestions - No context provided');
	}

	const prompt = generateQuestionsPrompt.formatPrompt(context);
	return generateResponse<GeneratedQuestions>(prompt);
};

// Validate the generated questions based on the provided context
export const validateQuestions = async (
	questions: GeneratedQuestions,
	context: string,
): Promise<ValidatedQuestions['questions']> => {
	checkForMissingFields({ questions, context }, 'validateQuestions');

	const prompt = validateQuestionsPrompt.formatPrompt(questions, context);
	return generateResponse<ValidatedQuestions>(prompt);
};

// Generate ground truth answers for the validated questions based on the provided context
export const generateGroundTruth = async (
	questions: ScoredQuestion['question'][],
	context: string,
): Promise<GeneratedGroundTruth['groundTruth']> => {
	checkForMissingFields({ questions, context }, 'generateGroundTruth');

	if (questions.length === 0) {
		throw new Error('generateGroundTruth - No questions provided');
	}

	const prompt = generateGroundTruthPrompt.formatPrompt(questions, context);
	return await generateResponse<GeneratedGroundTruth>(prompt, 'groundTruth');
};
