import { calculateElapsedTime, checkForMissingFields } from '../utils';
import { GeneratedTestSet } from './types';

import {
	generateGroundTruth,
	generateQuestions,
	validateQuestions,
} from './generateQuestion';
import { getRandom } from './getDocs';

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
export const generateTestSet = async (pathToDoc: string) => {
	checkForMissingFields({ pathToDoc }, 'generateTestSet');
	const startTime = performance.now();

	const questions = await generateQuestionsForTestSet([pathToDoc]);

	const elapsedTime = calculateElapsedTime(startTime);
	console.info(`Generated ${questions.length} questions in ${elapsedTime}`);

	return questions;
};

export const generateQuestionsForTestSet = async (context: string[]) => {
	const questions = [];
	const contextLength = context?.length;
	const numExecutions = contextLength / 2;

	const batchResults = await Promise.all(
		Array(numExecutions)
			.fill(null)
			.map((_, index) => {
				const contextToUse = context[index + 1]
					? context[index] + context[index + 1]
					: context[index];
				return generate(contextToUse, index);
			}),
	);
	for (const question of batchResults.flat()) {
		questions.push(question);
	}

	return questions;
};

const generate = async (contextForGeneration: string, batchId: number) => {
	console.info(`\n[Batch ${batchId}] Starting new batch generation`);

	console.info(
		`[Batch ${batchId}] Selected random context:`,
		JSON.stringify(contextForGeneration.slice(0, 200) + '...', null, 2),
	);

	const generatedQuestions = await generateQuestions(contextForGeneration);
	console.info(
		`[Batch ${batchId}] Generated initial questions:`,
		JSON.stringify(generatedQuestions, null, 2),
	);

	const scoredQuestions = await validateQuestions(
		generatedQuestions,
		contextForGeneration,
	);
	console.info(
		`[Batch ${batchId}] Validated questions:`,
		JSON.stringify(scoredQuestions, null, 2),
	);

	const acceptedQuestions = scoredQuestions?.filter(
		({
			quality_and_clarity,
			relevance,
		}: {
			quality_and_clarity: { is_clear: boolean };
			relevance: { is_answerable: boolean };
		}) => {
			return quality_and_clarity?.is_clear && relevance?.is_answerable;
		},
	);
	console.info(
		`[Batch ${batchId}] Accepted questions after filtering:`,
		JSON.stringify(acceptedQuestions, null, 2),
	);

	const acceptedQuestionsResult = acceptedQuestions?.map(
		({ question }: { question: string }) => question,
	);

	const groundTruthResult = await generateGroundTruth(
		acceptedQuestionsResult,
		contextForGeneration,
	);
	console.info(
		`[Batch ${batchId}] Generated ground truth:`,
		JSON.stringify(groundTruthResult, null, 2),
	);

	const finalQuestions = acceptedQuestions.map((q, i) => ({
		context: contextForGeneration,
		question: q.question,
		score: q.score,
		groundTruth: groundTruthResult[i],
	}));

	console.info(
		`[Batch ${batchId}] Completed with questions:`,
		JSON.stringify(finalQuestions, null, 2),
	);
	return finalQuestions;
};
