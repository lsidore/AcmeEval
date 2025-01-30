import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

export const getEvaluatedQuestions = (query: string) =>
	generateObject({
		model: openai('gpt-4o-mini', {
			structuredOutputs: true,
		}),
		temperature: 0.1,
		maxTokens: 2048,
		system: 'Evaluate an array of questions provided as a JSON string to determine their quality, clarity, and whether they can be effectively answered based on a provided context.\n\nAnalyze each question for three key aspects:\n\n1. **Relevance Evaluation**: Determine if each question is answerable using the given context, providing a detailed reasoning for why or why not.\n2. **Quality and Clarity Assessment**: Evaluate the formulation, specificity, and clarity of each question, and suggest improvements if applicable.\n3. **Scoring the Question**: Assign a score to each question based on its answerability and quality.\n\n# Steps\n\n1. **Review Context and Questions**:\n   - Analyze the provided context and each question.\n\n2. **Relevance Evaluation**:\n   - Determine if the context offers sufficient information to answer each question.\n   - Provide reasoning for your determination, including specific parts of the context that are relevant or missing.\n\n3. **Quality and Clarity Assessment**:\n   - Assess if the question is specific, clearly formulated, and easy to understand.\n   - Describe potential issues impacting question quality (e.g., ambiguity or lack of focus).\n   - Suggest improvements for enhancing clarity, if necessary.\n\n4. **Scoring**:\n   - Assign a score between 0.00 and 1.00 for each question (with two decimal precision).\n   - Questions that cannot be answered receive lower scores, with answerability fairness carrying the most weight.\n   - Consider quality and clarity, but weigh the ability to directly answer more heavily.\n\n# Notes\n\n- Address each question independently, ensuring distinct analysis for answerability, quality, and clarity.\n- Emphasize clarity on why a question is unanswerable, such as missing specific information, ambiguity, or irrelevance.\n- Prioritize the determination of answerability in scoring, but also consider clear question formulation as a secondary factor.',
		output: 'array',
		experimental_providerMetadata: {
			openai: {
				store: true,
				metadata: {
					custom: 'getEvaluatedQuestions',
				},
			},
		},
		messages: [
			{
				role: 'user',
				content: [
					{
						text: '{\n  "context": "The Amazon rainforest is the largest tropical rainforest in the world, covering over 5.5 million square kilometers, and is home to millions of species of fauna and flora.",\n  "questions": [\n    "What is the size of the Amazon?",\n    "How many mammals live in the Amazon rainforest?",\n    "Where is the Amazon located?"\n  ]\n}',
						type: 'text',
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						text: '{\n  "result": [\n    {\n      "question": "What is the size of the Amazon?",\n      "relevance": {\n        "is_answerable": true,\n        "reasoning": "The context mentions the specific size of the Amazon rainforest, which is over 5.5 million square kilometers."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.92\n    },\n    {\n      "question": "How many mammals live in the Amazon rainforest?",\n      "relevance": {\n        "is_answerable": false,\n        "reasoning": "The context mentions that millions of species live there but does not provide specific information on the number of mammal species."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.5\n    },\n    {\n      "question": "Where is the Amazon located?",\n      "relevance": {\n        "is_answerable": false,\n        "reasoning": "The context does not mention where the Amazon rainforest is geographically located."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.45\n    }\n  ]\n}',
						type: 'text',
					},
				],
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: query,
					},
				],
			},
		],
		schema: z.object({
			question: z
				.string()
				.describe('The original question being assessed'),
			relevance: z
				.object({
					is_answerable: z
						.boolean()
						.describe(
							'Indicates if the question can be answered using the given context',
						),
					reasoning: z
						.string()
						.describe(
							'Detailed reasoning on whether and why the question is answerable using the given context',
						),
				})
				.strict(),
			quality_and_clarity: z
				.object({
					is_clear: z
						.boolean()
						.describe(
							'Indicates if the question is clear and well-formulated',
						),
					issues: z
						.string()
						.describe(
							'Describes any issues with the clarity, specificity, or formulation of the question',
						),
					suggestions: z
						.string()
						.describe(
							'Suggestions for improving the question if needed',
						),
				})
				.strict(),
			score: z
				.number()
				.describe('The overall score assigned to the question'),
		}),
	});

