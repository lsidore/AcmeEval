import { calculateElapsedTime, checkForMissingFields } from '../utils';
import { GeneratedTestSet } from './types';

import {
	generateGroundTruth,
	generateQuestions,
	validateQuestions,
} from './generateQuestion';

const DEFAULT_QUESTIONS_COUNT = 5;
const MIN_SCORE = 0.8;

/**
 * Generate a test set of questions from a folder containing markdown files.
 *
 * @param {string} pathToDoc - Path to the folder containing the markdown files.
 * @param {number} nbOfQuestions - Number of questions to generate.
 * @default 5
 * @param {LogLevel} logLevel - Display logs level.
 * @default 'info'
 * @param {boolean} saveOnDisk - Whether to save the generated questions on disk.
 * @default true
 * @param {string} finalPath - Path to save the generated questions.
 * @default './generatedQuestions.json'
 */
export const generateTestSet = async (
	pathToDoc: string,
	nbOfQuestions: number = DEFAULT_QUESTIONS_COUNT,
	params: {
		minQuestionScore: number;
	} = { minQuestionScore: MIN_SCORE },
) => {
	const { minQuestionScore } = params;

	checkForMissingFields({ pathToDoc }, 'generateTestSet');
	const startTime = performance.now();

	const questions = await generateQuestionsForTestSet(
		pathToDoc,
		nbOfQuestions,
		minQuestionScore,
	);

	const elapsedTime = calculateElapsedTime(startTime);
	console.info(`Generated ${questions.length} questions in ${elapsedTime}`);

	return questions;
};

/**
 * Generates a test set of questions based on a given document.
 *
 * @param {string} context - The context from which to generate questions.
 * @param {number} nbOfQuestions - The number of questions to generate for the test set.
 */
export const generateQuestionsForTestSet = async (
	context: string,
	nbOfQuestions: number,
) => {
	const questions: GeneratedTestSet = [];
	let step = 1;
	while (questions?.length < nbOfQuestions) {
		console.info(
			`\nSTEP: ${step}, Nb of Questions Generated: ${questions?.length}`,
		);
		// const { content: context, file } = await getRandomPart(pathToDoc);
		const generatedQuestions = await generateQuestions(context);

		const scoredQuestions = await validateQuestions(
			generatedQuestions,
			context,
		);
		const acceptedQuestions = scoredQuestions?.result?.filter(
			({
				quality_and_clarity,
				relevance,
			}: {
				quality_and_clarity: { is_clear: boolean };
				relevance: { is_answerable: boolean };
			}) => {
				return (
					quality_and_clarity?.is_clear && relevance?.is_answerable
				);
			},
		);
		console.info(
			'\nACCEPTED Questions',
			JSON.stringify(acceptedQuestions, null, 2),
		);
		const acceptedQuestionsResult = acceptedQuestions?.map(
			({ question }: { question: string }) => question,
		);
		const groundTruthResult = await generateGroundTruth(
			acceptedQuestionsResult,
			context,
		);
		const groundTruth = groundTruthResult?.groundTruth;

		console.debug('\nGround Truth:', groundTruth);

		for (let i = 0; i < acceptedQuestions.length; i++) {
			if (questions?.length < nbOfQuestions)
				questions.push({
					context,
					question: acceptedQuestions[i].question,
					questionPertinance: acceptedQuestions[i].score,
					groundTruth: groundTruth[i],
					path: 'any',
				});
		}
		step++;
	}

	return questions;
};
