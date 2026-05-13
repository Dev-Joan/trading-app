const config = require('./config');


/**
 * Virtual class to be extended by all other APIs
 */
class BaseStockAPI {

	//Forcing this to be an abstract class.
	//Using this https://stackoverflow.com/questions/597769/how-do-i-create-an-abstract-base-class-in-javascript as an example
	//If there is a better approach in modern JS, I couldn't find it.
	constructor() {
		if (this.constructor === BaseStockAPI) {
			throw new Error("Abstract classes can't be instantiated.");
		}
		this.baseURL = '';
	}

	/**
	 * Utility method to build URL with query parameters
	 * @param {string} endpoint - API endpoint
	 * @param {Object} params - Query parameters
	 * @returns {string} Full URL with query parameters
	 */
	buildURL(endpoint, params = {}) {
		let url = `${this.baseURL}${endpoint}`;
		let queryParts = [];

		for (let key in params) {
			let value = params[key];

			if (value !== undefined && value !== null) {
				let queryPart = key + '=' + value;
				queryParts.push(queryPart);
			}
		}

		let queryString = '';
		if (queryParts.length > 0) {
			queryString = queryParts.join('&');
			url = url + '?' + queryString;
		}
	
		return url;
	}

	/**
	 * Generic fetch method with error handling
	 * @param {string} url - Full URL to fetch
	 * @returns {Promise<Object>} Response data
	 */
	async fetchData(url) {
		let response;
		try {
			response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error(`API fetch error: ${error.message}`);
			throw error;
		}
		return await response.json();
	}

	/**
	 * Get historical stock prices for a date range
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * @param {string} interval - Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo) (Values below 1 day may fail)
	 * @returns {Promise<Array>} Historical price data
	 */
	async getHistoricalPrices(symbol, startDate, endDate, interval = '1d') {
		throw new Error('Method not implemented');
	}

	/**
	 * Get stock price for a specific date
	 * @param {string} symbol - Stock symbol
	 * @param {string} date - Date (YYYY-MM-DD)
	 * @returns {Promise<Object>} Stock price data
	 */
	async getPriceForDate(symbol, date) {
		throw new Error('Method not implemented');
	 }

	/**
	 * Get price range for a period
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * @returns {Promise<Object>} Price range data
	 */
	async getPriceRange(symbol, startDate, endDate) {
		throw new Error('Method not implemented');
	}

	/**
	* Get detailed information about a stock symbol
	* @param {string} symbol - Stock symbol
	* @returns {Promise<Object>} Detailed stock information
	*/
	async getStockDetails(symbol) {
		throw new Error('Method not implemented');
	}

	/**
	 * Get comprehensive stock information including price history and details
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * @param {string} interval - Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo) (Values below 1 day may fail)
	 * @returns {Promise<Object>} Comprehensive stock data
	 */
	async getFullStockInfo(symbol, startDate, endDate, interval) {
		throw new Error('Method not implemented');
	}

	async getStockInfo() {
		throw new Error('Method not implemented');
	}

	async getAvailableStocks() {
		throw new Error('Method not implemented');
	}
}


class YahooFinanceAPI extends BaseStockAPI {
	constructor() {
		super();
		this.baseURL = config.baseUrl + "api/yfinance";		
	}

	async getStockInfo(symbol = 'AAPL') {		
		try {
			let response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			let data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching stock data:', error);
			throw error;
		}

	}

	/**
	 * Get historical stock prices for a date range
	 * 
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * @param {string} interval - Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo) (Values below 1 day may fail)
	 * 
	 * @returns {Promise<Array>} Historical price data
	 */
	async getHistoricalPrices(symbol, startDate, endDate, interval = '1d') {		
		let url = this.buildURL('/stock/history', { symbol, startDate, endDate, interval });		
		return this.fetchData(url);
	}

	/**
	 * Get stock price for a specific date
	 * 
	 * @param {string} symbol - Stock symbol
	 * @param {string} date - Date (YYYY-MM-DD)
	 * 
	 * @returns {Promise<Object>} Stock price data
	 */
	async getPriceForDate(symbol, date) {
		let url = this.buildURL('/stock/price', { symbol, date});
		return this.fetchData(url);
	}

	/**
	 * Get price range for a period
	 * 
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * 
	 * @returns {Promise<Object>} Price range data
	 */
	async getPriceRange(symbol, startDate, endDate) {
		let url = this.buildURL('/stock/range', {symbol,startDate,endDate});
		return this.fetchData(url);
	}

	/**
	 * Get detailed information about a stock symbol
	 * 
	 * @param {string} symbol - Stock symbol
	 * 
	 * @returns {Promise<Object>} Detailed stock information
	 */
	async getStockDetails(symbol) {
		let url = this.buildURL('/stock/details', { symbol });
		return this.fetchData(url);
	}

	/**
	 * Get comprehensive stock information including price history and details
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * @param {string} interval - Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo) (Values below 1 day may fail)
	 * @returns {Promise<Object>} Comprehensive stock data
	 */
	async getFullStockInfo(symbol, startDate, endDate, interval = '1d') {
		let url = this.buildURL('/stock/full', {
			symbol,
			startDate,
			endDate,
			interval
		});
		return this.fetchData(url);
	}