export const getGroundTruths = (query: string) =>
	generateObject({
		model: openai('gpt-4o-mini', {
			structuredOutputs: true,
		}),
		experimental_providerMetadata: {
			openai: {
				store: true,
				metadata: {
					custom: 'getGroundTruths',
				},
			},
		},
		temperature: 0.1,
		maxTokens: 2048,
		system: 'Evaluate an array of questions provided as a JSON string to determine their quality, clarity, and whether they can be effectively answered based on a provided context.\n\nAnalyze each question for three key aspects:\n\n1. **Relevance Evaluation**: Determine if each question is answerable using the given context, providing a detailed reasoning for why or why not.\n2. **Quality and Clarity Assessment**: Evaluate the formulation, specificity, and clarity of each question, and suggest improvements if applicable.\n3. **Scoring the Question**: Assign a score to each question based on its answerability and quality.\n\n# Steps\n\n1. **Review Context and Questions**:\n   - Analyze the provided context and each question.\n\n2. **Relevance Evaluation**:\n   - Determine if the context offers sufficient information to answer each question.\n   - Provide reasoning for your determination, including specific parts of the context that are relevant or missing.\n\n3. **Quality and Clarity Assessment**:\n   - Assess if the question is specific, clearly formulated, and easy to understand.\n   - Describe potential issues impacting question quality (e.g., ambiguity or lack of focus).\n   - Suggest improvements for enhancing clarity, if necessary.\n\n4. **Scoring**:\n   - Assign a score between 0.00 and 1.00 for each question (with two decimal precision).\n   - Questions that cannot be answered receive lower scores, with answerability fairness carrying the most weight.\n   - Consider quality and clarity, but weigh the ability to directly answer more heavily.\n\n# Notes\n\n- Address each question independently, ensuring distinct analysis for answerability, quality, and clarity.\n- Emphasize clarity on why a question is unanswerable, such as missing specific information, ambiguity, or irrelevance.\n- Prioritize the determination of answerability in scoring, but also consider clear question formulation as a secondary factor.',
		output: 'array',
		messages: [
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: '{"context": "Programming languages facilitate the creation of software and make it possible to automate numerous tasks. They allow developers to provide specific instructions to a machine, transforming complex tasks into simple rules that a computer can execute.","questions": ["What do programming languages enable?","How do programming languages facilitate software development?"]}',
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						type: 'text',
						text: '["Programming languages enable the creation of software and make it possible to automate numerous tasks.","Programming languages facilitate software development by allowing developers to provide specific instructions to a machine, transforming complex tasks into simple rules that a computer can execute."]',
					},
				],
			},
			{
				role: 'user',
				content: query,
			},
		],
		schema: z

			.string()
			.describe('A comprehensive answer from the provided context'),
	});

