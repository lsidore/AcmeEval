import OpenAI from 'openai';
import { PromptOpenAi } from '../prompts/types';

const client = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

export async function generate(prompt: PromptOpenAi) {
	console.info('PROMPT', JSON.stringify(prompt, null, 2));
	const chatCompletion = await client.chat.completions.create({
		messages: prompt as any,
		model: 'gpt-4o-mini',
	});
	return chatCompletion?.choices?.[0]?.message?.content;
}

export const getEvaluatedQuestions = async (query: string) =>
	client.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: [
					{
						type: 'text',
						text: 'Evaluate an array of questions provided as a JSON string to determine their quality, clarity, and whether they can be effectively answered based on a provided context.\n\nYour task involves evaluating each question from the array in three key parts:\n\n1. **Relevance Evaluation**: Determine if each question is answerable using the given context. Provide reasoning for why the context does or does not contain the necessary information to fully answer the question.\n\n2. **Quality and Clarity Assessment**: Assess the quality and clarity of each question. Specifically, indicate if the question is well-formulated, specific, and easy to understand. Each assessment should include an evaluation of the quality of the question as it integrates with the context provided.\n\n3. **Scoring**: Assign a score to each question considering multiple factors:\n    - If a question is not answerable based on the context, it should result in a low score.\n    - The weight for determining whether a question is answerable should be significantly higher than the quality or clarity of the question, although clarity is still an important aspect to consider.\n\n# Steps\n\n1. **Review the Provided Context and Question Array**: Analyze the context and each question thoroughly.\n\n2. **Relevance Evaluation**:\n    - For each question, determine if the information within the context is sufficient to provide a direct answer.\n    - Provide reasoning for your answer, detailing which parts of the context are, or aren\'t, relevant to answering the question.\n\n3. **Quality and Clarity Assessment**:\n    - For each question, assess if it is clearly formulated.\n    - Assess if each question is specific and unambiguous.\n    - Suggest any improvements necessary to enhance clarity or specificity.\n\n4. **Scoring**:\n    - Assign a score between 0 and 1 (with precision to two decimal places) that reflects the overall quality of the question.\n    - If a question cannot be answered based on the context, it should receive a low score, regardless of quality or clarity.\n    - Weigh the answerability more heavily than the quality or clarity attributes, but take all these factors into account when establishing the final score.\n\n# Output Format\n\nProvide your answer in JSON format with the following structure. The output should be an array with each element corresponding to a question assessment:\n\n\n{\n  "result": [\n    {\n      "question": "[Original question]",\n      "relevance": {\n        "is_answerable": [true/false],\n        "reasoning": "[Provide detailed reasoning on whether and why the question is answerable using the given context.]"\n      },\n      "quality_and_clarity": {\n        "is_clear": [true/false],\n        "issues": "[Describe any issues with the clarity, specificity, or formulation of the question]",\n        "suggestions": "[Provide suggestions for improving the question if needed]"\n      },\n      "score": [0.00 - 1.00]\n    }\n  ]\n}\n\n\n# Example\n\n**Input**:\n{\n  "context": "The Amazon rainforest is the largest tropical rainforest in the world, covering over 5.5 million square kilometers, and is home to millions of species of fauna and flora.",\n  "questions": [\n    "What is the size of the Amazon?",\n    "How many mammals live in the Amazon rainforest?",\n    "Where is the Amazon located?"\n  ]\n}\n\n**Output**:\n{\n  "result": [\n    {\n      "question": "What is the size of the Amazon?",\n      "relevance": {\n        "is_answerable": true,\n        "reasoning": "The context provides specific information about the size of the Amazon rainforest, stating that it covers over 5.5 million square kilometers."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.92\n    },\n    {\n      "question": "How many mammals live in the Amazon rainforest?",\n      "relevance": {\n        "is_answerable": false,\n        "reasoning": "The context states that millions of species of fauna live in the rainforest, but it does not specifically provide information regarding the number of mammal species."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.5\n    },\n    {\n      "question": "Where is the Amazon located?",\n      "relevance": {\n        "is_answerable": false,\n        "reasoning": "The context does not provide information about the geographical location of the Amazon rainforest."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.45\n    }\n  ]\n}\n\n\n# Notes\n\n- Questions that are vague, overly broad, or unrelated to the given context should be flagged in the "quality_and_clarity" section.\n- If a question is unanswerable, make sure the reasoning is clear about what specific information is missing from the context.\n- Ensure that the score weighting prioritizes ‘answerability’ more than the other factors, but without entirely discounting quality and clarity.\n- Handle each question individually, providing detailed assessment for each one in the array.',
					},
				],
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: '{\n  "context": "Bushi, stylisé Bu$hi ou BU$HI, de son vrai nom Killian Zorobabel né le 4 février 2000 à Lyon ayant grandi à l’île de la Réunion, est un rappeur français. Il a fait partie du groupe Saturn Citizen.Membre important de la scène rap lyonnaise, il a sortit 5 mixtapes (Bushi Tape Vol. 1, Vol. 1.5, Vol. 2 , Interlude et la Bushi Tape 3). Bushi a aussi collaboré avec de nombreux artistes important de la scène rap francophone et américaines comme Quavo, Tiakola, La Fève, Norsacce Berlusconi et le 667 ou encore JMK$",\n  "questions": [\\n    \\"Quel est le vrai nom de Bushi ?\\",\\n    \\"Combien de mixtapes Bushi a-t-il sorties et quelles sont-elles ?\\",\\n    \\"Avec quels artistes Bushi a-t-il collaboré ?\\"\\n  ]\n}',
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						type: 'text',
						text: '{\n  "result": [\n    {\n      "question": "Quel est le vrai nom de Bushi ?",\n      "relevance": {\n        "is_answerable": true,\n        "reasoning": "Le contexte mentionne clairement que le vrai nom de Bushi est Killian Zorobabel."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.95\n    },\n    {\n      "question": "Combien de mixtapes Bushi a-t-il sorties et quelles sont-elles ?",\n      "relevance": {\n        "is_answerable": true,\n        "reasoning": "Le contexte indique que Bushi a sorti 5 mixtapes et les énumère : Bushi Tape Vol. 1, Vol. 1.5, Vol. 2, Interlude et la Bushi Tape 3."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.95\n    },\n    {\n      "question": "Avec quels artistes Bushi a-t-il collaboré ?",\n      "relevance": {\n        "is_answerable": true,\n        "reasoning": "Le contexte fournit une liste d\'artistes avec lesquels Bushi a collaboré, y compris Quavo, Tiakola, La Fève, Norsacce Berlusconi, le 667 et JMK$."\n      },\n      "quality_and_clarity": {\n        "is_clear": true,\n        "issues": "",\n        "suggestions": ""\n      },\n      "score": 0.95\n    }\n  ]\n}',
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
		temperature: 0.1,
		max_tokens: 2048,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		response_format: {
			type: 'json_schema',
			json_schema: {
				name: 'question_assessment',
				schema: {
					type: 'object',
					properties: {
						result: {
							type: 'array',
							description:
								'An array of evaluations for each question.',
							items: {
								type: 'object',
								properties: {
									question: {
										type: 'string',
										description:
											'The original question being assessed.',
									},
									relevance: {
										type: 'object',
										properties: {
											is_answerable: {
												type: 'boolean',
												description:
													'Indicates if the question can be answered using the given context.',
											},
											reasoning: {
												type: 'string',
												description:
													'Detailed reasoning on whether and why the question is answerable using the given context.',
											},
										},
										required: [
											'is_answerable',
											'reasoning',
										],
										additionalProperties: false,
									},
									quality_and_clarity: {
										type: 'object',
										properties: {
											is_clear: {
												type: 'boolean',
												description:
													'Indicates if the question is clear and well-formulated.',
											},
											issues: {
												type: 'string',
												description:
													'Describes any issues with the clarity, specificity, or formulation of the question.',
											},
											suggestions: {
												type: 'string',
												description:
													'Suggestions for improving the question if needed.',
											},
										},
										required: [
											'is_clear',
											'issues',
											'suggestions',
										],
										additionalProperties: false,
									},
									score: {
										type: 'number',
										description:
											'The overall score assigned to the question.',
									},
								},
								required: [
									'question',
									'relevance',
									'quality_and_clarity',
									'score',
								],
								additionalProperties: false,
							},
						},
					},
					required: ['result'],
					additionalProperties: false,
				},
				strict: true,
			},
		},
	});

