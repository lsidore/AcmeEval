import { GeneratedQuestions, ScoredQuestion } from '../generate';
import { stringify } from '../utils';
import { Prompt, PromptExemple } from './types';
import { exemplesToString } from './utils';

export const formatFullPrompt = (
	prompt: string,
	exemplesString: PromptExemple[],
	contentInput: string,
) =>
	`${prompt}\n\n${exemplesToString(exemplesString)}\n\n${contentInput}\noutput:`;

export const generateQuestionsPrompt: Prompt & {
	formatPrompt: (contex: string) => string;
} = {
	prompt: 'Génére 3 questions auxquelles il est possible de répondre de manière exhaustive à partir du contexte donné',
	exemples: [
		{
			input: "Le contexte est le suivant : Comment contribuer ? Chacun peut publier immédiatement du contenu en ligne, à condition de respecter les règles essentielles établies par la Fondation Wikimedia et par la communauté ; par exemple, la vérifiabilité du contenu, l'admissibilité des articles et garder une attitude cordiale.",
			output: {
				questions: [
					'Comment contribuer ?',
					'Qui peut publier du contenu sur Wikipedia ?',
					'Quelles sont les règles établies par la Fondation Wikimedia ?',
				],
			},
		},
		{
			input: "Le contexte est le suivant : C'est l'une des techniques les plus connues, qui consiste à inciter les grands modèles de langage à aborder un problème « pas à pas », avant de fournir la réponse finale16. La chaîne de pensée améliore les capacités de raisonnement d'un modèle, en le poussant à résoudre un problème de façon plus progressive. Il permet aux grands modèles de langage de surmonter les difficultés liées à certaines tâches de raisonnement qui nécessitent une réflexion logique et plusieurs étapes à résoudre, comme les problèmes arithmétiques",
			output: {
				questions: [
					"Qu'est-ce que la chaîne de pensée ?",
					'Quel est le but de la chaîne de pensée ?',
					'Quels sont les avantages de la chaîne de pensée ?',
				],
			},
		},
	],
	formatPrompt: (context) =>
		formatFullPrompt(
			generateQuestionsPrompt.prompt,
			generateQuestionsPrompt.exemples,
			`input: Le contexte est le suivant : ${context}`,
		),
};

export const validateQuestionsPrompt: Prompt & {
	formatPrompt: (questions: GeneratedQuestions, context: string) => string;
} = {
	prompt: `Une question est pertinente si elle peut être répondue de manière exhaustive à partir du contexte. Donne un score à chaque question en fonction de sa pertinence. Le score doit être un nombre entre 0 et 1.`,
	exemples: [
		{
			input: {
				context:
					"C'est l'une des techniques les plus connues, qui consiste à inciter les grands modèles de langage à aborder un problème « pas à pas », avant de fournir la réponse finale. La chaîne de pensée améliore les capacités de raisonnement d'un modèle, en le poussant à résoudre un problème de façon plus progressive. Il permet aux grands modèles de langage de surmonter les difficultés liées à certaines tâches de raisonnement qui nécessitent une réflexion logique et plusieurs étapes à résoudre, comme les problèmes arithmétiques",
				questions: [
					"Qu'est-ce que la chaîne de pensée ?",
					'Comment utiliser la chaîne de pensée ?',
					'Quand a été découverte la technique de chaine de pensée ?',
				],
			},
			output: {
				questions: [
					{
						question: "Qu'est-ce que la chaîne de pensée ?",
						score: 1,
					},
					{
						question: 'Comment utiliser la chaîne de pensée ?',
						score: 0,
					},
					{
						question:
							'Quand a été découverte la technique de chaine de pensée ?',
						score: 0,
					},
				],
			},
		},
	],
	formatPrompt: (questions, context) =>
		formatFullPrompt(
			validateQuestionsPrompt.prompt,
			validateQuestionsPrompt.exemples,
			`input: ${stringify({
				context,
				questions,
			})}`,
		),
};

export const generateGroundTruthPrompt: Prompt & {
	formatPrompt: (
		questions: ScoredQuestion['question'][],
		context: string,
	) => string;
} = {
	prompt: `En te basant sur le contexte et les questions, extrait une réponse exhaustive pour chaque question.`,
	exemples: [
		{
			input: {
				context:
					"C'est l'une des techniques les plus connues, qui consiste à inciter les grands modèles de langage à aborder un problème « pas à pas », avant de fournir la réponse finale. La chaîne de pensée améliore les capacités de raisonnement d'un modèle, en le poussant à résoudre un problème de façon plus progressive. Il permet aux grands modèles de langage de surmonter les difficultés liées à certaines tâches de raisonnement qui nécessitent une réflexion logique et plusieurs étapes à résoudre, comme les problèmes arithmétiques",
				questions: [
					"Qu'est-ce que la chaîne de pensée ?",
					'A quoi sert la chaîne de pensée ?',
					'Comment utiliser la chaîne de pensée avec un modèle de langage ?',
				],
			},
			output: {
				groundTruth: [
					"La chaîne de pensée est une technique qui consiste à inciter les grands modèles de langage à aborder un problème « pas à pas », avant de fournir la réponse finale. Elle améliore les capacités de raisonnement d'un modèle, en le poussant à résoudre un problème de façon plus progressive. Elle permet aux grands modèles de langage de surmonter les difficultés liées à certaines tâches de raisonnement qui nécessitent une réflexion logique et plusieurs étapes à résoudre, comme les problèmes arithmétiques.",
					'La chaîne de pensée sert à améliorer les capacités de raisonnement des modèles de langage, en les poussant à résoudre un problème de façon plus progressive.',
					'Pour utiliser la chaîne de pensée avec un modèle de langage, il faut inciter le modèle à aborder un problème « pas à pas », avant de fournir la réponse finale.',
				],
			},
		},
	],
	formatPrompt: (questions, context) =>
		formatFullPrompt(
			generateGroundTruthPrompt.prompt,
			generateGroundTruthPrompt.exemples,
			`input: ${stringify({
				context,
				questions: questions,
			})}`,
		),
};