export const getGeneratedQuestions = (context: string) =>
	generateObject({
		model: openai('gpt-4o-mini', {
			structuredOutputs: true,
		}),
		temperature: 0.1,
		maxTokens: 2048,
		system: 'Generate 3 questions that can be answered exhaustively from the given context.\n\nConsider the details presented within the given context, and construct questions where the answer can be derived in full from the given text. Ensure that the questions are meaningful and relevant to understand key concepts or important details from the provided information.\n\n# Steps\n\n1. **Read and Comprehend the Context**: Fully understand the details and information provided in the input context.\n2. **Extract Key Elements**: Identify the core ideas, concepts, procedures, or rules mentioned in the context.\n3. **Form the Questions**:\n   - Create questions that would help in retrieving the key information explicitly described in the text.\n   - Use different question starters such as "who," "what," "when," "how," or "why" to ensure the questions cover multiple aspects of the provided context.\n\n# Notes\n\n- Ensure the questions are fully answerable by the context alone, without requiring any external information.\n- Aim for questions that focus on different aspects of the content to provide well-rounded coverage.\n- Avoid asking repetitive questions or focusing too narrowly on a single piece of information.\n- Make sure the questions are clear, concise, and relevant to help in understanding the core information presented in the text.',
		output: 'array',
		experimental_providerMetadata: {
			openai: {
				store: true,
				metadata: {
					custom: 'getGeneratedQuestions',
				},
			},
		},
		messages: [
			{
				role: 'user',
				content: [
					{
						text: "This is one of the best-known techniques, which consists of encouraging large language models to tackle a problem 'step by step,' before providing the final answer. Chain-of-thought improves a model's reasoning capabilities by pushing it to solve a problem in a more progressive way. It enables large language models to overcome the difficulties associated with certain reasoning tasks that require logical thinking and several steps to solve, such as arithmetic problems.",
						type: 'text',
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						text: '["What is the chain-of-thought technique?","How does the chain-of-thought technique improve reasoning capabilities in large language models?","What types of problems can benefit from the chain-of-thought approach?"]',
						type: 'text',
					},
				],
			},
			{
				role: 'user',
				content: context,
			},
		],
		schema: z.string().describe('A question derived from the context.'),
	});

export const getCorrectedQuestions = (query: string) =>
	generateObject({
		model: openai('gpt-4o-mini', {
			structuredOutputs: true,
		}),
		experimental_providerMetadata: {
			openai: {
				store: true,
				metadata: {
					custom: 'getCorrectedQuestions',
				},
			},
		},
		temperature: 0.1,
		maxTokens: 2048,
		system: "Evaluate the student's answer based on the provided context and assign a score along with a feedback that encourages correct answers and provides constructive guidance on how to improve for incorrect answers.\n\n# Steps\n\n1. **Evaluate the Answer**:\n   - Compare the student's answer to the information provided in the context.\n   - Determine if the answer completely and accurately addresses the question based on the context.\n  \n2. **Assign a Score**:\n   - Assign a score of `0` for an incorrect or incomplete answer.\n   - Assign a score of `1` for a correct and complete answer.\n\n3. **Generate Feedback**:\n   - If the answer is incorrect or incomplete, provide constructive feedback. Explain why the answer is incorrect and suggest how it can be improved.\n   - If the answer is correct, include an encouraging statement recognizing the student's accurate response.\n\n# Notes\n\n- Only use the provided context in determining the accuracy and providing corrections.\n- Feedback for an incorrect answer should be constructive, with a clear and direct explanation on how to improve.\n- Positive and straightforward encouragement is expected when the student's answer is correct.",
		output: 'object',
		messages: [
			{
				role: 'user',
				content: [
					{
						text: '{\n  "context": "The Earth revolves around the Sun over the course of about 365 days, which results in the changing seasons.",\n  "question": "What causes the changing seasons on Earth?",\n  "answer": "The changing seasons are caused because the Earth rotates."\n}',
						type: 'text',
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						text: '{\n  "score": 0,\n  "feedback": "The changing seasons are actually caused by the Earth\'s revolution around the Sun combined with the axial tilt of the Earth. Keep in mind that the Earth\'s rotation causes day and night, not the seasons. You can improve by focusing on these details."\n}',
						type: 'text',
					},
				],
			},
			{
				role: 'user',
				content: [
					{
						text: '{\n  "context": "The Earth revolves around the Sun over the course of about 365 days, which results in the changing seasons.",\n  "question": "What causes the changing seasons on Earth?",\n  "answer": "The Earth revolves around the Sun, which causes the changing seasons."\n}',
						type: 'text',
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						text: '{\n "score": 1,\n  "feedback": "Great job! You correctly explained what causes the changing seasons! Keep it up!"\n}',
						type: 'text',
					},
				],
			},
			{
				role: 'user',
				content: query,
			},
		],
		schema: z
			.object({
				score: z
					.number()
					.describe(
						'The score awarded to the student based on their answer.',
					),
				feedback: z
					.string()
					.describe(
						'Feedback provided to the student about their answer.',
					),
			})
			.describe('Feedback schema for student answers'),
	});
