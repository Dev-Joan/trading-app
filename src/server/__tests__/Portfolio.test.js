// Portfolio.test.js
import Portfolio from '../Portfolio';
import stockInfo from '../StockInfo';
import authInfo from '../AuthInfo';

// Mock dependencies
jest.mock('../StockInfo');
jest.mock('../AuthInfo');

describe('Portfolio Class', () => {
	let portfolio;

	beforeEach(() => {
		// Reset mocks before each test
		jest.clearAllMocks();

		// Create a fresh portfolio instance
		portfolio = new Portfolio();

		// Mock authInfo.saveCurrentData
		authInfo.saveCurrentData = jest.fn();
	});

	describe('Constructor and fromJSON', () => {
		test('should initialize with default values', () => {
			expect(portfolio.stocks).toEqual([]);
			expect(portfolio.pendingOrders).toEqual([]);
			expect(portfolio.pendingMoney).toEqual([]);
			expect(portfolio.money).toBe(0);
			expect(portfolio.transaction).toEqual([]);
			expect(portfolio.history).toEqual([]);
			expect(portfolio.limitOrders).toEqual([]);
			expect(portfolio.date).toEqual(new Date("2024-01-01T00:00:00"));
		});

		test('should create portfolio from JSON string', () => {
			let jsonString = JSON.stringify({
				stocks: [{ symbol: 'AAPL', quantity: 10, purchasePrice: 150 }],
				money: 5000,
				transaction: [{ type: 'market', orderType: 'buy' }],
				history: [{ date: '2024-01-01', value: 5000 }],
				limitOrders: [],
				date: "2024-02-01T00:00:00"
			});

			let result = Portfolio.fromJSON(jsonString);

			expect(result).toBeInstanceOf(Portfolio);
			expect(result.stocks).toEqual([{ symbol: 'AAPL', quantity: 10, purchasePrice: 150 }]);
			expect(result.money).toBe(5000);
			expect(result.date).toEqual(new Date("2024-02-01T00:00:00"));
		});

		test('should create portfolio from JSON object', () => {
			let jsonObj = {
				stocks: [{ symbol: 'TSLA', quantity: 5, purchasePrice: 200 }],
				money: 10000,
				transaction: [],
				history: [],
				limitOrders: []
			};

			let result = Portfolio.fromJSON(jsonObj);

			expect(result).toBeInstanceOf(Portfolio);
			expect(result.stocks).toEqual([{ symbol: 'TSLA', quantity: 5, purchasePrice: 200 }]);
			expect(result.money).toBe(10000);
			expect(result.date).toEqual(new Date("2024-01-01T00:00:00"));
		});
	});

	describe('validateOrderRequest', () => {
		test('should validate a valid market buy order', () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'market',
				action: 'buy',
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			let result = portfolio.validateOrderRequest(orderRequest);

			expect(result.isValid).toBe(true);
			expect(result.errors.every(e => e.valid)).toBe(true);
		});

		test('should validate a valid limit sell order', () => {
			let orderRequest = {
				stockSymbol: 'TSLA',
				orderType: 'limit',
				action: 'sell',
				price: 200,
				quantity: 5,
				timeFrame: '1h'
			};

			let result = portfolio.validateOrderRequest(orderRequest);

			expect(result.isValid).toBe(true);
			expect(result.errors.every(e => e.valid)).toBe(true);
		});

		test('should reject negative price', () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'market',
				action: 'buy',
				price: -50,
				quantity: 10,
				timeFrame: '1d'
			};

			let result = portfolio.validateOrderRequest(orderRequest);

			expect(result.isValid).toBe(false);
			expect(result.errors.find(e => e.id === 'priceNotNegative').valid).toBe(false);
		});

		test('should reject negative quantity', () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'market',
				action: 'buy',
				price: 150,
				quantity: -5,
				timeFrame: '1d'
			};

			let result = portfolio.validateOrderRequest(orderRequest);

			expect(result.isValid).toBe(false);
			expect(result.errors.find(e => e.id === 'quantityNotNegative').valid).toBe(false);
		});

		test('should reject invalid order type', () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'stop',  // Invalid
				action: 'buy',
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			let result = portfolio.validateOrderRequest(orderRequest);

			expect(result.isValid).toBe(false);
			expect(result.errors.find(e => e.id === 'orderType').valid).toBe(false);
		});

		test('should reject invalid action', () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'market',
				action: 'hold',  // Invalid
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			let result = portfolio.validateOrderRequest(orderRequest);

			expect(result.isValid).toBe(false);
			expect(result.errors.find(e => e.id === 'action').valid).toBe(false);
		});

		test('should reject missing stock symbol', () => {
			let orderRequest = {
				stockSymbol: '',
				orderType: 'market',
				action: 'buy',
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			let result = portfolio.validateOrderRequest(orderRequest);

			expect(result.isValid).toBe(false);
			expect(result.errors.find(e => e.id === 'stockSymbol').valid).toBe(false);
		});

		test('should reject invalid time frame', () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'market',
				action: 'buy',
				price: 150,
				quantity: 10,
				timeFrame: '1y'  // Invalid
			};

			let result = portfolio.validateOrderRequest(orderRequest);

			expect(result.isValid).toBe(false);
			expect(result.errors.find(e => e.id === 'timeFrame').valid).toBe(false);
		});
	});

	describe('stockModification', () => {
		test('should throw error for invalid order request', async () => {
			let invalidOrder = {
				stockSymbol: '',  // Invalid
				orderType: 'market',
				action: 'buy',
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			await expect(portfolio.stockModification(invalidOrder)).rejects.toThrow(/Validation error/);
		});

		test('should call buyStockMarket for market buy order', async () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'market',
				action: 'buy',
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			// Mock the buyStockMarket method
			portfolio.buyStockMarket = jest.fn().mockResolvedValue({});

			await portfolio.stockModification(orderRequest);

			expect(portfolio.buyStockMarket).toHaveBeenCalledWith(orderRequest);
			expect(authInfo.saveCurrentData).toHaveBeenCalled();
		});

		test('should call sellStockMarket for market sell order', async () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'market',
				action: 'sell',
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			// Mock the sellStockMarket method
			portfolio.sellStockMarket = jest.fn().mockResolvedValue({});

			await portfolio.stockModification(orderRequest);

			expect(portfolio.sellStockMarket).toHaveBeenCalledWith(orderRequest);
			expect(authInfo.saveCurrentData).toHaveBeenCalled();
		});

		test('should call buyStockLimit for limit buy order', async () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'limit',
				action: 'buy',
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			// Mock the buyStockLimit method
			portfolio.buyStockLimit = jest.fn().mockResolvedValue({});

			await portfolio.stockModification(orderRequest);

			expect(portfolio.buyStockLimit).toHaveBeenCalledWith(orderRequest);
			expect(authInfo.saveCurrentData).toHaveBeenCalled();
		});

		test('should call sellStockLimit for limit sell order', async () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				orderType: 'limit',
				action: 'sell',
				price: 150,
				quantity: 10,
				timeFrame: '1d'
			};

			// Mock the sellStockLimit method
			portfolio.sellStockLimit = jest.fn().mockResolvedValue({});

			await portfolio.stockModification(orderRequest);

			expect(portfolio.sellStockLimit).toHaveBeenCalledWith(orderRequest);
			expect(authInfo.saveCurrentData).toHaveBeenCalled();
		});
	});

	describe('fetchStockDataWithFallbacks', () => {
		test('should fetch stock data with the specified time frame', async () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				timeFrame: '1d'
			};

			let mockStockData = {
				values: [
					{ date: '2024-01-01T10:00:00Z', close: 150, open: 148, high: 152, low: 147, volume: 1000 }
				]
			};

			stockInfo.getFullStockInfo = jest.fn().mockResolvedValue(mockStockData);

			let result = await portfolio.fetchStockDataWithFallbacks(orderRequest);

			expect(result).toEqual(mockStockData);
			expect(stockInfo.getFullStockInfo).toHaveBeenCalledWith(
				'AAPL',
				expect.any(String),  // Start date
				expect.any(String),  // End date
				'1h'
			);
		});

		test('should try fallbacks if first attempt fails', async () => {
			let orderRequest = {
				stockSymbol: 'AAPL',
				timeFrame: '1h'
			};

			let mockStockData = {
				values: [
					{ date: '2024-01-01T10:00:00Z', close: 150, open: 148, high: 152, low: 147, volume: 1000 }
				]
			};

			// First call fails, second succeeds
			stockInfo.getFullStockInfo = jest.fn()
				.mockRejectedValueOnce(new Error('No data'))
				.mockResolvedValueOnce(mockStockData);

			let result = await portfolio.fetchStockDataWithFallbacks(orderRequest);

			expect(result).toEqual(mockStockData);
			expect(stockInfo.getFullStockInfo).toHaveBeenCalledTimes(2);
		});

		test('should throw error if all fallbacks fail', async () => {
			let orderRequest = {
				stockSymbol: 'UNKNOWN',
				timeFrame: '1h'
			};

			// All calls fail
			stockInfo.getFullStockInfo = jest.fn().mockRejectedValue(new Error('No data'));

			await expect(portfolio.fetchStockDataWithFallbacks(orderRequest))
				.rejects.toThrow(/No historical data found/);

			// Should have tried both 1h and 1d
			expect(stockInfo.getFullStockInfo).toHaveBeenCalledTimes(2);
			expect(portfolio.pendingOrders).toContain(orderRequest);
		});
	});

	describe('addCash', () => {
		test('should add positive amount to money', () => {
			portfolio.money = 1000;

			portfolio.addCash(500);

			expect(portfolio.money).toBe(1500);
		});

		test('should not change money for zero amount', () => {
			portfolio.money = 1000;

			portfolio.addCash(0);

			expect(portfolio.money).toBe(1000);
		});

		test('should not change money for negative amount', () => {
			portfolio.money = 1000;

			portfolio.addCash(-500);

			expect(portfolio.money).toBe(1000);
		});
	});

	describe('incrementDate', () => {
		test('should increment date by hours', () => {
			let initialDate = new Date(portfolio.date);

			portfolio.incrementDate({ unit: 'hours', value: 3 });

			let expectedDate = new Date(initialDate);
			expectedDate.setHours(expectedDate.getHours() + 3);

			expect(portfolio.date).toEqual(expectedDate);
			expect(authInfo.saveCurrentData).toHaveBeenCalled();
		});

		test('should increment date by days', () => {
			let initialDate = new Date(portfolio.date);

			portfolio.incrementDate({ unit: 'days', value: 5 });

			let expectedDate = new Date(initialDate);
			expectedDate.setDate(expectedDate.getDate() + 5);

			expect(portfolio.date).toEqual(expectedDate);
			expect(authInfo.saveCurrentData).toHaveBeenCalled();
		});

		test('should increment date by months', () => {
			let initialDate = new Date(portfolio.date);

			portfolio.incrementDate({ unit: 'months', value: 2 });

			let expectedDate = new Date(initialDate);
			expectedDate.setMonth(expectedDate.getMonth() + 2);

			expect(portfolio.date).toEqual(expectedDate);
			expect(authInfo.saveCurrentData).toHaveBeenCalled();
		});

		test('should increment multiple times when count is provided', () => {
			let initialDate = new Date(portfolio.date);

			portfolio.incrementDate({ unit: 'days', value: 1 }, 7);

			let expectedDate = new Date(initialDate);
			expectedDate.setDate(expectedDate.getDate() + 7);

			expect(portfolio.date).toEqual(expectedDate);
		});

		test('should throw error for unknown unit', () => {
			expect(() => {
				portfolio.incrementDate({ unit: 'decades', value: 1 });
			}).toThrow(/Unknown unit type/);
		});
	});

	describe('checkFundsAvailable', () => {
		test('should return true when sufficient funds are available', () => {
			portfolio.money = 1000;

			let result = portfolio.checkFundsAvailable(500);

			expect(result).toBe(true);
		});

		test('should throw error when insufficient funds', () => {
			portfolio.money = 100;

			expect(() => {
				portfolio.checkFundsAvailable(500);
			}).toThrow(/Insufficient funds/);
		});
	});

	describe('checkSharesAvailable', () => {
		test('should return holdings when sufficient shares are available', () => {
			portfolio.stocks = [
				{ symbol: 'AAPL', quantity: 10 },
				{ symbol: 'AAPL', quantity: 5 },
				{ symbol: 'TSLA', quantity: 3 }
			];

			let result = portfolio.checkSharesAvailable('AAPL', 12);

			expect(result).toHaveLength(2);
			expect(result[0].symbol).toBe('AAPL');
			expect(result[1].symbol).toBe('AAPL');
		});

		test('should throw error when insufficient shares', () => {
			portfolio.stocks = [
				{ symbol: 'AAPL', quantity: 10 },
				{ symbol: 'TSLA', quantity: 3 }
			];

			expect(() => {
				portfolio.checkSharesAvailable('AAPL', 15);
			}).toThrow(/Insufficient shares/);
		});
	});

	describe('buyStockMarket', () => {
		beforeEach(() => {
			// Mock dependencies
			portfolio.fetchStockDataWithFallbacks = jest.fn();
			portfolio.selectStockPrice = jest.fn();
			portfolio.executeOrder = jest.fn();
		});

		test('should execute a market buy order', async () => {
			// Set up portfolio
			portfolio.money = 2000;

			// Set up test data
			let orderRequest = {
				stockSymbol: 'AAPL',
				quantity: 10,
				timeFrame: '1d'
			};

			let mockStockData = {
				values: [
					{ date: '2024-01-01T10:00:00Z', close: 150, open: 148, high: 152, low: 147, volume: 1000 }
				]
			};

			let mockSelectedSlot = { date: '2024-01-01T10:00:00Z', close: 150 };

			// Set up mocks
			portfolio.fetchStockDataWithFallbacks.mockResolvedValue(mockStockData);
			portfolio.selectStockPrice.mockReturnValue(mockSelectedSlot);
			portfolio.executeOrder.mockReturnValue({ type: 'market', action: 'buy' });

			// Call method
			let result = await portfolio.buyStockMarket(orderRequest);

			// Check results
			expect(portfolio.fetchStockDataWithFallbacks).toHaveBeenCalledWith(orderRequest);
			expect(portfolio.selectStockPrice).toHaveBeenCalledWith(mockStockData.values, '1d');
			expect(portfolio.executeOrder).toHaveBeenCalledWith(orderRequest, mockSelectedSlot);
			expect(result).toEqual({ type: 'market', action: 'buy' });
		});

		test('should throw error if no affordable slots found', async () => {
			// Set up portfolio with limited funds
			portfolio.money = 100;

			// Set up test data
			let orderRequest = {
				stockSymbol: 'AAPL',
				quantity: 10,
				timeFrame: '1d'
			};

			let mockStockData = {
				values: [
					{ date: '2024-01-01T10:00:00Z', close: 150, open: 148, high: 152, low: 147, volume: 1000 }
				]
			};

			// Set up mocks
			portfolio.fetchStockDataWithFallbacks.mockResolvedValue(mockStockData);

			// Call method and expect error
			await expect(portfolio.buyStockMarket(orderRequest))
				.rejects.toThrow(/Insufficient funds/);
		});
	});

	describe('sellStockMarket', () => {
		beforeEach(() => {
			// Mock dependencies
			portfolio.checkSharesAvailable = jest.fn();
			portfolio.fetchStockDataWithFallbacks = jest.fn();
			portfolio.selectStockPrice = jest.fn();
			portfolio.executeOrder = jest.fn();
		});

		test('should execute a market sell order', async () => {
			// Set up test data
			let orderRequest = {
				stockSymbol: 'AAPL',
				quantity: 5,
				timeFrame: '1d'
			};

			let mockStockData = {
				values: [
					{ date: '2024-01-01T10:00:00Z', close: 150, open: 148, high: 152, low: 147, volume: 1000 }
				]
			};

			let mockSelectedSlot = { date: '2024-01-01T10:00:00Z', close: 150 };

			// Set up mocks
			portfolio.checkSharesAvailable.mockReturnValue([{ symbol: 'AAPL', quantity: 10 }]);
			portfolio.fetchStockDataWithFallbacks.mockResolvedValue(mockStockData);
			portfolio.selectStockPrice.mockReturnValue(mockSelectedSlot);
			portfolio.executeOrder.mockReturnValue({ type: 'market', action: 'sell' });

			// Call method
			let result = await portfolio.sellStockMarket(orderRequest);

			// Check results
			expect(portfolio.checkSharesAvailable).toHaveBeenCalledWith('AAPL', 5);
			expect(portfolio.fetchStockDataWithFallbacks).toHaveBeenCalledWith(orderRequest);
			expect(portfolio.selectStockPrice).toHaveBeenCalledWith(mockStockData.values, '1d');
			expect(portfolio.executeOrder).toHaveBeenCalledWith(orderRequest, mockSelectedSlot);
			expect(result).toEqual({ type: 'market', action: 'sell' });
		});

		test('should throw error if no historical data available', async () => {
			// Set up test data
			let orderRequest = {
				stockSymbol: 'AAPL',
				quantity: 5,
				timeFrame: '1d'
			};

			let mockStockData = {
				values: []  // Empty data
			};

			// Set up mocks
			portfolio.checkSharesAvailable.mockReturnValue([{ symbol: 'AAPL', quantity: 10 }]);
			portfolio.fetchStockDataWithFallbacks.mockResolvedValue(mockStockData);

			// Call method and expect error
			await expect(portfolio.sellStockMarket(orderRequest))
				.rejects.toThrow(/No values available/);
		});
	});

	describe('executeOrder', () => {
		test('should execute a buy order', () => {
			// Set up portfolio
			portfolio.money = 2000;
			portfolio.stocks = [];
			portfolio.transaction = [];

			// Set up test data
			let orderRequest = {
				stockSymbol: 'AAPL',
				action: 'buy',
				quantity: 10
			};

			let selectedSlot = {
				date: '2024-01-01T10:00:00Z',
				close: 150
			};

			// Mock recordTransaction
			portfolio.recordTransaction = jest.fn().mockReturnValue({
				type: 'market',
				orderType: 'buy',
				symbol: 'AAPL'
			});

			// Call method
			let result = portfolio.executeOrder(orderRequest, selectedSlot);

			// Check results
			expect(portfolio.money).toBe(500);  // 2000 - (10 * 150)
			expect(portfolio.stocks).toHaveLength(1);
			expect(portfolio.stocks[0].symbol).toBe('AAPL');
			expect(portfolio.stocks[0].quantity).toBe(10);
			expect(portfolio.stocks[0].purchasePrice).toBe(150);
			expect(portfolio.recordTransaction).toHaveBeenCalledWith(orderRequest, selectedSlot);
			expect(result).toEqual({
				type: 'market',
				orderType: 'buy',
				symbol: 'AAPL'
			});
		});

		test('should execute a sell order', () => {
			// Set up portfolio
			portfolio.money = 1000;
			portfolio.stocks = [
				{ symbol: 'AAPL', quantity: 10, purchasePrice: 140 }
			];
			portfolio.transaction = [];

			// Set up test data
			let orderRequest = {
				stockSymbol: 'AAPL',
				action: 'sell',
				quantity: 5
			};

			let selectedSlot = {
				date: '2024-01-01T10:00:00Z',
				close: 160
			};

			// Mock methods
			portfolio.checkSharesAvailable = jest.fn().mockReturnValue(portfolio.stocks);
			portfolio.recordTransaction = jest.fn().mockReturnValue({
				type: 'market',
				orderType: 'sell',
				symbol: 'AAPL'
			});

			// Call method
			let result = portfolio.executeOrder(orderRequest, selectedSlot);

			// Check results
			expect(portfolio.money).toBe(1800);  // 1000 + (5 * 160)
			expect(portfolio.stocks[0].quantity).toBe(5);  // Reduced from 10
			expect(portfolio.recordTransaction).toHaveBeenCalledWith(orderRequest, selectedSlot);
			expect(result).toEqual({
				type: 'market',
				orderType: 'sell',
				symbol: 'AAPL'
			});
		});

		test('should completely remove a stock when selling all shares', () => {
			// Set up portfolio
			portfolio.money = 1000;
			portfolio.stocks = [
				{ symbol: 'AAPL', quantity: 5, purchasePrice: 140 }
			];
			portfolio.transaction = [];

			// Set up test data
			let orderRequest = {
				stockSymbol: 'AAPL',
				action: 'sell',
				quantity: 5  // Sell all
			};

			let selectedSlot = {
				date: '2024-01-01T10:00:00Z',
				close: 160
			};

			// Mock methods
			portfolio.checkSharesAvailable = jest.fn().mockReturnValue(portfolio.stocks);
			portfolio.recordTransaction = jest.fn().mockReturnValue({
				type: 'market',
				orderType: 'sell',
				symbol: 'AAPL'
			});

			// Call method
			portfolio.executeOrder(orderRequest, selectedSlot);

			// Check results
			expect(portfolio.money).toBe(1800);  // 1000 + (5 * 160)
			expect(portfolio.stocks).toHaveLength(0);  // Stock should be removed
		});
	});

	describe('recordTransaction', () => {
		test('should record a transaction in history', () => {
			// Set up portfolio
			portfolio.transaction = [];
			portfolio.date = new Date('2024-01-01T12:00:00Z');

			// Set up test data
			let orderRequest = {
				orderType: 'market',
				action: 'buy',
				stockSymbol: 'AAPL',
				quantity: 10
			};

			let selectedSlot = {
				date: '2024-01-01T10:00:00Z',
				close: 150
			};

			// Call method
			let result = portfolio.recordTransaction(orderRequest, selectedSlot);

			// Check results
			expect(portfolio.transaction).toHaveLength(1);
			expect(result).toEqual({
				type: 'market',
				orderType: 'buy',
				symbol: 'AAPL',
				quantity: 10,
				price: 150,
				total: 1500,
				sellDate: '2024-01-01T10:00:00Z',
				transactionDate: portfolio.date,
				fees: 0
			});
		});
	});
});