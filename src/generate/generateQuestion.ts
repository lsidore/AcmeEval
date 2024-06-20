import fs from 'fs';
import {
	generateGroundTruthPrompt,
	generateQuestionsPrompt,
	validateQuestionsPrompt,
} from '../prompts';
// @ts-ignore
import dirtyJson from 'dirty-json';
import { ollamaGenerate } from '../llm';
import {
	GeneratedGroundTruth,
	GeneratedQuestions,
	GeneratedTestSet,
	ValidatedQuestions,
} from './types';
import { getRandomPart } from './getDocs';
import { ProgressBar, checkForMissingFields, stringify } from '../utils';

const getRes = async <T extends { [key: string]: any }>(
	finalPrompt: string,
	keyToParse: keyof T = 'questions',
	i = 0,
): Promise<T[typeof keyToParse]> => {
	if (i > 5) {
		throw new Error('getRes - Too many retries');
	}
	const prompt = finalPrompt.replaceAll('-', '').replace(/(\n{3,})/g, '');
	const response = await ollamaGenerate(prompt);
	const result: T = dirtyJson.parse(response?.response);
	if (!result[keyToParse]) {
		return await getRes(finalPrompt, keyToParse, i + 1);
	}
	return result[keyToParse];
};

export const generateQuestions = async (
	context: string,
): Promise<GeneratedQuestions['questions']> => {
	if (!context) {
		throw new Error('generateQuestions - No context provided');
	}
	const prompt = generateQuestionsPrompt.formatPrompt(context);
	return getRes<GeneratedQuestions>(prompt);
};

export const validateQuestions = async (
	questions: GeneratedQuestions,
	context: string,
): Promise<ValidatedQuestions['questions']> => {
	checkForMissingFields({ questions, context }, 'validateQuestions');
	const prompt = validateQuestionsPrompt.formatPrompt(questions, context);
	return getRes<ValidatedQuestions>(prompt);
};

export const generateGroundTruth = async (
	questions: GeneratedQuestions,
	context: string,
): Promise<GeneratedGroundTruth['groundTruth']> => {
	checkForMissingFields({ questions, context }, 'generateGroundTruth');
	const prompt = generateGroundTruthPrompt.formatPrompt(questions, context);
	return await getRes<GeneratedGroundTruth>(prompt, 'groundTruth');
};

/**
 * Generate a test set of questions from a folder containing markdown files
 * @param pathToDoc Path to the folder containing the markdown files
 * @param nbOfQuestions Number of questions to generate
 * @param withLogs Display logs
 * @param finalPath Path to save the generated questions
 * @returns The generated questions
 * */
export const generateTestSet = async (
	pathToDoc: string,
	/**
	 * We generate 3 potential question for each nbOfQuestions \
	 * and keep only the ones with a score of 1
	 * */
	nbOfQuestions = 10,
	withLogs = false,
	saveOnDisk = true,
	finalPath = './generatedQuestions.json',
) => {
	checkForMissingFields({ pathToDoc }, 'generateTestSet');
	const start = performance.now();
	const loadingBar = new ProgressBar(1, nbOfQuestions, 'Question', !withLogs);
	const questions: GeneratedTestSet = [];
	loadingBar.start();

	for (let i = 0; i < nbOfQuestions; i++) {
		const { content: context, file } = await getRandomPart(pathToDoc);
		const generatedQuestions = await generateQuestions(context);

		withLogs &&
			console.info(
				'\n\n',
				'\x1b[33m',
				'Generated Questions:',
				'\x1b[0m:',
				generatedQuestions,
			);

		const scoredQuestions = await validateQuestions(
			{ questions: generatedQuestions },
			context,
		);

		withLogs &&
			console.info(
				'\n',
				'\x1b[36m',
				'Scored Questions:',
				'\x1b[0m:',
				scoredQuestions,
				'\n\n',
			);

		const groundTruth = await generateGroundTruth(
			{ questions: generatedQuestions },
			context,
		);

		withLogs &&
			console.info(
				'\n',
				'\x1b[33m',
				'Ground Truth:',
				'\x1b[0m:',
				groundTruth,
				'\n\n',
			);

		if (Array.isArray(groundTruth) && Array.isArray(scoredQuestions)) {
			for (let i = 0; i < scoredQuestions.length; i++) {
				if (scoredQuestions[i].score !== 1) continue;
				questions.push({
					context,
					question: scoredQuestions[i].question,
					questionPertinance: scoredQuestions[i].score,
					groundTruth: groundTruth[i],
					path: file,
				});
			}
		}
		loadingBar.update();
	}
	const seconds = Math.floor((performance.now() - start) / 1000);
	const minutes = Math.floor(seconds / 60);
	const secondsRest = seconds % 60;
	const miliseconds = Math.floor((performance.now() - start) % 1000);

	withLogs &&
		console.info(
			'\n',
			'\x1b[36m',
			`Generated ${questions.length} questions in ${minutes}m ${secondsRest}s ${miliseconds}ms`,
			'\x1b[0m:',
		);

	saveOnDisk && fs.writeFileSync(finalPath, stringify(questions));
	return questions;
};
