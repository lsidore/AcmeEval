import {
	generateQuestions,
	validateQuestions,
	generateGroundTruth,
} from '../src/generate/generateQuestion';
import { ollamaGenerate } from '../src/llm';
import { checkForMissingFields } from '../src/utils';

jest.mock('../src/llm');
jest.mock('../src/utils');

describe('generateQuestion', () => {
	describe('generateQuestions', () => {
		it('should throw an error if no context is provided', async () => {
			await expect(generateQuestions('')).rejects.toThrow(
				'generateQuestions - No context provided',
			);
		});

		it('should return questions if context is provided', async () => {
			const mockResponse = JSON.stringify({
				questions: ['Question 1', 'Question 2'],
			});

			(ollamaGenerate as jest.Mock).mockResolvedValue(mockResponse);

			const result = await generateQuestions('Context');
			expect(result).toEqual(['Question 1', 'Question 2']);
		});
	});

	describe('validateQuestions', () => {
		it('should throw an error if missing fields', async () => {
			const mockQuestions = { questions: [] };
			const mockContext = 'Context';
			(checkForMissingFields as jest.Mock).mockImplementation(() => {
				throw new Error('Missing fields');
			});

			await expect(
				validateQuestions(mockQuestions, mockContext),
			).rejects.toThrow('Missing fields');
		});

		it('should return validated questions if no missing fields', async () => {
			const mockQuestions = { questions: ['Question 1', 'Question 2'] };
			const mockContext = 'Context';
			const mockResponse = JSON.stringify({
				questions: ['Validated Question 1', 'Validated Question 2'],
			});

			(checkForMissingFields as jest.Mock).mockImplementation(() => {});
			(ollamaGenerate as jest.Mock).mockResolvedValue(mockResponse);

			const result = await validateQuestions(mockQuestions, mockContext);
			expect(result).toEqual([
				'Validated Question 1',
				'Validated Question 2',
			]);
		});
	});

	describe('generateGroundTruth', () => {
		it('should throw an error if missing fields', async () => {
			const mockQuestions: string[] = [];
			const mockContext = 'Context';
			(checkForMissingFields as jest.Mock).mockImplementation(() => {
				throw new Error('Missing fields');
			});

			await expect(
				generateGroundTruth(mockQuestions, mockContext),
			).rejects.toThrow('Missing fields');
		});

		it('should return ground truth if no missing fields', async () => {
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
