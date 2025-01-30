import { getCorrectedQuestions } from '../llm/generate';
import { checkForMissingFields } from '../utils';
type QnA = { question: string; context: string; answer: string };
export const generateCorrection = async (qna: QnA) => {
	checkForMissingFields({ qna }, 'generateCorrection');

	const {
		object: correction,
		usage,
		warnings,
	} = await getCorrectedQuestions(JSON.stringify({ qna }));

	console.log(
		'\ncorrection',
		JSON.stringify({ correction, usage, warnings }, null, 2),
	);
	return correction;
};

export const getCorrection = async (qnas: QnA[]) => {
	const result = await Promise.all(qnas.map(generateCorrection));
	console.log(`\n\n Correction generated ${result?.length}`);
	return result;
};
