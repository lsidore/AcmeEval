import { generateQuestionsForTestSet, generateTestSet } from '../src/generate';
import {
	generateQuestions,
	validateQuestions,
	generateGroundTruth,
} from '../src/generate/generateQuestion';
import { ollamaGenerate } from '../src/llm';
import { checkForMissingFields } from '../src/utils';

jest.mock('../src/llm');
// jest.mock('../src/utils');

describe('generateQuestion', () => {
	describe('testst', () => {
		it(
			'test genere',
			async () => {
				const result = await generateQuestionsForTestSet([
					"C'est l'une des techniques les plus connues, qui consiste à inciter les grands modèles de langage à aborder un problème « pas à pas », avant de fournir la réponse finale16. La chaîne de pensée améliore les capacités de raisonnement d'un modèle, en le poussant à résoudre un problème de façon plus progressive. Il permet aux grands modèles de langage de surmonter les difficultés liées à certaines tâches de raisonnement qui nécessitent une réflexion logique et plusieurs étapes à résoudre, comme les problèmes arithmétiques",
				]);
				console.log('RESULR', JSON.stringify(result, null, 2));
			},
			60 * 60 * 60 * 60,
		);
	});
	describe.skip('generateQuestions', () => {
		it.skip('should throw an error if no context is provided', async () => {
			await expect(generateQuestions('')).rejects.toThrow(
				'generateQuestions - No context provided',
			);
		});

		it.skip('should return questions if context is provided', async () => {
			const mockResponse = JSON.stringify({
				questions: ['Question 1', 'Question 2'],
			});

			(ollamaGenerate as jest.Mock).mockResolvedValue(mockResponse);

			const result = await generateQuestions(
				'Bushi, stylisé Bu$hi ou BU$HI, de son vrai nom Killian Zorobabel né le 4 février 2000 à Lyon ayant grandi à l’île de la Réunion, est un rappeur français. Il a fait partie du groupe Saturn Citizen.Membre important de la scène rap lyonnaise, il a sortit 5 mixtapes (Bushi Tape Vol. 1, Vol. 1.5, Vol. 2 , Interlude et la Bushi Tape 3). Bushi a aussi collaboré avec de nombreux artistes important de la scène rap francophone et américaines comme Quavo, Tiakola, La Fève, Norsacce Berlusconi et le 667 ou encore JMK$',
			);
			expect(result).toEqual(['Question 1', 'Question 2']);
		});
	});

	describe.skip('validateQuestions', () => {
		it.skip('should throw an error if missing fields', async () => {
			const mockQuestions = { questions: [] };
			const mockContext = 'Context';
			(checkForMissingFields as jest.Mock).mockImplementation(() => {
				throw new Error('Missing fields');
			});

			// await expect().rejects.toThrow('Missing fields');
			// validateQuestions(mockQuestions, mockContext),
		});

		it.skip('should return validated questions if no missing fields', async () => {
			const mockQuestions = { questions: ['Question 1', 'Question 2'] };
			const mockContext = 'Context';
			const mockResponse = JSON.stringify({
				questions: ['Validated Question 1', 'Validated Question 2'],
			});

			(checkForMissingFields as jest.Mock).mockImplementation(() => {});
			(ollamaGenerate as jest.Mock).mockResolvedValue(mockResponse);

			// const result = await validateQuestions(mockQuestions, mockContext);
			// expect(result).toEqual([
			// 	'Validated Question 1',
			// 	'Validated Question 2',
			// ]);
		});
	});

	describe.skip('generateGroundTruth', () => {
		it.skip('should throw an error if missing fields', async () => {
			const mockQuestions: string[] = [];
			const mockContext = 'Context';
			(checkForMissingFields as jest.Mock).mockImplementation(() => {
				throw new Error('Missing fields');
			});

			await expect(
				generateGroundTruth(mockQuestions, mockContext),
			).rejects.toThrow('Missing fields');
		});

		it.skip('should return ground truth if no missing fields', async () => {
			const mockQuestions = ['Question 1', 'Question 2'];
			const mockContext = 'Context';
			const mockResponse = JSON.stringify({
				groundTruth: ['Answer 1', 'Answer 2'],
			});

			(checkForMissingFields as jest.Mock).mockImplementation(() => {});
			(ollamaGenerate as jest.Mock).mockResolvedValue(mockResponse);

			const result = await generateGroundTruth(
				mockQuestions,
				mockContext,
			);
			expect(result).toEqual(['Answer 1', 'Answer 2']);
		});
	});
});