export const getGroundTruths = async (query: string) =>
	client.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: [
					{
						type: 'text',
						text: 'Extract a comprehensive answer from the provided context for each given question.\n\nUse the context below and each question to produce a clear and complete response.\n\n# Steps\n\n- Review the context and identify the necessary information for each question.\n- Provide a response where each essential point is covered in detail.\n- Make sure that each question receives an independent and thorough answer.\n\n# Response Format\n\nThe answers should be provided as a list of text strings that corresponds to the answers for each question in the given order. There can be between 1 and 10 questions. Use the following format:\n\n```json\n{\n  "groundTruths": [\n    "<Answer to the first question>",\n    "<Answer to the second question>",\n    "<Answer to the third question>",\n    ...\n  ]\n}\n```\n\n**Note**: Each answer must be self-contained and should not reference other answers. Provide all necessary information to accurately answer each given question.\n\n# Examples\n\n**Example**\n\n### Input\n{\n  "context": "This is one of the most well-known techniques, which encourages large language models to tackle a problem \'step by step\' before delivering a final answer. The chain of thought approach enhances the reasoning capabilities of a model by prompting it to solve a problem more progressively. It allows large language models to overcome challenges involving complex reasoning tasks that require logical thinking and multiple steps, such as arithmetic problems.",\n  "questions": [\n    "What is the chain of thought?",\n    "What is the purpose of the chain of thought?",\n    "How can the chain of thought be used with a language model?"\n  ]\n}\n\n### Output\n{\n  "groundTruths": [\n    "The chain of thought is a technique that aims to encourage large language models to tackle a problem in a progressive, step-by-step manner, before delivering the final answer.",\n    "The purpose of the chain of thought is to enhance the reasoning capabilities of language models by helping them solve problems that require logical thinking in multiple steps.",\n    "The chain of thought can be used with a language model by prompting the model to address the problem sequentially, analyzing each step before reaching a general conclusion."\n  ]\n}\n\n# Notes\n\n- Answers must be drawn directly from the context without inferring any information that is not explicitly present.\n- Avoid excessive repetition, but ensure that each answer contains all necessary information to independently address the question.',
					},
				],
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: '{\n  "context": "Programming languages facilitate the creation of software and make it possible to automate numerous tasks. They allow developers to provide specific instructions to a machine, transforming complex tasks into simple rules that a computer can execute.",\n  "questions": [\n    "What do programming languages enable?",\n    "How do programming languages facilitate software development?"\n  ]\n}',
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						type: 'text',
						text: '{\n  "groundTruths": [\n    "Programming languages enable the creation of software and make it possible to automate numerous tasks.",\n    "Programming languages facilitate software development by allowing developers to provide specific instructions to a machine, transforming complex tasks into simple rules that a computer can execute."\n  ]\n}',
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
		temperature: 0.1,
		max_tokens: 2048,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		response_format: {
			type: 'json_schema',
			json_schema: {
				name: 'ground_truth',
				schema: {
					type: 'object',
					properties: {
						groundTruths: {
							type: 'array',
							description:
								'List of clear and complete answers drawn directly from the context.',
							items: {
								type: 'string',
								description:
									'A comprehensive answer from the provided context',
							},
						},
					},
					required: ['groundTruths'],
					additionalProperties: false,
				},
				strict: true,
			},
		},
	});

