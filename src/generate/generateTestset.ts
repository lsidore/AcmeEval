import { writeFile } from 'fs/promises';
import {
	Logger,
	ProgressBar,
	calculateElapsedTime,
	checkForMissingFields,
	stringify,
} from '../utils';
import { GeneratedTestSet } from './types';
import { getRandomPart } from './getDocs';
import {
	generateGroundTruth,
	generateQuestions,
	validateQuestions,
} from './generateQuestion';
import { LogLevel } from '../types';

const DEFAULT_QUESTIONS_COUNT = 5;
const DEFAULT_LOG_LEVEL: LogLevel = 'info';
const DEFAULT_SAVE_ON_DISK = true;
const DEFAULT_FINAL_PATH = './generatedQuestions.json';
const MIN_SCORE = 0.8;

/**
 * Generate a test set of questions from a folder containing markdown files.
 *
 * @param {string} pathToDoc - Path to the folder containing the markdown files.
 * @param {number} nbOfQuestions - Number of questions to generate.
 * @default 10
 * @param {LogLevel} logLevel - Display logs level.
 * @default 'info'
 * @param {boolean} saveOnDisk - Whether to save the generated questions on disk.
 * @default true
 * @param {string} finalPath - Path to save the generated questions.
 * @default './generatedQuestions.json'
 * @returns {Promise<GeneratedTestSet>} The generated questions.
 */
export const generateTestSet = async (
	pathToDoc: string,
	nbOfQuestions = DEFAULT_QUESTIONS_COUNT,
	logLevel = DEFAULT_LOG_LEVEL,
	saveOnDisk = DEFAULT_SAVE_ON_DISK,
	finalPath = DEFAULT_FINAL_PATH,
) => {
	checkForMissingFields({ pathToDoc }, 'generateTestSet');
	const startTime = performance.now();

	const logHandler = new Logger(logLevel);
	const progressBar = new ProgressBar(1, nbOfQuestions, 'Question', logLevel);
	progressBar.start();

	const questions = await generateQuestionsForTestSet(
		pathToDoc,
		nbOfQuestions,
		logHandler,
		progressBar,
	);

	const elapsedTime = calculateElapsedTime(startTime);
	logHandler.info(
		`Generated ${questions.length} questions in ${elapsedTime}`,
	);

	if (saveOnDisk) {
		await writeFile(finalPath, stringify(questions));
	}

	return questions;
};

/**
 * Generates a test set of questions based on a given document.
 *
 * @param {string} pathToDoc - The path to the document from which to generate questions.
 * @param {number} nbOfQuestions - The number of questions to generate for the test set.
 * @param {Logger} logHandler - The logger object to handle debug logs.
 * @param {ProgressBar} progressBar - The progress bar object to update the progress.
 */
const generateQuestionsForTestSet = async (
	pathToDoc: string,
	nbOfQuestions: number,
	logHandler: Logger,
	progressBar: ProgressBar,
) => {
	const questions: GeneratedTestSet = [];

	for (let i = 0; i < nbOfQuestions; i++) {
		const { content: context, file } = await getRandomPart(pathToDoc);
		const generatedQuestions = await generateQuestions(context);

		logHandler.debug('Generated Questions:', generatedQuestions);

		const scoredQuestions = await validateQuestions(
			{ questions: generatedQuestions },
			context,
		);

		logHandler.debug('Scored Questions:', scoredQuestions);

		const acceptedQuestions = scoredQuestions.filter(
			(question) => question.score >= MIN_SCORE,
		);

		const groundTruth = await generateGroundTruth(
			acceptedQuestions.map((q) => q.question),
			context,
		);

		logHandler.debug('Ground Truth:', groundTruth);

		if (Array.isArray(groundTruth) && Array.isArray(scoredQuestions)) {
			for (let i = 0; i < scoredQuestions.length; i++) {
				questions.push({
					context,
					question: scoredQuestions[i].question,
					questionPertinance: scoredQuestions[i].score,
					groundTruth: groundTruth[i],
					path: file,
				});
			}
		}
		progressBar.update();
	}

	return questions;
};
