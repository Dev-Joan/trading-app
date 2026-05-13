
const yahooFinance = require('yahoo-finance2').default;
const express = require('express');


const router = express.Router();

//Using from here
//https://github.com/gadicc/node-yahoo-finance2/blob/devel/docs/modules/chart.md

//Example to copy
router.get('/stock', async (req, res) => {
	let symbol = 'AAPL';
	let queryOptions = { period1: '2024-11-10', return: "object" };

	try {		
		let result = await yahooFinance.chart(symbol, queryOptions);
		res.json(result);

		//Alternative if previous breaks
		// const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);

	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

/**
 * Retrieves historical stock prices for a given date range.
 * @route GET /api/stock/history
 * @param {string} symbol - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} [interval='1d'] - Data interval ('1d', '1wk', '1mo')
 * @returns {Object[]} Array of historical price data objects
 * @returns {string} Object[].date - The date of the price data
 * @returns {number} Object[].price - Closing price for the interval
 * @returns {number} Object[].high - Highest price for the interval
 * @returns {number} Object[].low - Lowest price for the interval
 * @throws {400} If required parameters are missing or dates are invalid
 * @throws {500} If there's an error fetching data from Yahoo Finance
 */
router.get('/stock/history', async (req, res) => {
	let { symbol, startDate, endDate, interval } = req.query;

	if (!symbol || !startDate || !endDate) {
		return res.status(400).json({
			error: 'Missing required parameters: symbol, startDate, and endDate are required'
		});
	}

	//Testing dates
	try {
		new Date(startDate);
		new Date(endDate);
	} catch (err) {
		return res.status(400).json({
			error: 'Invalid date format'
		});
	}

	interval = interval || '1d'; //Defaulting to 1 day as smaller is probably not reasonable

	let queryOptions = {
		period1: startDate,
		period2: endDate,
		interval: interval,
		return: "array"
	};

	let historicalData;
	try {	
		
		
		let result = await yahooFinance.chart(symbol, queryOptions);
		
		
		if (result.quotes.length === 0) {
			return res.status(400).json({
				error: `No price data found for ${symbol} between ${startDate} and ${endDate}`
			});
		}

		historicalData = result.quotes.map(quote => ({
			date: quote.date,
			price: quote.close,
			high: quote.high,
			low: quote.low
		}));
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
	res.json(historicalData);
	
});

/**
 * Gets stock price for a specific date, searching within a 5-day window if exact date unavailable.
 * @route GET /api/stock/price
 * @param {string} symbol - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @param {string} date - Target date in YYYY-MM-DD format
 * @returns {Object} Price data for the closest available date
 * @returns {string} Object.date - The actual date of the price data
 * @returns {number} Object.price - Closing price
 * @returns {number} Object.high - Highest price for the day
 * @returns {number} Object.low - Lowest price for the day
 * @returns {boolean} Object.isExactDate - Whether the returned date matches the requested date
 * @throws {400} If required parameters are missing or date is invalid
 * @throws {400} If no price data is found within the 5-day window
 * @throws {500} If there's an error fetching data from Yahoo Finance
 */
router.get('/stock/price', async (req, res) => {
	let { symbol, date } = req.query;

	if (!symbol || !date) {
		return res.status(400).json({
			error: 'Missing required parameters: symbol and date are required'
		});
	}
	let queryOptions, targetDate;

	try {
		// Look 5 days before and after the target date, in case of missing data
		let startDate = new Date(date);
		startDate.setDate(startDate.getDate() - 5);

		let endDate = new Date(date);
		endDate.setDate(endDate.getDate() + 5);

		queryOptions = {
			period1: startDate.toISOString().split('T')[0],
			period2: endDate.toISOString().split('T')[0],
			interval: '1d',
			return: "array"
		};

		targetDate = new Date(date).getTime();

	} catch (err) {
		return res.status(500).json({ error: err.message });//Probably badly formatted dates
	}


	let result;
	try{
		result = await yahooFinance.chart(symbol, queryOptions);

		if (result.quotes.length === 0) {
			return res.status(400).json({
				error: `No price data found for ${symbol} around ${date}`
			});
		}
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}

	// Find the closest date
	
	let closestPrice = result.quotes.reduce((prev, curr) => {
		let prevDiff = Math.abs(new Date(prev.date).getTime() - targetDate);
		let currDiff = Math.abs(new Date(curr.date).getTime() - targetDate);
		return currDiff < prevDiff ? curr : prev;
	});


	//This might throw an error, But I'm fairly certain one of these will work.
	try {
		res.json({
			date: closestPrice.date,
			price: closestPrice.close,
			high: closestPrice.high,
			low: closestPrice.low,
			isExactDate: closestPrice.date.toISOString().split('T')[0] === date
		});
	} catch (error) {
		res.json({
			date: closestPrice.date,
			price: closestPrice.close,
			high: closestPrice.high,
			low: closestPrice.low,
			isExactDate: closestPrice.date === date
		});
	}
	
	
});

/**
 * Gets price details for a stock over a specified period.
 * @route GET /api/stock/range
 * @param {string} symbol - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Object} Price range statistics
 * @returns {number} Object.lowest - Lowest price during the period
 * @returns {number} Object.highest - Highest price during the period
 * @returns {number} Object.startPrice - Closing price on the start date
 * @returns {number} Object.endPrice - Closing price on the end date
 * @returns {string} Object.periodStart - Start date of the period
 * @returns {string} Object.periodEnd - End date of the period
 * @throws {400} If required parameters are missing or dates are invalid
 * @throws {400} If no price data is found for the specified period
 * @throws {500} If there's an error fetching data from Yahoo Finance
 */
router.get('/stock/range', async (req, res) => {
	let { symbol, startDate, endDate } = req.query;

	if (!symbol || !startDate || !endDate) {
		return res.status(400).json({
			error: 'Missing required parameters: symbol, startDate, and endDate are required'
		});
	}

	let queryOptions = {
		period1: startDate,
		period2: endDate,
		interval: '1d',
		return: "array"
	};
	let result;

	try {	
		result = await yahooFinance.chart(symbol, queryOptions);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
	if (result.quotes.length === 0) {
		return res.status(400).json({
			error: `No price data found for ${symbol} between ${startDate} and ${endDate}`
		});
	}

	let priceRange = {
		lowest: Math.min(...result.quotes.map(q => q.low)),
		highest: Math.max(...result.quotes.map(q => q.high)),
		startPrice: result.quotes[0].close,
		endPrice: result.quotes[result.quotes.length - 1].close,
		periodStart: startDate,
		periodEnd: endDate
	};

	res.json(priceRange);
	
});

/**
 * Gets detailed information about a stock symbol.
 * @route GET /api/yfinance/stock/details
 * @param {string} symbol - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @returns {Object} Detailed stock information
 * @returns {string} Object.fullName - Full company name
 * @returns {string} Object.shortName - Short company name
 * @returns {string} Object.currency - Trading currency
 * @returns {string} Object.exchange - Exchange name
 * @returns {string} Object.language - Quote language
 * @returns {string} Object.region - Trading region
 * @returns {string} Object.symbol - Stock symbol
 * @throws {400} If required parameters are missing
 * @throws {500} If there's an error fetching data from Yahoo Finance
 */
router.get('/stock/details', async (req, res) => {
	let { symbol } = req.query;

	if (!symbol) {
		return res.status(400).json({
			error: 'Missing required parameter: symbol is required'
		});
	}

	try {
		let result = await yahooFinance.quote(symbol);

		let details = {
			fullName: result.longName || '',
			shortName: result.shortName || '',
			currency: result.currency || '',
			exchange: result.fullExchangeName || '',
			language: result.language || '',
			region: result.region || '',
			symbol: result.symbol || ''
		};

		res.json(details);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
});

/**
 * Gets all the relative info for the stock 
 * @route GET /api/yfinance/stock/full
 * @param {string} symbol - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} [interval='1d'] - Data interval ('1d', '1wk', '1mo')
 * @returns {Object} Comprehensive stock data
 * @returns {string} Object.fullName - Full company name
 * @returns {string} Object.symbol - Stock symbol
 * @returns {string} Object.interval - Time interval of data
 * @returns {string} Object.startDate - Period start date
 * @returns {string} Object.endDate - Period end date
 * @returns {number} Object.startPrice - First price in period
 * @returns {number} Object.endPrice - Last price in period
 * @returns {Array} Object.values - Array of price data points
 * @returns {number} Object.max - Highest price in period
 * @returns {number} Object.min - Lowest price in period
 * @returns {Object} Object.details - Detailed company information
 * @throws {400} If required parameters are missing or dates are invalid
 * @throws {500} If there's an error fetching data from Yahoo Finance
 */
router.get('/stock/full', async (req, res) => {
	let { symbol, startDate, endDate, interval = '1d' } = req.query;


	if (!symbol || !startDate || !endDate) {
		console.error('Missing required parameters: symbol, startDate, and endDate are required');
		return res.status(400).json({
			
			error: 'Missing required parameters: symbol, startDate, and endDate are required'
		});
	}

	let response;
	try {

		// Get quote data for company details
		let quoteData = await yahooFinance.quote(symbol);
		// console.log("quoteData: ", quoteData);

		// Get historical price data
		let chartData = await yahooFinance.chart(symbol, {
			period1: startDate,
			period2: endDate,
			interval: interval,
			return: "array"
		});

		// console.log("chartData: ", chartData.meta);

		if (!chartData.quotes || chartData.quotes.length === 0) {

			console.error(`No price data found for ${symbol} between ${startDate} and ${endDate}`);
			return res.status(400).json({
				error: `No price data found for ${symbol} between ${startDate} and ${endDate}`
			});
		}

		
		let values = chartData.quotes.map(quote => ({
			date: quote.date,
			open: quote.open,
			close: quote.close,
			high: quote.high,
			low: quote.low,
			volume: quote.volume
		}));

		// Calculate min and max prices
		let highPrices = chartData.quotes.map(q => q.high);
		let lowPrices = chartData.quotes.map(q => q.low);

		response = {
			fullName: quoteData.longName || '',
			symbol: symbol,
			interval: interval,
			startDate: startDate,
			endDate: endDate,
			startPrice: values[0].open,
			endPrice: values[values.length - 1].close,
			values: values,
			max: Math.max(...highPrices),
			min: Math.min(...lowPrices),
			details: {
				fullName: quoteData.longName || '',
				shortName: quoteData.shortName || '',
				currency: quoteData.currency || '',
				exchange: quoteData.fullExchangeName || '',
				language: quoteData.language || '',
				region: quoteData.region || '',
				symbol: quoteData.symbol || ''
			}
		};		
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message });
	}
	res.json(response);
});

module.exports = router;