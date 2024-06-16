import fs from 'fs/promises';
import { Stats } from 'fs';
import path from 'path';
import { Doc, GetRandomChunkOptions } from './types';

const readDir = async (dir: string): Promise<string[]> => {
	try {
		return await fs.readdir(dir);
	} catch (err) {
		console.error(`Error reading directory: ${err}`);
		throw err;
	}
};

const readFile = async (filePath: string): Promise<string> => {
	try {
		return await fs.readFile(filePath, 'utf-8');
	} catch (err) {
		console.error(`Error reading file: ${err}`);
		throw err;
	}
};

const stat = async (filePath: string): Promise<Stats> => {
	try {
		return await fs.stat(filePath);
	} catch (err) {
		console.error(`Error getting file stats: ${err}`);
		throw err;
	}
};

export const getDocs = async (dir: string): Promise<Doc[]> => {
	let results: Doc[] = [];

	const files = await readDir(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stats = await stat(filePath);

		if (stats.isDirectory()) {
			results = results.concat(await getDocs(filePath));
		} else if (file.endsWith('.md')) {
			const content = await readFile(filePath);
			results.push({
				file: filePath,
				content,
			});
		}
	}

	return results;
};

export const getRandom = <T>(array: T[]): T => {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
};

export const getRandomChunk = (
	doc: Doc,
	options?: GetRandomChunkOptions,
): string => {
	const chunkSize = options?.chunkSize ?? 2000;
	if (doc.content.length < chunkSize) return doc.content;

	const rawChunks = doc.content.split('\n\n');
	const chunks = rawChunks.filter((chunk) => !!chunk && chunk.length > 1);
	let randomIndex = Math.floor(Math.random() * chunks.length);

	let chunk = '';
	let i = 0;
	while (chunk.length < chunkSize && i < chunkSize) {
		if (!chunks[randomIndex]) randomIndex = 0;
		const chunkToAdd = chunks[randomIndex].replace(/ {4,}(?!\n)/g, '   ');
		chunk += chunkToAdd + '\n\n';
		randomIndex++;
		i++;
	}
	return chunk.slice(0, chunkSize);
};

export const getRandomPart = async (dir: string): Promise<string> => {
	const docs = await getDocs(dir);
	const randomDoc = getRandom(docs);
	return getRandomChunk(randomDoc);
};
