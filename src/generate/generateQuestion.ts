//@ts-ignore
import { GeneratedQuestions, ScoredQuestion } from './types';
import { checkForMissingFields } from '../utils';
import {
	getEvaluatedQuestions,
	getGroundTruths,
	getGeneratedQuestions,
} from '../llm/generate';

// Generate questions based on the provided context
export const generateQuestions = async (
	context: string,
): Promise<GeneratedQuestions['questions']> => {
	checkForMissingFields({ context }, 'generateQuestions');

	const {
		object: generatedQuestions,
		usage,
		warnings,
	} = await getGeneratedQuestions(context);

	console.log(
		'Generated questions',
		JSON.stringify({ generatedQuestions, usage, warnings }, null, 2),
	);
	return generatedQuestions;
};

// Validate the generated questions based on the provided context
export const validateQuestions = async (
	questions: string[],
	context: string,
) => {
	checkForMissingFields({ questions, context }, 'validateQuestions');

	const {
		object: releventQuestions,
		usage,
		warnings,
	} = await getEvaluatedQuestions(JSON.stringify({ context, questions }));

	console.log(
		'releventQuestions',
		JSON.stringify({ releventQuestions, usage, warnings }, null, 2),
	);
	return releventQuestions;
};

// Generate ground truth answers for the validated questions based on the provided context
export const generateGroundTruth = async (
	questions: ScoredQuestion['question'][],
	context: string,
) => {
	checkForMissingFields({ questions, context }, 'generateGroundTruth');

	const {
		object: groundTruths,
		usage,
		warnings,
	} = await getGroundTruths(JSON.stringify({ context, questions }));

	console.log(
		'groundTruths',
		JSON.stringify({ groundTruths, usage, warnings }, null, 2),
	);
	return groundTruths;
};
