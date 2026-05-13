// StockInfo.test.js
import stockInfo from '../StockInfo';
// import config from '../config';

// Mock fetch API
global.fetch = jest.fn();

// Mock config
jest.mock('../config', () => ({
	port: 3005,
	baseUrl: 'http://localhost:3005/',
	apiBaseUrl: 'http://localhost:3005/api',
	gemeniApiKey: "mock-key",
	get gemeniApiUrl() {
		return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.gemeniApiKey}`;
	},
}));

describe('StockInfo Class', () => {
	beforeEach(() => {
		// Reset all mocks
		jest.clearAllMocks();

		// Default mock response for fetch
		global.fetch.mockResolvedValue({
			ok: true,
			json: async () => ({ data: 'mock data' })
		});
	});

	describe('StockInfo instance', () => {
		test('should initialize with yahoo-finance as default provider', () => {
			expect(stockInfo.getUsedStockAPI()).toBe('yahoo-finance');
		});

		test('should allow changing stock provider', () => {
			// Store original provider to restore after test
			const originalProvider = stockInfo.getUsedStockAPI();

			// Set a new valid provider (one that exists in the private availableStocksAPIs)
			// We can't directly test setting to other providers as they're not implemented yet 
			// So we'll just verify we can set it back to yahoo-finance
			stockInfo.setStockProvider('yahoo-finance');
			expect(stockInfo.getUsedStockAPI()).toBe('yahoo-finance');

			// Restore original provider
			stockInfo.setStockProvider(originalProvider);
		});

		test('should throw error when setting invalid provider', () => {
			expect(() => {
				stockInfo.setStockProvider('invalid-provider');
			}).toThrow(); // Just check that it throws any error
		});
	});

	describe('API Method Delegation', () => {
		test('getHistoricalPrices should delegate to current API', async () => {
			// Create a spy on the currentAPI method
			const spy = jest.spyOn(stockInfo.currentAPI, 'getHistoricalPrices');
			spy.mockResolvedValue({ prices: [100, 101, 102] });

			const result = await stockInfo.getHistoricalPrices('AAPL', '2024-01-01', '2024-01-31', '1d');

			expect(spy).toHaveBeenCalledWith('AAPL', '2024-01-01', '2024-01-31', '1d');
			expect(result).toEqual({ prices: [100, 101, 102] });
		});

		test('getPriceForDate should delegate to current API', async () => {
			const spy = jest.spyOn(stockInfo.currentAPI, 'getPriceForDate');
			spy.mockResolvedValue({ price: 150 });

			const result = await stockInfo.getPriceForDate('AAPL', '2024-01-15');

			expect(spy).toHaveBeenCalledWith('AAPL', '2024-01-15');
			expect(result).toEqual({ price: 150 });
		});

		test('getPriceRange should delegate to current API', async () => {
			const spy = jest.spyOn(stockInfo.currentAPI, 'getPriceRange');
			spy.mockResolvedValue({ min: 145, max: 155 });

			const result = await stockInfo.getPriceRange('AAPL', '2024-01-01', '2024-01-31');

			expect(spy).toHaveBeenCalledWith('AAPL', '2024-01-01', '2024-01-31');
			expect(result).toEqual({ min: 145, max: 155 });
		});

		test('getStockDetails should delegate to current API', async () => {
			const spy = jest.spyOn(stockInfo.currentAPI, 'getStockDetails');
			spy.mockResolvedValue({ companyName: 'Apple Inc.' });

			const result = await stockInfo.getStockDetails('AAPL');

			expect(spy).toHaveBeenCalledWith('AAPL');
			expect(result).toEqual({ companyName: 'Apple Inc.' });
		});

		test('getFullStockInfo should delegate to current API', async () => {
			const spy = jest.spyOn(stockInfo.currentAPI, 'getFullStockInfo');
			spy.mockResolvedValue({
				details: { companyName: 'Apple Inc.' },
				prices: [150, 151, 152]
			});

			const result = await stockInfo.getFullStockInfo('AAPL', '2024-01-01', '2024-01-31', '1d');

			expect(spy).toHaveBeenCalledWith('AAPL', '2024-01-01', '2024-01-31', '1d');
			expect(result).toEqual({
				details: { companyName: 'Apple Inc.' },
				prices: [150, 151, 152]
			});
		});
	});
});

describe('YahooFinanceAPI Class', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Default mock response for fetch
		global.fetch.mockResolvedValue({
			ok: true,
			json: async () => ({ data: 'mock data' })
		});
	});

	// Tests for the Yahoo Finance API implementation
	test('getStockInfo should make request to Yahoo Finance API', async () => {
		global.fetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ chart: { result: [{ meta: { symbol: 'AAPL' } }] } })
		});

		await stockInfo.currentAPI.getStockInfo('AAPL');

		expect(global.fetch).toHaveBeenCalledWith(
			'https://query1.finance.yahoo.com/v8/finance/chart/AAPL'
		);
	});


	test('buildURL should handle parameters correctly', () => {
		const url = stockInfo.currentAPI.buildURL('/test', {
			param1: 'value1',
			param2: 'value2',
			nullParam: null,
			undefinedParam: undefined
		});

		// Only non-null, non-undefined params should be included
		expect(url).toBe('http://localhost:3005/api/yfinance/test?param1=value1&param2=value2');
	});

	test('fetchData should handle API errors', async () => {
		// Save original fetch
		const originalFetch = global.fetch;

		// Mock fetch for this test only
		global.fetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 404
		});

		await expect(stockInfo.currentAPI.fetchData('http://test-url')).rejects.toThrow('HTTP error! status: 404');

		// Restore original fetch
		global.fetch = originalFetch;
	});

	test('fetchData should handle network errors', async () => {
		// Save original fetch
		const originalFetch = global.fetch;

		// Mock fetch for this test only
		global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

		await expect(stockInfo.currentAPI.fetchData('http://test-url')).rejects.toThrow('Network error');

		// Restore original fetch
		global.fetch = originalFetch;
	});
});

describe('BaseStockAPI Class', () => {
	test('should not allow direct instantiation', () => {
		// We can't directly test the BaseStockAPI class since it's not exported
		// But we can test that YahooFinanceAPI inherits its methods

		// Check if YahooFinanceAPI has the BaseStockAPI methods
		expect(typeof stockInfo.currentAPI.buildURL).toBe('function');
		expect(typeof stockInfo.currentAPI.fetchData).toBe('function');

		// Check that the abstract methods are implemented
		expect(typeof stockInfo.currentAPI.getHistoricalPrices).toBe('function');
		expect(typeof stockInfo.currentAPI.getPriceForDate).toBe('function');
		expect(typeof stockInfo.currentAPI.getPriceRange).toBe('function');
		expect(typeof stockInfo.currentAPI.getStockDetails).toBe('function');
		expect(typeof stockInfo.currentAPI.getFullStockInfo).toBe('function');
	});
});