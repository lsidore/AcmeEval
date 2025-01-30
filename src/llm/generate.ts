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

export const getCorrectedQuestions = (
	query: string,
	schoolGrade = 'College',
) => {
	const promptTemplate =
		'You are a [schoolGrade] teacher. Your role is to evaluate the correctness of the student\'s answer to an exam.\n\nEvaluate the student answer against the expected answer and provide concise, actionable feedback focused on improving the student\'s reply.\n\nThe input is a JSON object with the following properties:\n- `document`: A relevant document containing the expected answer.\n- `question`: The specific question asked.\n- `answer`: The student\'s response to the question.\n- `groundTruth`: The expected answer.\n\n# Steps\n\n1. **Evaluate the Answer**:\n   - Compare the student\'s answer (`answer`) to the expected answer (`groundTruth`) based on the information provided in the `document`.\n   - If the student\'s answer has the same meaning as the ground truth, even if the wording differs, mark the answer as correct.\n   - Determine if the answer completely and accurately addresses the question.\n\n2. **Generate Feedback**:\n   - If the student\'s answer is correct, provide an empty feedback: `""`.\n   - If the student\'s answer is incorrect:\n     - Provide concise feedback focusing only on steps to improve the response.\n     - Use the `document` and `groundTruth` to pinpoint missing elements or inaccuracies, focusing solely on bridging the gaps needed to reach the correct or expected answer.\n\n# Output Format\n\nThe output should be a JSON object structured as follows:\n\n```json\n{\n  "feedback": "Your concise, specific feedback here",\n  "isCorrect": 1 or 0\n}\n```\n\n- `"isCorrect"` should be `1` if the student\'s answer is correct, and `0` if it is incorrect.\n- If the answer is correct, `"feedback"` should be an empty string.\n- If the answer is incorrect, `"feedback"` should provide clear and actionable steps to improve the student\'s response in a concise manner.\n\n# Notes\n\n- Only utilize the given `document` and `groundTruth` to evaluate the answer and generate the feedback.\n- Feedback must be concise and directly focused on specific improvements needed to meet the expected answer, considering their [schoolGrade] level and the equivalence in meaning, even if not matched word-for-word.';

	return generateObject({
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
		system: promptTemplate.replaceAll('[schoolGrade]', schoolGrade),
		output: 'object',
		messages: [
			{
				role: 'user',
				content: query,
			},
		],
		schema: z
			.object({
				isCorrect: z
					.number()
					.describe(
						"Indicates whether the student's answer is correct or incorrect",
					),
				feedback: z
					.string()
					.describe(
						'Feedback provided to the student about their answer.',
					),
			})
			.describe('Feedback schema for student answers'),
	});
};