	/**
	 * 
	 * @todo Should return list of all stocks yahoo supports
	 * Not sure how to do that.
	 * @returns {array}
	 */
	async getAvailableStocks() {
		
		return [
			{ name: 'Apple', symbol: 'AAPL', full: 'Apple (AAPL)' },
			{ name: 'Microsoft', symbol: 'MSFT', full: 'Microsoft (MSFT)' },
			{ name: 'Amazon', symbol: 'AMZN', full: 'Amazon (AMZN)' },
			{ name: 'Google', symbol: 'GOOGL', full: 'Google (GOOGL)' },
			{ name: 'Meta', symbol: 'META', full: 'Meta (META)' },
			{ name: 'Netflix', symbol: 'NFLX', full: 'Netflix (NFLX)' },
			{ name: 'Tesla', symbol: 'TSLA', full: 'Tesla (TSLA)' },
			{ name: 'AMD', symbol: 'AMD', full: 'AMD (AMD)' },
			{ name: 'NVIDIA', symbol: 'NVDA', full: 'NVIDIA (NVDA)' },
			{ name: 'Intel', symbol: 'INTC', full: 'Intel (INTC)' },
			{ name: 'Alibaba', symbol: 'BABA', full: 'Alibaba (BABA)' },
			{ name: 'Paypal', symbol: 'PYPL', full: 'Paypal (PYPL)' },
			{ name: 'Visa', symbol: 'V', full: 'Visa (V)' },
			{ name: 'Mastercard', symbol: 'MA', full: 'Mastercard (MA)' },
			{ name: 'JPMorgan Chase', symbol: 'JPM', full: 'JPMorgan Chase (JPM)' },
			{ name: 'Berkshire Hathaway', symbol: 'BRK.B', full: 'Berkshire Hathaway (BRK.B)' },
			{ name: 'Johnson & Johnson', symbol: 'JNJ', full: 'Johnson & Johnson (JNJ)' },
			{ name: 'ExxonMobil', symbol: 'XOM', full: 'ExxonMobil (XOM)' },
			{ name: 'Chevron', symbol: 'CVX', full: 'Chevron (CVX)' },
			{ name: 'Walmart', symbol: 'WMT', full: 'Walmart (WMT)' },
		];
		
	}
}

/**
 * Service class to keep seperation of concerns
 * 
 */
class StockInfo {

	// This should be the same for all stockInfos, and should not be easy to change.
	// # makes it private, could possibly use Object.freeze, but private is better for now
	//If we need to make it visible later, we can swap it. 
	static #availableStocksAPIs = {
		"yahoo-finance": new YahooFinanceAPI(),
		"OfflineData": null,
		"Dinazon": null,
		"node-google-finance": null,
		"alpaca": null,
		"nasdaq": null
	};

	constructor() {
		this.setStockProvider("yahoo-finance");
	}

	/**
	 * 
	 * @returns {string} Current stock API in use
	 */
	getUsedStockAPI() {
		return this.currentStockProvider;
	}

	/**
	 * Used to change the stock provider, must be a string that is valid.
	 * @param {string} api - Name of the API to use
	 * @throws {Error} If the API name is not in the available list
	 */
	setStockProvider(api) {
		if (!Object.keys(StockInfo.#availableStocksAPIs).includes(api)) {
			throw new Error(`Invalid stock provider. Must be one of: ${StockInfo.#availableStocksAPIs.join(', ')}`);
		}
		this.currentStockProvider = api;
		this.currentAPI = StockInfo.#availableStocksAPIs[api];
	}

	/**
	 * Get historical stock prices for a date range
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * @param {string} interval - Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo) (Values below 1 day may fail)
	 * @returns {Promise<Array>} Historical price data
	 */
	async getHistoricalPrices(symbol, startDate, endDate, interval) {
		return this.currentAPI.getHistoricalPrices(symbol, startDate, endDate, interval);
	}

	/**
	 * Get stock price for a specific date
	 * @param {string} symbol - Stock symbol
	 * @param {string} date - Date (YYYY-MM-DD)
	 * @returns {Promise<Object>} Stock price data
	 */
	async getPriceForDate(symbol, date) {
		return this.currentAPI.getPriceForDate(symbol, date);
	}

	/**
	 * Get price range for a period
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * @returns {Promise<Object>} Price range data
	 */
	async getPriceRange(symbol, startDate, endDate) {
		return this.currentAPI.getPriceRange(symbol, startDate, endDate);
	}


	/**
	 * Get all possible Stocks
	 * @returns {array} with avialble stocks
	 */
	async getAvailableStocks() {
		return this.currentAPI.getAvailableStocks();
	}

	/**
	 * Get detailed information about a stock symbol
	 * @param {string} symbol - Stock symbol
	 * @returns {Promise<Object>} Detailed stock information including company details
	 */
	async getStockDetails(symbol) {
		return this.currentAPI.getStockDetails(symbol);
	}

	/**
	 * Get comprehensive stock information including price history and details
	 * @param {string} symbol - Stock symbol
	 * @param {string} startDate - Start date (YYYY-MM-DD)
	 * @param {string} endDate - End date (YYYY-MM-DD)
	 * @param {string} interval - Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo) (Values below 1 day may fail)
	 * @returns {Promise<Object>} Comprehensive stock data
	 */
	async getFullStockInfo(symbol, startDate, endDate, interval = '1d') {
		let val = await this.currentAPI.getFullStockInfo(symbol, startDate, endDate, interval);		
		return val;
	}
}

//Apparently ESLing error if you don't give it a name when you return it?
const stockInfo = new StockInfo();
export default stockInfo;