export const getGeneratedQuestions = async (query: string) =>
	client.chat.completions.create({
		model: 'gpt-4o-mini',
		messages: [
			{
				role: 'system',
				content: [
					{
						type: 'text',
						text: 'Generate 3 questions that can be answered exhaustively from the given context.\n\nConsider the details presented within the given context, and construct questions where the answer can be derived in full from the given text. Ensure that the questions are meaningful and relevant to understand key concepts or important details from the provided information. \n\n# Steps\n\n1. **Read and Comprehend the Context**: Understand what is provided in the input context.\n2. **Extract Key Elements**: Identify the core ideas, concepts, procedures, or rules mentioned in the context.\n3. **Form the Questions**:\n   - Based on the essential information, create questions that help in retrieving useful content explicitly described in the context.\n   - The questions should extract different components based on "who," "what," "when," "how," or "why" to ensure they cover various aspects of the context.\n\n# Output Format\n\nFormat the output as follows, using an object notation:\n```json\n{\n    "questions": [\n        "Question 1?",\n        "Question 2?",\n        "Question 3?"\n    ]\n}\n```\n\n**Example **\n- **Input**: " How can I contribute? Anyone can immediately publish content online, as long as they respect the essential rules established by the Wikimedia Foundation and the community; for example, verifiability of content, admissibility of articles and keeping a cordial attitude."\n- **Output**:\n  {\n      "questions": [\n          "How to contribute?",\n          "Who can publish content on Wikipedia?",\n          "What are the rules established by the Wikimedia Foundation?"\n      ]\n  }\n\n\n# Notes\n\n- Ensure the questions are fully answerable by the context alone, without requiring any outside information.\n- Try to focus on different aspects of the context to ensure comprehensive coverage.\n- Make sure the questions are clear and concise.',
					},
				],
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: "This is one of the best-known techniques, which consists of encouraging large language models to tackle a problem 'step by step,' before providing the final answer. Chain-of-thought improves a model's reasoning capabilities by pushing it to solve a problem in a more progressive way. It enables large language models to overcome the difficulties associated with certain reasoning tasks that require logical thinking and several steps to solve, such as arithmetic problems.",
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						type: 'text',
						text: '{"questions":["What is the chain-of-thought technique?","How does the chain-of-thought technique improve reasoning capabilities in large language models?","What types of problems can benefit from the chain-of-thought approach?"]}',
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
		temperature: 0.1,
		max_tokens: 2048,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		response_format: {
			type: 'json_schema',
			json_schema: {
				name: 'context_questions',
				schema: {
					type: 'object',
					properties: {
						questions: {
							type: 'array',
							description:
								'List of questions that can be answered exhaustively from the given context.',
							items: {
								type: 'string',
								description:
									'A question derived from the context.',
							},
						},
					},
					required: ['questions'],
					additionalProperties: false,
				},
				strict: true,
			},
		},
	});

export const getCorrectedQuestions = async (query: string) =>
	client.chat.completions.create({
		model: 'gpt-4o',
		messages: [
			{
				role: 'system',
				content: [
					{
						type: 'text',
						text: 'Evaluate a student\'s answer to a given question based on the provided context and provide a score along with a corrected answer. If the answer is correct, include an encouraging statement. The input is a JSON stringified object from JavaScript with the structure: `{context: string, question: string, answer: string}`.\n\n# Steps\n\n1. **Evaluate the Answer**:\n   - Compare the student\'s answer to the context you\'ve been provided.\n   - Determine if the answer fully and accurately responds to the given question using the context details.\n\n2. **Assign a Score**:\n   - Use a score of 0 (incorrect or incomplete) or 1 (correct and complete).\n  \n3. **Provide a Correction or Encouragement**:\n   - If the answer is incorrect or lacking, provide a direct correction to demonstrate an ideal response.\n   - If the answer is correct, provide an encouraging statement acknowledging the student\'s correct response.\n\n# Output Format\n\n- **JSON formatted output**:\n  {\n    "score": "[0 or 1]",\n    "feedback": "[Encouraging statement or corrected version of the student\'s answer]"\n  }\n\n# Examples\n\n**Input**:\n{\n  "context": "The Earth revolves around the Sun over the course of about 365 days, which results in the changing seasons.",\n  "question": "What causes the changing seasons on Earth?",\n  "answer": "The changing seasons are caused because the Earth rotates."\n}\n\n**Output**:\n{\n  "score": 0,\n  "feedback": "The changing seasons are caused by the Earth\'s revolution around the Sun and the axial tilt of the Earth, which leads to changes in the amount of sunlight received in different parts of the world throughout the year."\n}\n\n**Input**:\n{\n  "context": "The Earth revolves around the Sun over the course of about 365 days, which results in the changing seasons.",\n  "question": "What causes the changing seasons on Earth?",\n  "answer": "The Earth revolves around the Sun, which causes the changing seasons."\n}\n\n**Output**:\n{\n  "score": 1,\n  "feedback": "Great job! You correctly explained what causes the changing seasons!"\n}\n\n# Notes\n\n- Use only the provided context for determining the score and correction.\n- Provide a concise, direct correction without additional commentary or extended feedback.\n- Provide a simple and positive encouraging statement when the student\'s answer is correct.',
					},
				],
			},
			{
				role: 'user',
				content: [
					{
						type: 'text',
						text: '{\n      "context": "Bushi, stylisé Bu$hi ou BU$HI, de son vrai nom Killian Zorobabel né le 4 février 2000 à Lyon ayant grandi à l’île de la Réunion, est un rappeur français. Il a fait partie du groupe Saturn Citizen.Membre important de la scène rap lyonnaise, il a sortit 5 mixtapes (Bushi Tape Vol. 1, Vol. 1.5, Vol. 2 , Interlude et la Bushi Tape 3). Bushi a aussi collaboré avec de nombreux artistes important de la scène rap francophone et américaines comme Quavo, Tiakola, La Fève, Norsacce Berlusconi et le 667 ou encore JMK$",\n      "question": "Avec quels artistes Bushi a-t-il collaboré ?",\n      "answer": "Avec Quavo, Tiakola, La Fève, Norsacce Berlusconi, le 667, et JMK$"\n    }',
					},
				],
			},
			{
				role: 'assistant',
				content: [
					{
						type: 'text',
						text: '{\n  "score": 1,\n  "feedback": "Excellent travail ! Vous avez correctement identifié les artistes avec lesquels Bushi a collaboré."\n}',
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
		temperature: 0.1,
		max_tokens: 2048,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
		response_format: {
			type: 'json_schema',
			json_schema: {
				name: 'feedback_schema',
				strict: true,
				schema: {
					type: 'object',
					properties: {
						score: {
							type: 'number',
							description:
								'The score awarded to the student based on their answer.',
						},
						feedback: {
							type: 'string',
							description:
								'Feedback provided to the student about their answer.',
						},
					},
					required: ['score', 'feedback'],
					additionalProperties: false,
				},
			},
		},
	});
