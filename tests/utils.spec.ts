import {
	stringify,
	checkForMissingFields,
	calculateElapsedTime,
	Logger,
	ProgressBar,
} from '../src/utils';

describe.skip('Utils', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe.skip('ProgressBar', () => {
		let progressBar: ProgressBar;
		let loadingAnimation: ProgressBar['loadingAnimation'];
		let stdoutWrite: jest.SpyInstance;

		beforeEach(() => {
			stdoutWrite = jest
				.spyOn(process.stdout, 'write')
				.mockImplementation();

			progressBar = new ProgressBar(1, 10, 'Test', 'debug');
			loadingAnimation = new ProgressBar(1, 10, 'Test', 'debug')
				.loadingAnimation;
			process.stdout.cursorTo = jest.fn();
		});
		it.skip('should initialize the progress bar and update it to 0', () => {
			const loadingAnimationSpy = jest.spyOn(
				progressBar,
				'loadingAnimation',
			);
			const updateSpy = jest.spyOn(progressBar, 'update');

			progressBar.start();

			expect(loadingAnimationSpy).toHaveBeenCalled();
			expect(updateSpy).toHaveBeenCalledWith(0);
			const intervalId = progressBar.loader;
			expect(intervalId).toBeDefined();
			clearInterval(intervalId);
		});

		it.skip('should update the progress bar correctly', () => {
			const spy = jest.spyOn(process.stdout, 'write');
			progressBar.update();
			expect(spy).toHaveBeenCalledWith(
				expect.stringContaining('- Total:'),
			);
			expect(spy).toHaveBeenCalledWith(
				expect.stringContaining('- Tests: 1/10'),
			);
		});

		it.skip('should clear the interval when the progress bar is complete', () => {
			const spy = jest.spyOn(global, 'clearInterval');
			console.log('progressBar.current', progressBar.current);
			progressBar.current = 10;
			progressBar.update();
			expect(spy).toHaveBeenCalled();
		});

		it.skip('writes to process.stdout with the correct characters', () => {
			jest.useFakeTimers();
			const intervalId = loadingAnimation();

			jest.advanceTimersByTime(100);
			expect(stdoutWrite).toHaveBeenCalledWith('\r⠙ ');
			jest.advanceTimersByTime(100);
			expect(stdoutWrite).toHaveBeenCalledWith('\r⠘ ');
			clearInterval(intervalId);
		});

		it.skip('writes to process.stdout with the correct text', () => {
			jest.useFakeTimers();
			const intervalId = loadingAnimation('Loading...');
			jest.advanceTimersByTime(100);
			expect(stdoutWrite).toHaveBeenCalledWith('\r⠙ Loading...');
			clearInterval(intervalId);
		});

		it.skip('correctly delays between writes', () => {
			jest.useFakeTimers();
			const intervalId = loadingAnimation('', ['*'], 500);
			jest.advanceTimersByTime(499);
			expect(stdoutWrite).not.toHaveBeenCalled();
			jest.advanceTimersByTime(1);
			expect(stdoutWrite).toHaveBeenCalledWith('\r* ');
			clearInterval(intervalId);
		});
	});

	describe.skip('stringify', () => {
		it.skip('should stringify a JSON object with 2 spaces indentation', () => {
			const json = { key: 'value' };
			const result = stringify(json);
			expect(result).toBe(JSON.stringify(json, null, 2));
		});
	});

	describe.skip('checkForMissingFields', () => {
		it.skip('should throw an error if there are missing fields', () => {
			const props = { key1: 'value', key2: undefined };
			expect(() => checkForMissingFields(props)).toThrow(
				'The following keys are missing: key2',
			);
		});

		it.skip('should not throw an error if there are no missing fields', () => {
			const props = { key1: 'value', key2: 'value' };
			expect(() => checkForMissingFields(props)).not.toThrow();
		});
	});

	describe.skip('calculateElapsedTime', () => {
		it.skip('should throw an error if start time is in the future', () => {
			const start = performance.now() + 1000;
			expect(() => calculateElapsedTime(start)).toThrow(
				'Start time is in the future',
			);
		});

		it.skip('should calculate elapsed time correctly', () => {
			const start = performance.now() - 61000;
			const result = calculateElapsedTime(start);
			expect(result).toBe('1m 1s 0ms');
		});
	});

	describe.skip('Logger', () => {
		let logger: Logger;

		beforeEach(() => {
			logger = new Logger('debug');
		});

		it.skip('should log debug messages if log level is debug', () => {
			const spy = jest.spyOn(console, 'debug');
			logger.debug('Test', 'Message');
			expect(spy).toHaveBeenCalledWith(
				'\n\n',
				'\x1b[36m',
				'Test',
				'\x1b[0m:',
				'Message',
			);
		});

		it.skip('should log info messages if log level is debug', () => {
			const spy = jest.spyOn(console, 'info');
			logger.info('Test', 'Message');
			expect(spy).toHaveBeenCalledWith(
				'\n\n',
				'\x1b[33m',
				'Test',
				'\x1b[0m:',
				'Message',
			);
		});

		it.skip('should not log debug messages if log level is not debug', () => {
			logger = new Logger('info');
			const spyDebug = jest.spyOn(console, 'debug');
			const spyInfo = jest.spyOn(console, 'info');
			logger.debug('Test', 'Message');
			logger.info('Test', 'Message');
			expect(spyDebug).not.toHaveBeenCalled();
			expect(spyInfo).toHaveBeenCalled();
		});
	});
});
