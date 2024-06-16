import { generateQuestionsPrompt, validateQuestionsPrompt } from '../prompts';
import ollama from 'ollama';
// @ts-ignore
import dirtyJson from 'dirty-json';
import { ollamaGenerate } from '../llm';
import { GeneratedQuestions, ValidatedQuestions } from './types';
import { exemplesToString } from '../prompts/utils';
const getRes = async <T extends { questions: any }>(
	finalPrompt: string,
): Promise<any> => {
	const response = await ollamaGenerate(finalPrompt);
	const questions: T = dirtyJson.parse(response?.response);
	if (!questions.questions) {
		return await getRes(finalPrompt);
	}
	return questions;
};
export const generateQuestions = async (
	context: string,
): Promise<GeneratedQuestions> => {
	if (!context) {
		throw new Error('generateQuestions - No context provided');
	}
	const exemplesString = exemplesToString(generateQuestionsPrompt.exemples);

	const contentInput = generateQuestionsPrompt.formatPrompt(context);

	const finalPrompt = `${generateQuestionsPrompt.prompt}\n\n${exemplesString}\n\n${contentInput}\noutput:`;

	return getRes(finalPrompt);
};

export const validateQuestions = async (
	questions: GeneratedQuestions,
	context: string,
): Promise<ValidatedQuestions> => {
	if (!questions?.questions || !context) {
		throw new Error(
			`validateQuestions - No ${!questions?.questions ? 'questions' : 'context'} provided`,
		);
	}

	const exemplesString = exemplesToString(validateQuestionsPrompt.exemples);
	const contentInput = validateQuestionsPrompt.formatPrompt(
		questions.questions,
		context,
	);
	const finalPrompt =
		`${validateQuestionsPrompt.prompt}\n\n${exemplesString}\n\n${contentInput}\noutput:`.replaceAll(
			'-',
			'',
		);

	const response = await getRes<ValidatedQuestions>(finalPrompt);
	return response;
};
