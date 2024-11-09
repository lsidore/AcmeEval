//@ts-ignore
import dirtyJson from 'dirty-json';
import {
	GeneratedGroundTruth,
	GeneratedQuestions,
	ScoredQuestion,
	ValidatedQuestions,
} from './types';
import { checkForMissingFields } from '../utils';
import {
	getEvaluatedQuestions,
	generate,
	getGroundTruth,
	getGeneratedQuestions,
} from '../llm/openai';

// Generate a response from the LLM and extract the desired data
const generateResponse = async (
	prompt: any,
	keyToExtract: string,
	retryCount = 0,
) => {
	if (retryCount > 5) {
		throw new Error('generateResponse - Too many retries');
	}

	let response;
	try {
		response = await generate(prompt);
	} catch (error) {
		throw new Error(
			`generateResponse - Error generating response: ${error}`,
		);
	}

	const result = dirtyJson.parse(response ?? '{}');

	return result[keyToExtract];
};

// Generate questions based on the provided context
export const generateQuestions = async (
	context: string,
): Promise<GeneratedQuestions['questions']> => {
	if (!context) {
		throw new Error('generateQuestions - No context provided');
	}
	const result = await getGeneratedQuestions(context);
	const generatedQuestions = dirtyJson.parse(
		result?.choices?.[0].message?.content ?? '{}',
	);
	console.info(
		'Generated questions',
		JSON.stringify(generatedQuestions, null, 2),
	);
	return generatedQuestions;
};

// Validate the generated questions based on the provided context
export const validateQuestions = async (
	questions: string[],
	context: string,
) => {
	checkForMissingFields({ questions, context }, 'validateQuestions');

	const result = await getEvaluatedQuestions(
		JSON.stringify({ context, questions }),
	);
	const releventQuestions = dirtyJson.parse(
		result?.choices?.[0].message?.content ?? '{}',
	);
	console.info(
		'releventQuestions',
		JSON.stringify(releventQuestions, null, 2),
	);
	return releventQuestions;
};

// Generate ground truth answers for the validated questions based on the provided context
export const generateGroundTruth = async (
	questions: ScoredQuestion['question'][],
	context: string,
) => {
	checkForMissingFields({ questions, context }, 'generateGroundTruth');

	if (questions.length === 0) {
		throw new Error('generateGroundTruth - No questions provided');
	}

	const result = await getGroundTruth(JSON.stringify({ context, questions }));
	const groundTruths = dirtyJson.parse(
		result?.choices?.[0].message?.content ?? '{}',
	);
	console.info('groundTruths', JSON.stringify(groundTruths, null, 2));
	return groundTruths;
};
