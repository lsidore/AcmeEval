import { getCorrectedQuestions } from '../llm/generate';
import { checkForMissingFields } from '../utils';
type QnA = {
	question: string;
	document: string;
	answer: string;
	groundTruth: string;
};
export const generateCorrection = async (qna: QnA, schoolGrade?: string) => {
	checkForMissingFields({ qna }, 'generateCorrection');

	const {
		object: correction,
		usage,
		warnings,
	} = await getCorrectedQuestions(JSON.stringify({ qna }), schoolGrade);

	console.log(
		'\ncorrection',
		JSON.stringify({ correction, usage, warnings }, null, 2),
	);
	return correction;
};

export const getCorrection = async (qnas: QnA[], schoolGrade?: string) => {
	const result = await Promise.all(
		qnas.map((qna) => generateCorrection(qna, schoolGrade)),
	);
	console.log(`\n\n Correction generated ${result?.length}`);
	return result;
};
