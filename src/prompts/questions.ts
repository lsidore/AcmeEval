import { GeneratedQuestions } from '../generate';
import { stringify } from '../utils';
import { Prompt } from './types';

export const generateQuestionsPrompt: Prompt = {
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
	formatPrompt: (context: string) => {
		return `input: Le contexte est le suivant : ${context}`;
	},
};

export const validateQuestionsPrompt: Prompt = {
	prompt: `Une question est pertinente si elle peut être répondue de manière exhaustive à partir du context. Donne un score à chaque question en fonction de sa pertinence. Le score doit être un nombre entre 0 et 1.`,
	exemples: [
		{
			input: {
				context:
					"Comment contribuer ? Chacun peut publier immédiatement du contenu en ligne, à condition de respecter les règles essentielles établies par la Fondation Wikimedia et par la communauté ; par exemple, la vérifiabilité du contenu, l'admissibilité des articles et garder une attitude cordiale.",
				questions: [
					'Qui est la communauté ?',
					'Quelles sont les règles établies par la Fondation Wikimedia pour contribuer ?',
					'A quoi sert Wikipedia ?',
				],
			},
			output: {
				questions: [
					{
						question:
							'Quelles sont les règles établies par la Fondation Wikimedia pour contribuer ?',
						score: 1,
					},
					{
						question: 'Qui est la communauté ?',
						score: 0,
					},
					{
						question: 'A quoi sert Wikipedia ?',
						score: 0,
					},
				],
			},
		},
		{
			input: {
				context:
					"C'est l'une des techniques les plus connues, qui consiste à inciter les grands modèles de langage à aborder un problème « pas à pas », avant de fournir la réponse finale16. La chaîne de pensée améliore les capacités de raisonnement d'un modèle, en le poussant à résoudre un problème de façon plus progressive. Il permet aux grands modèles de langage de surmonter les difficultés liées à certaines tâches de raisonnement qui nécessitent une réflexion logique et plusieurs étapes à résoudre, comme les problèmes arithmétiques",
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
	formatPrompt: (questions: GeneratedQuestions, context: string) =>
		`input: ${stringify({
			context,
			questions,
		})}`,
};
