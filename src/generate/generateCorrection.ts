import dirtyJson from 'dirty-json';
import { getCorrectedQuestions } from '../llm/openai';
import { checkForMissingFields } from '../utils';
type QnA = { question: string; context: string; answer: string };
export const generateCorrection = async (qna: QnA) => {
	checkForMissingFields({ qna }, 'generateCorrection');

	const result = await getCorrectedQuestions(JSON.stringify({ qna }));
	const correction = dirtyJson.parse(
		result?.choices?.[0].message?.content ?? '{}',
	);
	console.info('\ncorrection', JSON.stringify(correction, null, 2));
	return correction;
};

export const getCorrection = async (qnas: QnA[]) => {
	const result = await Promise.all(qnas.map(generateCorrection));
	console.info(`\n\n Correction generated ${result?.length}`);
	return result;
};
