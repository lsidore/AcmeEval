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
		[pathToDoc],
		nbOfQuestions,
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
	context: string[],
	nbOfQuestions: number,
) => {
	const questions: GeneratedTestSet = [];
	const maxParallelExecutions = 3;
	let batchNumber = 1;

	const generateBatch = async (batchId: number) => {
		console.info(`\n[Batch ${batchId}] Starting new batch generation`);

		const randomContext = getRandom(context);
		console.info(
			`[Batch ${batchId}] Selected random context:`,
			JSON.stringify(randomContext.slice(0, 200) + '...', null, 2),
		);

		const generatedQuestions = await generateQuestions(randomContext);
		console.info(
			`[Batch ${batchId}] Generated initial questions:`,
			JSON.stringify(generatedQuestions, null, 2),
		);

		const scoredQuestions = await validateQuestions(
			generatedQuestions,
			randomContext,
		);
		console.info(
			`[Batch ${batchId}] Validated questions:`,
			JSON.stringify(scoredQuestions?.result, null, 2),
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
			`[Batch ${batchId}] Accepted questions after filtering:`,
			JSON.stringify(acceptedQuestions, null, 2),
		);

		const acceptedQuestionsResult = acceptedQuestions?.map(
			({ question }: { question: string }) => question,
		);

		const groundTruthResult = await generateGroundTruth(
			acceptedQuestionsResult,
			randomContext,
		);
		console.info(
			`[Batch ${batchId}] Generated ground truth:`,
			JSON.stringify(groundTruthResult.groundTruths, null, 2),
		);

		const finalQuestions = acceptedQuestions.map(
			(q: { question: string; score: number }, i: number) => ({
				context: randomContext,
				question: q.question,
				questionPertinance: q.score,
				groundTruth: groundTruthResult.groundTruths[i],
				path: 'any',
			}),
		);

		console.info(
			`[Batch ${batchId}] Completed with questions:`,
			JSON.stringify(finalQuestions, null, 2),
		);
		return finalQuestions;
	};

	while (questions.length < nbOfQuestions) {
		const remainingQuestions = nbOfQuestions - questions.length;
		const numExecutions = Math.min(
			maxParallelExecutions,
			Math.ceil(remainingQuestions / 2),
		);

		console.info(`\n=== Starting Round ${batchNumber} ===`);
		console.info(
			`Current state:`,
			JSON.stringify(
				{
					progress: `${questions.length}/${nbOfQuestions}`,
					parallelBatches: numExecutions,
					remainingQuestions,
				},
				null,
				2,
			),
		);

		const batchResults = await Promise.all(
			Array(numExecutions)
				.fill(null)
				.map((_, index) =>
					generateBatch(batchNumber * 100 + index + 1),
				),
		);

		let addedInThisRound = 0;
		for (const batchQuestions of batchResults) {
			for (const question of batchQuestions) {
				if (questions.length < nbOfQuestions) {
					questions.push(question);
					addedInThisRound++;
				}
			}
		}

		const totalGeneratedInRound = batchResults.reduce(
			(sum, batch) => sum + batch.length,
			0,
		);

		console.info(`\n=== Round ${batchNumber} Summary ===`);
		console.info(
			'Round statistics:',
			JSON.stringify(
				{
					roundNumber: batchNumber,
					questionsAdded: addedInThisRound,
					totalGenerated: totalGeneratedInRound,
					efficiency: `${addedInThisRound}/${totalGeneratedInRound}`,
					totalProgress: `${questions.length}/${nbOfQuestions}`,
					remainingQuestions: nbOfQuestions - questions.length,
				},
				null,
				2,
			),
		);
		console.info('=====================================\n');

		batchNumber++;
	}

	return questions;
};
