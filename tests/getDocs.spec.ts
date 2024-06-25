import fs from 'fs/promises';
import path from 'path';
import {
	getDocs,
	getRandom,
	getRandomChunk,
	getRandomPart,
} from '../src/generate/getDocs';
import { Doc } from '../src';

jest.mock('fs/promises');

describe('getDocs', () => {
	let consoleErrorSpy: jest.SpyInstance;

	beforeAll(() => {
		consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});
	});

	afterAll(() => {
		consoleErrorSpy.mockRestore();
	});

	it('should return an array of Doc objects', async () => {
		(fs.readdir as jest.Mock).mockResolvedValue(['test.md']);
		(fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
		(fs.readFile as jest.Mock).mockResolvedValue('test content');

		const result = await getDocs('/test');

		expect(result).toEqual([
			{ file: '/test/test.md', content: 'test content' },
		]);
	});

	it('should handle empty directory', async () => {
		(fs.readdir as jest.Mock).mockResolvedValue([]);

		const result = await getDocs('/test');

		expect(result).toEqual([]);
	});

	it('should handle directory with subdirectories', async () => {
		(fs.readdir as jest.Mock)
			.mockResolvedValueOnce(['subdir'])
			.mockResolvedValueOnce(['test.md']);
		(fs.stat as jest.Mock)
			.mockResolvedValueOnce({ isDirectory: () => true })
			.mockResolvedValueOnce({ isDirectory: () => false });
		(fs.readFile as jest.Mock).mockResolvedValue('test content');

		const result = await getDocs('/test');

		expect(result).toEqual([
			{ file: '/test/subdir/test.md', content: 'test content' },
		]);
	});

	it('should handle error reading directory', async () => {
		const error = new Error('Test error');
		(fs.readdir as jest.Mock).mockRejectedValue(error);

		await expect(getDocs('/test')).rejects.toThrow(error);
	});

	it('should handle error getting file stats', async () => {
		(fs.readdir as jest.Mock).mockResolvedValue(['test.md']);
		const error = new Error('Test error');
		(fs.stat as jest.Mock).mockRejectedValue(error);

		await expect(getDocs('/test')).rejects.toThrow(error);
	});

	it('should handle error reading file', async () => {
		(fs.readdir as jest.Mock).mockResolvedValue(['test.md']);
		(fs.stat as jest.Mock).mockResolvedValue({ isDirectory: () => false });
		const error = new Error('Test error');
		(fs.readFile as jest.Mock).mockRejectedValue(error);

		await expect(getDocs('/test')).rejects.toThrow(error);
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
	beforeEach(() => {
		jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
	});

	afterEach(() => {
		jest.spyOn(global.Math, 'random').mockRestore();
	});

	it('returns the original document when content length is less than chunk size', () => {
		const doc: Doc = { content: 'short content', file: 'file.txt' };
		expect(getRandomChunk(doc, { chunkSize: 1000 })).toEqual(doc);
	});

	it('returns a chunk of the specified size when content length is greater than chunk size', () => {
		const doc: Doc = {
			content: 'long content\n\nmore content',
			file: 'file.txt',
		};
		const result = getRandomChunk(doc, { chunkSize: 10 });
		expect(result.content.length).toBeLessThanOrEqual(10);
		expect(result.file).toEqual(doc.file);
	});

	it('defaults to a chunk size of 2000 when chunk size is not specified', () => {
		const doc: Doc = {
			content: 'long content\n\nmore content',
			file: 'file.txt',
		};
		const result = getRandomChunk(doc);
		expect(result.content.length).toBeLessThanOrEqual(2000);
		expect(result.file).toEqual(doc.file);
	});

	it('returns the original document when chunk size is larger than content length', () => {
		const doc: Doc = { content: 'short content', file: 'file.txt' };
		expect(getRandomChunk(doc, { chunkSize: 10000 })).toEqual(doc);
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

		expect(fileContent.includes(result.content)).toBe(true);
	});
});
