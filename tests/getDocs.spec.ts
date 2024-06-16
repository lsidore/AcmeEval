import fs from 'fs/promises';
import path from 'path';
import {
	getDocs,
	getRandom,
	getRandomChunk,
	getRandomPart,
} from '../src/generate/getDocs';

jest.mock('fs/promises');

describe('getDocs', () => {
	it('should return an array of Doc objects', async () => {
		(fs.readdir as jest.Mock).mockResolvedValue(['test.md']);
		(fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
		(fs.readFile as jest.Mock).mockResolvedValue('test content');

		const result = await getDocs('/test');

		expect(result).toEqual([
			{ file: '/test/test.md', content: 'test content' },
		]);
	});
});

describe('getRandomDoc', () => {
	it('should return a random Doc object from the array', () => {
		const docs = [
			{ file: 'test1.md', content: 'test content 1' },
			{ file: 'test2.md', content: 'test content 2' },
		];
		const result = getRandom(docs);

		expect(docs).toContain(result);
	});
});

describe('getRandomChunk', () => {
	it('should return a random chunk of the Doc content', () => {
		const doc = {
			file: 'test.md',
			content: 'test content\n\nmore test content',
		};
		const result = getRandomChunk(doc);
		expect(doc.content.includes(result)).toBe(true);
	});
});

describe('getRandomPart', () => {
	it('should return a random part of a random Doc content', async () => {
		const fileContent =
			'test content\n\nmore test content, even more test content and more test content';
		(fs.readdir as jest.Mock).mockResolvedValue(['test.md']);
		(fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
		(fs.readFile as jest.Mock).mockResolvedValue(fileContent);

		const result = await getRandomPart('/test');

		expect(fileContent.includes(result)).toBe(true);
	});
});
