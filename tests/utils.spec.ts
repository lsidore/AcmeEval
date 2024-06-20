import { stringify, checkForMissingFields, ProgressBar } from '../src/utils';
describe('utils', () => {
	describe('stringify', () => {
		it('should stringify a JSON object with 2 spaces indentation', () => {
			const json = { key: 'value' };
			const result = stringify(json);
			expect(result).toBe(JSON.stringify(json, null, 2));
		});
	});

	describe('checkForMissingFields', () => {
		it('should throw an error if there are missing fields', () => {
			const props = { key1: 'value', key2: undefined };
			expect(() => checkForMissingFields(props)).toThrow(
				'The following keys are missing: key2',
			);
		});

		it('should not throw an error if there are no missing fields', () => {
			const props = { key1: 'value', key2: 'value' };
			expect(() => checkForMissingFields(props)).not.toThrow();
		});
	});
});
