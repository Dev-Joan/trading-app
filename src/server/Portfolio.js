import stockInfo from "./StockInfo";
import authInfo from "./AuthInfo";

/**
 * @typedef {Object} OrderRequest
 * @property {string} stockSymbol - Symbol of the stock
 * @property {'market' | 'limit'} orderType - Type of order
 * @property {'buy' | 'sell'} action - Buy or sell action
 * @property {number} price - Price of the stock
 * @property {number} quantity - Number of shares
 * @property {'1h' | '1d' | '1wk' | '1mo'} timeFrame - Time frame
 */


/**
 * Portfoloio class
 * 
 */
class Portfolio { 

	/**
	 * Creates a new portfolio instance with default values
	 * @constructor
	 * 
	 * @example
	 * let portfolio = new Portfolio();
	 * 
	 * @property {Array} stocks - List of stocks with their purchase details
	 * @property {Object[]} stocks[].stock - Individual stock entry
	 * @property {string} stocks[].symbol - Stock symbol/name
	 * @property {Date} stocks[].purchaseDate - Time of purchase
	 * @property {number} stocks[].purchasePrice - Value at time of purchase
	 * @property {number} stocks[].quantity - Number of shares
	 * 
	 * @property {number} money - Available cash balance
	 * 
	 * @property {Array} transaction - Record of all historical transactions
	 * @property {string} transaction[].type - Type of transaction (buy/sell)
	 * @property {string} transaction[].symbol - Stock symbol
	 * @property {number} transaction[].price - Price per share
	 * @property {number} transaction[].quantity - Number of shares
	 * @property {Date} transaction[].date - Transaction date
	 * 
	 * @property {Array} history - Historical portfolio value tracking
	 * @property {Date} history[].date - Date of valuation
	 * @property {number} history[].value - Total portfolio value
	 * 
	 * @property {Array} limitOrders - Pending limit orders
	 * @property {string} limitOrders[].symbol - Stock symbol
	 * @property {number} limitOrders[].price - Target price
	 * @property {number} limitOrders[].quantity - Number of shares
	 * @property {string} limitOrders[].action - 'buy' or 'sell'
	 * @property {Date} limitOrders[].createdAt - When order was created
	 * 
	 * @property {Date} date - Current simulation date
	 */
	constructor() { 
		
		this.stocks = [];//List of stocks with time of purchase, value at time, and stock name
		this.pendingStocks = [];
		this.pendingOrders = [];
		this.pendingMoney = [];
		this.money = 0;
		this.transaction = [];//All transactions ever
		this.history = []; //List of each change in portfolio value? How to do this IDK
		this.limitOrders = [];//List of limit orders with stock name, time, price, and sell vs buy
		this.date = new Date("2024-01-01T00:00:00");
	}

	/**
	 * Creates a Portfolio instance from JSON data
	 * 
	 * @static
	 * @method
	 * 
	 * @param {string|Object} json - JSON string or object containing portfolio data
	 * @param {Object[]} json.stocks - Array of stock objects
	 * @param {number} json.money - Available cash balance
	 * @param {Object[]} json.transaction - Transaction history
	 * @param {Object[]} json.history - Portfolio history
	 * @param {Object[]} json.limitOrders - Pending limit orders
	 * @param {string|Date} [json.date] - Portfolio date (defaults to Jan 1, 2024 if not provided)
	 * 
	 * @returns {Portfolio} A new Portfolio instance populated with the provided data
	 * 
	 * @example
	 * // From a JSON string
	 * let portfolio = Portfolio.fromJSON('{"stocks":[],"money":10000,"transaction":[]}');
	 * 
	 * // From an object
	 * let portfolio = Portfolio.fromJSON({
	 *   stocks: [],
	 *   money: 10000,
	 *   transaction: [],
	 *   history: [],
	 *   limitOrders: [],
	 *   date: "2024-02-15T00:00:00"
	 * });
	 */
	static fromJSON(json) {
		let portfolio = new Portfolio();
		let data = typeof json === 'string' ? JSON.parse(json) : json;

		portfolio.stocks = data.stocks;
		portfolio.pendigStocks = data.pendigStocks;
		portfolio.pendingOrders = data.pendingOrders;
		portfolio.pendingMoney = data.pendingMoney;
		portfolio.money = data.money;
		portfolio.transaction = data.transaction;
		portfolio.history = data.history;
		portfolio.limitOrders = data.limitOrders;
		if (data.date) {			
			portfolio.date = new Date(data.date);
		} else {
			portfolio.date = new Date("2024-01-01T00:00:00");
		}
		return portfolio;
	}
	



	/**
	 * Validates an order request object
	 * 
	 * @example
	 * // Validate a market buy order
	 * let validation = validateOrderRequest({
	 *   stockSymbol: 'AAPL',
	 *   orderType: 'market',
	 *   action: 'buy',
	 *   price: 150,
	 *   quantity: 10,
	 *   timeFrame: '1d'
	 * });
	 * 
	 * if (!validation.isValid) {
	 *   console.error('Validation failed');
	 * }
	 * @method
	 * 
	 * @param {OrderRequest} orderRequest - The order request to validate. See {@link OrderRequest} for details.
	 * @property {string} stockSymbol - Symbol of the stock
	 * @property {'market' | 'limit'} orderType - Type of order
	 * @property {'buy' | 'sell'} action - Buy or sell action
	 * @property {number} price - Price of the stock
	 * @property {number} quantity - Number of shares
	 * @property {'1h' | '1d' | '1wk' | '1mo'} timeFrame - Time frame
	 * 
	 * 
	 * @returns {Object} validation - Validation result
	 * @returns {boolean} validation.isValid - Whether the request is valid
	 * @returns {Array<Object>} validation.errors - List of validation errors
	 * @returns {string} validation.errors[].id - Error identifier
	 * @returns {boolean} validation.errors[].valid - Whether this specific check passed
	 * @returns {string} validation.errors[].message - Error message
	 * 
	 */
	validateOrderRequest (orderRequest){
		let validOrderTypes = ["market", "limit"];
		let validActions = ["buy", "sell"];
		let validTimeFrames = ['1h', '1d', '1wk', '1mo'];

		let isNumberDefined = (n) => n !== null && n !== undefined;

		return {
			isValid: Boolean(orderRequest &&
				isNumberDefined(orderRequest.price) &&
				isNumberDefined(orderRequest.quantity) &&
				(orderRequest.price > 0 || orderRequest.quantity > 0) &&
				!(orderRequest.price < 0) &&
				!(orderRequest.quantity < 0) &&
				validOrderTypes.includes(orderRequest.orderType) &&
				validActions.includes(orderRequest.action) &&
				!!orderRequest.stockSymbol?.trim() && //? here does optional chaining, allows us to not need as much validation. 
				validTimeFrames.includes(orderRequest.timeFrame) &&
				((orderRequest.orderType !== validOrderTypes[1]) || (orderRequest.price !== 0))),//If it's a limit order, it can't have a price of 0
			
			errors: [
				{
					id: 'request',
					valid: orderRequest !== null && orderRequest !== undefined,
					message: 'Need a valid object passed with stockSymbol, orderType, price, quantity, action'
				},
				{
					id: 'priceQuantity',
					valid: isNumberDefined(orderRequest?.price) && isNumberDefined(orderRequest?.quantity) &&
						(orderRequest.price > 0 || orderRequest.quantity > 0),
					message: "Can't do anything without a quantity or price."
				},
				{
					id: 'priceNotNegative',
					valid: !(orderRequest.price < 0),
					message: "Price can't be negative" + orderRequest.price
				},
				{
					id: 'quantityNotNegative',
					valid: !(orderRequest.quantity < 0),
					message: "Quantity can't be negative" 
				},
				{
					id: 'orderType',
					valid: validOrderTypes.includes(orderRequest?.orderType),
					message: 'Only Market and Limit orders are accepted at the moment.'
				},
				{
					id: 'action',
					valid: validActions.includes(orderRequest?.action),
					message: 'An order should be either buy or sell.'
				},
				{
					id: 'stockSymbol',
					valid: !!orderRequest?.stockSymbol?.trim(),
					message: 'Need a stock.'
				},
				{
					id: 'timeFrame',
					valid: validTimeFrames.includes(orderRequest.timeFrame),
					message: 'Only 1h, 1d, 1w, and 1m are valid at the moment'
				}
			]
		};
	};

	/**
	 * Processes a stock order (buy/sell) at market or limit price
	 * 
	 * @example 
	 * // Buy 10 shares of Apple stock at market price
	 * await portfolio.stockModification({
	 *   stockSymbol: 'AAPL',
	 *   orderType: 'market',
	 *   action: 'buy',
	 *   quantity: 10,
	 *   timeFrame: '1d'
	 * });
	 * 
	 * // Sell 5 shares of Tesla at limit price of $200
	 * await portfolio.stockModification({
	 *   stockSymbol: 'TSLA',
	 *   orderType: 'limit',
	 *   action: 'sell',
	 *   price: 200,
	 *   quantity: 5
	 * });
	 * 
	 * @async
	 * @method
	 * 
	 * @param {Object} orderRequest - The order request details
	 * @param {string} orderRequest.stockSymbol - Symbol of the stock to trade
	 * @param {'market' | 'limit'} orderRequest.orderType - Type of order (market or limit)
	 * @param {'buy' | 'sell'} orderRequest.action - Whether to buy or sell the stock
	 * @param {number} orderRequest.quantity - Number of shares to trade
	 * @param {number} [orderRequest.price] - Price per share (required for limit orders)
	 * @param {string} orderRequest.timeFrame - Time frame for market orders ('1h', '1d', '1w', '1mo')
	 * 
	 * @returns {Promise<void>} - No direct return, but executes appropriate buy/sell method
	 * 
	 * @throws {Error} If validation fails with specific validation error messages
	 * @throws {Error} If any errors occur during the buy/sell process
	 */
	async stockModification(orderRequest) { 

		//We check to make sure it's valid. 
		let validation = this.validateOrderRequest(orderRequest)

		//If not valid, we throw an error with all the errors attached
		if (!validation.isValid) {
			let failedValidations = validation.errors.filter(e => !e.valid); //Grab all the errors
			
			//Combine the error messages onto a new line. 
			let errorMessage = failedValidations
				.map(error => error.message)
				.join('\n'); 

			let prefix = failedValidations.length === 1
				? 'Validation error:'
				: 'Multiple validation errors:';

			throw new Error(`${prefix}\n${errorMessage}`);
		}


		// Process the order
		const HANDLERS = {
			market: {
				buy: this.buyStockMarket,
				sell: this.sellStockMarket
			},
			limit: {
				buy: this.buyStockLimit,
				sell: this.sellStockLimit
			}
		};

		let transaction = await HANDLERS[orderRequest.orderType][orderRequest.action].call(this, orderRequest);
		authInfo.saveCurrentData();
		return transaction;
	}

	/**
	 * Attempts to fetch stock data with specified parameters, falling back to increasingly
	 * wider time intervals if needed
	 * 
	 * @async
	 * @param {Object} orderRequest - The order request
	 * @param {string} orderRequest.stockSymbol - Symbol of the stock to buy
	 * @param {number} orderRequest.quantity - Number of shares to buy
	 * @param {string} orderRequest.timeFrame - Time frame ('1h', '1d', '1w', '1mo')
	 * 
	 * @returns {Object} result - The stock data result
	 * @returns {Object} result.details - Details about the stock
	 * @returns {string} result.endDate - The EndDate in format yyyy-mm-dd
	 * @returns {number} result.endPrice - The endPrice as a float
	 * @returns {string} result.fullName - The stock Full name
	 * @returns {string} result.interval - The timeFrame used (1h, 1d, 1wk, 1mo)
	 * @returns {number} result.max - The max of the stock price in the timeFrame
	 * @returns {number} result.min - The min of the stock price in the timeFrame
	 * @returns {string} result.startDate - The startDate in format yyyy-mm-dd
	 * @returns {number} result.startPrice - The startPrice as a float
	 * @returns {string} result.symbol - The symbol used
	 * @returns {Object[]} result.values - An Array of values of the stock over the time period
	 * @returns {number} result.values[x].close - The close price at the select time
	 * @returns {string} result.values[x].date - The date of the selected time in the format ISO 8601 foramt: yyyy-mm-ddThh:mm:ss.sssZ
	 * @returns {number} result.values[x].high - The max price at the select time
	 * @returns {number} result.values[x].low - The min price at the select time
	 * @returns {number} result.values[x].open - The close price at the select time
	 * @returns {number} result.values[x].volume - The number of trades over the tiem period
	 * 
	 * 
	 * @returns {Object} result - The stock data result
	 * @returns {Object} result - The stock data result
	 * @throws {Error} If all fallback attempts fail
	 */
	async fetchStockDataWithFallbacks(orderRequest) {
		
		// Define fallback sequence - from most granular to least
		let timeFrameFallbacks = ['1h', '1d'];

		let currentDate = new Date(this.date);


		// Set date range based on timeFrame
		let startDate = new Date(currentDate);
		if (orderRequest.orderType === "limit" && orderRequest.lastCheckedTime) { 
			startDate = orderRequest.lastCheckedTime;
		}
		let endDate = new Date(currentDate);

		if (orderRequest.timeFrame === '1h' || orderRequest.timeFrame === '1d') {
			endDate.setDate(endDate.getDate() + 1);
		}
		else if (orderRequest.timeFrame === '1wk') {
			endDate.setDate(endDate.getDate() + 7);
		}
		else if (orderRequest.timeFrame === '1mo') {
			endDate.setMonth(endDate.getMonth() + 1);
		}

		let formattedStartDate = startDate.toISOString().split('T')[0];
		let formattedEndDate = endDate.toISOString().split('T')[0];


		//If both hourly and daily fails, we'll just use some 
		if (orderRequest.timeFrame === '1wk') {
			timeFrameFallbacks.push('1wk');
		} else if (orderRequest.timeFrame === '1mo') {
			timeFrameFallbacks.push('1mo');
		}

		// Try each fallback in sequence
		for (let interval of timeFrameFallbacks) {
			try {

				let result = await stockInfo.getFullStockInfo(
					orderRequest.stockSymbol,
					formattedStartDate,
					formattedEndDate,
					interval
				);

				// Check if we got valid data
				if (result && result.values && result.values.length > 0) {
					return result;
				}

				//If it makes here, then it had no valid data, and will try again
			} catch (error) {
				// Continue to next fallback
			}
		}

		// If we reach here, all fallbacks failed
		if (!orderRequest.lastCheckedTime) {
			this.pendingOrders.push(orderRequest);
		}
		throw new Error(`No historical data found for ${orderRequest.symbol} across any time interval`);
	}


	/**
	 * Executes a market buy order for a stock at current market price
	 * 
	 * @example 
	 * // Buy 10 shares of Apple stock
	 * let transaction = await this.buyStockMarket({
	 *   stockSymbol: 'AAPL',
	 *   quantity: 10,
	 *   timeFrame: '1d'
	 * });
	 * 
	 * @async
	 * @method
	 * 
	 * @param {Object} orderRequest - The order request
	 * @param {string} orderRequest.stockSymbol - Symbol of the stock to buy
	 * @param {number} orderRequest.quantity - Number of shares to buy
	 * @param {string} orderRequest.timeFrame - Time frame ('1h', '1d', '1w', '1mo')
	 * 
	 * @returns {Object} transaction - Transaction details object with type, orderType, symbol, quantity, price, etc.
	 * @returns {'buy' | 'sell'} transaction.type - Either 'buy' or 'sell'
	 * @returns {'market' | 'limit'} transaction.orderType - 'market' or 'limit'
	 * @returns {string} transaction.symbol - stockSymbol,
	 * @returns {number} transaction.quantity -Amount of stock bought
	 * @returns {number} transaction.price - Price per share
	 * @returns {number} transaction.total - Total cost 
	 * @returns {Date}	 transaction.date - Date when purchase occurs
	 * @returns {number} transaction.fees - Additional fees
	 * 
	 * @throws {Error} If insufficient funds or no available data
	 * 
	 */
	async buyStockMarket(orderRequest) {

		let stockSymbol = orderRequest.stockSymbol;
		let quantity = orderRequest.quantity;
		let timeFrame = orderRequest.timeFrame;
				

		let result = await this.fetchStockDataWithFallbacks(orderRequest);


		//Convert full return to only using the actual values, ignoring irrelvant data
		let historicalData = result.values;

		// Filter affordable time slots
		let affordableSlots = historicalData.filter(data =>
			data.close * quantity <= this.money
		);

		if (affordableSlots.length === 0) {
			throw new Error(`Insufficient funds to purchase ${quantity} shares of ${stockSymbol}`);
		}

		//Select a random stock price purchase time taking into account the selceted timeFrame
		let selectedSlot = this.selectStockPrice(affordableSlots, timeFrame);

		return this.executeOrder(orderRequest, selectedSlot);

	} //Buy the stock at the time for whatever it cost at the time

	/**
	 * Executes a limit buy order for a stock when price falls to or below specified limit price
	 * 
	 * @example 
	 * // Buy 10 shares of Apple stock when price reaches $150 or lower
	 * let transaction = await this.buyStockLimit({
	 *   stockSymbol: 'AAPL',
	 *   quantity: 10,
	 *   price: 150
	 * });
	 * 
	 * @async
	 * @method
	 * 
	 * @param {Object} orderRequest - The limit order request
	 * @param {string} orderRequest.stockSymbol - Symbol of the stock to buy
	 * @param {number} orderRequest.quantity - Number of shares to buy
	 * @param {number} orderRequest.price - Maximum price willing to pay per share
	 * @param {Date} [orderRequest.lastCheckedTime] - Last time the order was checked, defaults to current date if not provided
	 * 
	 * @returns {Object} transaction - Transaction details object with type, orderType, symbol, quantity, price, etc.
	 * @returns {string} transaction.type - 'buy'
	 * @returns {string} transaction.orderType - 'limit'
	 * @returns {string} transaction.symbol - stockSymbol
	 * @returns {number} transaction.quantity - Amount of stock bought
	 * @returns {number} transaction.price - Price per share
	 * @returns {number} transaction.total - Total cost 
	 * @returns {Date} transaction.date - Date when purchase occurs
	 * @returns {number} transaction.fees - Additional fees
	 * 
	 * @throws {Error} If no price points at or below limit price are found
	 * @throws {Error} If issues with stock data fetching occur
	 */
	async buyStockLimit(orderRequest) {

		let stockSymbol = orderRequest.stockSymbol;

		let result = await this.fetchStockDataWithFallbacks(orderRequest);


		//Convert full return to only using the actual values, ignoring irrelvant data
		let historicalData = result.values;

		// Filter affordable time slots
		let affordableSlots = historicalData.filter(data =>
			data.close <= orderRequest.price
		);

		if (affordableSlots.length === 0) {
			if (!orderRequest.lastCheckedTime) {
				orderRequest.lastCheckedTime = this.date;
				this.pendingOrders.push(orderRequest);
			}
			throw new Error(`No shares of ${stockSymbol} are below ${orderRequest.price}`);
		}

		//Selects the first stock that is affordable
		let selectedSlot = affordableSlots[0];

		return this.executeOrder(orderRequest, selectedSlot);

	} //Buy the  stock the next time it cost this amount or less, this looks ahead to find when this transaction will actually complete.


	/**
	* Executes a market sell order for a stock at current market price
	* 
	* @example 
	* // Sell 5 shares of Tesla stock
	* let transaction = await this.sellStockMarket({
	*   stockSymbol: 'TSLA',
	*   quantity: 5,
	*   timeFrame: '1d'
	* });
	* 
	* @async
	* @method
	* 
	* @param {Object} orderRequest - The order request
	* @param {string} orderRequest.stockSymbol - Symbol of the stock to sell
	* @param {number} orderRequest.quantity - Number of shares to sell
	* @param {string} orderRequest.timeFrame - Time frame ('1h', '1d', '1w', '1mo')
	* 
	* @returns {Object} transaction - Transaction details object with type, orderType, symbol, quantity, price, etc.
	* @returns {string} transaction.type - 'sell'
	* @returns {string} transaction.orderType - 'market'
	* @returns {string} transaction.symbol - stockSymbol
	* @returns {number} transaction.quantity - Amount of stock sold
	* @returns {number} transaction.price - Price per share
	* @returns {number} transaction.total - Total proceeds
	* @returns {Date}   transaction.date - Date when sale occurs
	* @returns {number} transaction.fees - Additional fees
	* 
	* @throws {Error} If insufficient shares available
	* @throws {Error} If no historical data available
	*/
	async sellStockMarket(orderRequest) {
		let timeFrame = orderRequest.timeFrame;


		// Check if we own enough shares
		this.checkSharesAvailable(orderRequest.stockSymbol, orderRequest.quantity);

		let result = await this.fetchStockDataWithFallbacks(orderRequest);


		//Convert full return to only using the actual values, ignoring irrelvant data
		let historicalData = result.values;


		if (historicalData.length === 0) {
			throw new Error(`No values available`); //This shouldn't be able to be thrown, should be handled elsewhere
		}

		//Select a random stock price purchase time taking into account the selceted timeFrame
		let selectedSlot = this.selectStockPrice(historicalData, timeFrame);

		return this.executeOrder(orderRequest, selectedSlot);

	} //Sells the stock for whatevert it's worth at that moment


	/**
	 * Executes a limit sell order for a stock at the specified price
	 * 
	 * @example 
	 * // Sell 5 shares of Tesla stock with a limit price of $250
	 * let transaction = await this.sellStockLimit({
	 *   stockSymbol: 'TSLA',
	 *   quantity: 5,
	 *   limitPrice: 250,
	 *   timeFrame: '1d'
	 * });
	 * 
	 * @async
	 * @method
	 * 
	 * @param {Object} orderRequest - The order request
	 * @param {string} orderRequest.stockSymbol - Symbol of the stock to sell
	 * @param {number} orderRequest.quantity - Number of shares to sell
	 * @param {number} orderRequest.price - Minimum price to sell at
	 * @param {string} orderRequest.timeFrame - Time frame ('1h', '1d', '1w', '1mo')
	 * @param {Date} [orderRequest.lastCheckedTime] - Last time the order was checked (defaults to current date)
	 * 
	 * @returns {Object} transaction - Transaction details object
	 * @returns {string} transaction.type - 'sell'
	 * @returns {string} transaction.orderType - 'limit'
	 * @returns {string} transaction.symbol - Stock symbol
	 * @returns {number} transaction.quantity - Amount of stock sold
	 * @returns {number} transaction.price - Price per share
	 * @returns {number} transaction.total - Total amount received
	 * @returns {Date} transaction.date - Date when sale occurs
	 * @returns {number} transaction.fees - Additional fees
	 * 
	 * @throws {Error} If insufficient shares available
	 * @throws {Error} If no historical data available
	 */
	async sellStockLimit(orderRequest) {
		this.checkSharesAvailable(orderRequest.stockSymbol, orderRequest.quantity);


		let result = await this.fetchStockDataWithFallbacks(orderRequest);


		//Convert full return to only using the actual values, ignoring irrelvant data
		let historicalData = result.values;

		// Filter affordable time slots
		let affordableSlots = historicalData.filter(data =>
			data.close >= orderRequest.price
		);

		if (affordableSlots.length === 0) {
			if (!orderRequest.lastCheckedTime) {
				orderRequest.lastCheckedTime = this.date;
				this.pendingOrders.push(orderRequest);
			}
			throw new Error(`No shares of ${orderRequest.stockSymbol} are above ${orderRequest.price}`); 
		}

		//Selects the first stock that is affordable
		let selectedSlot = affordableSlots[0];

		return this.executeOrder(orderRequest, selectedSlot);

	} //Sells the stock the next time it's worth for atleast that much, this looks ahead to find when this transaction will actually complete.

	/**
	 * Adds a specified amount of cash to the account
	 * If the amount is zero or negative, no change will be made to the balance.
	 * 
	 * @example
	 * // Add $1000 to the account
	 * this.addCash(1000);
	 * 
	 * @method
	 * @param {number} amount - The amount of cash to add (must be positive)
	 * @returns {void} - This method doesn't return a value
	 */
	addCash(amount) {
		if (amount > 0) { 
			this.money += amount;
		}
	}//Adds this amount of cash to the account to be used
	
	removeCash() { }//Removes this cash from the account


	/**
	 * Each time increase, handles various effects. 
	 */
	async handleTimeIncrease() { 
		console.log(this);
		
		for (let order of this.pendingOrders) { 
			try {
				let res=await this.stockModification(order);
				if (res) { 
					//Remove from pending if it is successful
					let index = this.pendingOrders.indexOf(order);
					if (index !== -1) {
						this.pendingOrders.splice(index, 1);
					}
					console.log("Sold pending order, ", res);
					
				}
			} catch (error) { 
				console.log(error);
				
			} //If an error, we will continue
			finally { 
				order.lastCheckedTime = this.date;
			}//Update the last checked date
		}

		//Gives any money that is pending
		this.pendingMoney = this.pendingMoney.filter(money => {
			if (money.date > this.date) {
				this.money += money.amount;
				return false;
			}
			return true;
		});

		//Move the pending stocks to the stocks array, this is an example of where .filter is probably better than typical for loop.
		this.pendingStocks = this.pendingStocks.filter(stock => {
			if (stock.purchaseDate > this.date) {
				this.stocks.push(stock);
				return false;
			}
			return true;
		});
	}

	/**
	 * Increase the time by some amount
	 * @param {Object} obj 
	 * @param {string} obj.unit a description of how much to increase the date by (hours, days, months)
	 * @param {number} obj.value The amount to increase by 
	 * @param {number} [count = 1] A count of how many time to repeat this. Default of 1
	 * 
	 * @returns {Date} newDate - The new date 
	 */
	async incrementDate({ unit, value }, count=1) {
		let newDate = new Date(this.date);
		for (let i = 0; i < count; i++) {
			switch (unit) {
				case 'hours':
					newDate.setHours(newDate.getHours() + value);
					break;
				case 'days':
					newDate.setDate(newDate.getDate() + value);
					break;
				case 'months':
					newDate.setMonth(newDate.getMonth() + value);
					break;
				default:
					//IDK so just throw error
					throw new Error("Unknown unit type to increment");
			}
		}
		this.date = newDate;
		try {
			this.handleTimeIncrease();
		} catch (error) {
			console.log(error);
			
		}
		authInfo.saveCurrentData();
		
		return newDate;
	}
	setDate() { }

	getHistoricalPortfolioValue() { }//Portfolio value at time X
	getHistoricalPortfolioStocks() { }//Gets what stocks the portfolio had at time X

	getPortfolioValue() { }//Portfolio value now (Still needs what time now is)
	getPortfolioStocks() { }//Gets what stocks the portfolio has now (Still needs what time now is)

	getTransactionHistory() { } //Returns the transactions over a period of time

	cancelLimitOrder() { } // Cancels a specific limit order
	cancelAllLimitOrders() { } // Cancels all pending limit orders
	getLimitOrders() { } // Gets all current limit orders


	toString() { }//Makes a string of the portfolio
	// toJson() { }//Makes a Json of the portfolio




	/**
	 * Selects an appropriate price point based on timeFrame and current simulation date
	 * 
	 * @param {Array[Object]} historicalData - Array of historical price data
	 * @param {string} timeFrame - Time frame ('1h', '1d', '1wk', '1mo')
	 * 
	 * @returns {Object} selectedSlot - Selected time slot with date, price, etc.
	 * 
	 * @throws {Error} If no suitable price point can be found
	 */
	selectStockPrice(historicalData, timeFrame) {
		// Filter for affordable slots if it's a buy order
		// For sell orders, we'll use all slots
		let availableSlots = [...historicalData];
		let currentDate = this.date;

		if (availableSlots.length === 0) {
			throw new Error(`No valid price data available for the specified time frame`);
		}

		// For week/month, pick a random day first
		if (timeFrame === '1wk' || timeFrame === '1mo') {
			// Simple approach: pick a random slot and filter to that date
			let randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
			let selectedDate = new Date(randomSlot.date).toDateString();

			availableSlots = availableSlots.filter(slot =>
				new Date(slot.date).toDateString() === selectedDate
			);
		}

		// Pick a random hour from the available slots if no other constraints
		let randomIndex = Math.floor(Math.random() * availableSlots.length);
		let selectedSlot = availableSlots[randomIndex];

		// For hourly timeframe, try to use current hour instead
		if (timeFrame === '1h') {
			let currentHour = currentDate.getHours();

			// Find the slot with current hour directly in historical data
			let currentHourSlot = historicalData.find(slot => {
				let slotDate = new Date(slot.date);
				return slotDate.getHours() === currentHour;
			});

			if (currentHourSlot) {
				selectedSlot = currentHourSlot;
			} else {
				// Get the latest hour before current time
				let earlierSlots = historicalData.filter(slot => {
					let slotDate = new Date(slot.date);
					return slotDate.getHours() < currentHour;
				});

				if (earlierSlots.length > 0) {
					selectedSlot = earlierSlots[earlierSlots.length - 1];
				}
			}
		}

		return selectedSlot;
	}

	/**
	 * Validates if sufficient funds are available for a purchase
	 * 
	 * @param {number} cost - Total cost of the purchase
	 * @returns {true} true if sufficient funds are available
	 * @throws {Error} If insufficient funds
	 */
	checkFundsAvailable(cost) {
		if (cost > this.money) {
			throw new Error(`Insufficient funds: need $${cost.toFixed(2)}, have $${this.money.toFixed(2)}`);
		}
		return true;
	}

	/**
	 * Validates if sufficient shares are owned for a sale
	 * 
	 * @param {string} symbol - Stock symbol
	 * @param {number} quantity - Quantity of shares to sell
	 * 
	 * @returns {Array} Stocks that can be used for this sale
	 * 
	 * @throws {Error} If insufficient shares
	 */
	checkSharesAvailable(symbol, quantity) {
		// Get all holdings for this symbol
		let holdings = this.stocks.filter(stock => stock.symbol === symbol);

		// Calculate total shares owned
		let totalOwned = holdings.reduce((total, stock) => total + stock.quantity, 0);

		if (totalOwned < quantity) {
			throw new Error(`Insufficient shares: attempting to sell ${quantity} shares of ${symbol}, but only own ${totalOwned}`);
		}

		return holdings;
	}

	/**
	 * Executes the actual order after validation
	 * 
	 * @param {Object} orderRequest - The order request containing details
	 * @param {string} orderRequest.stockSymbol - Symbol of the stock
	 * @param {number} orderRequest.quantity - Number of shares
	 * @param {string} orderRequest.action - Buy or sell action
	 * @param {Object} selectedSlot - Selected time slot with price data
	 * @param {number} selectedSlot.close - Closing price of the stock
	 * @param {string} selectedSlot.date - Date of the selected price point
	 * 
	 * @returns {Object} transaction - Transaction details from recordTransaction
	 */
	executeOrder(orderRequest, selectedSlot) {
		let total = selectedSlot.close * orderRequest.quantity;
		

		if (orderRequest.action === 'buy') {
			// Check funds one more time (could have changed if called asynchronously)
			this.checkFundsAvailable(total);

			// Execute purchase
			this.money -= total;

			// Add to portfolio
			let newStock = {
				symbol: orderRequest.stockSymbol,
				quantity: orderRequest.quantity,
				purchasePrice: selectedSlot.close,
				purchaseDate: new Date(selectedSlot.date),
				totalCost: total
			};

			this.pendingStocks.push(newStock);
		} else if (orderRequest.action === 'sell') {
			// Check shares one more time
			let holdings = this.checkSharesAvailable(orderRequest.stockSymbol, orderRequest.quantity);

			// Execute sale
			let remainingToSell = orderRequest.quantity;

			// Start selling from oldest positions (FIFO)
			for (let i = 0; i < holdings.length && remainingToSell > 0; i++) {
				let position = holdings[i];

				if (position.quantity <= remainingToSell) {
					// Sell entire position
					remainingToSell -= position.quantity;
					position.quantity = 0;
					// Remove immediately
					let stockIndex = this.stocks.indexOf(position);
					this.stocks.splice(stockIndex, 1);
				} else {
					// Sell partial position
					position.quantity -= remainingToSell;
					remainingToSell = 0;
				}
			}

			let newMoney = {
				amount: total, 
				date: new Date(selectedSlot.date)
			}
			// Add proceeds to account
			this.pendingMoney.push(newMoney);
			// this.money += total;
		}

		// Record the transaction
		return this.recordTransaction(orderRequest, selectedSlot);
	}


	/**
	 * Records a transaction in history
	 * 
	 * @param {Object} orderRequest - The order request details
	 * @param {string} orderRequest.orderType - Transaction type ('buy' or 'sell')
	 * @param {string} orderRequest.action - Order type ('market' or 'limit')
	 * @param {string} orderRequest.stockSymbol - Stock symbol
	 * @param {number} orderRequest.quantity - Number of shares
	 * @param {Object} selectedSlot - The selected time slot for the transaction
	 * @param {number} selectedSlot.close - Closing price of the stock
	 * @param {Date} selectedSlot.date - Date of the selected price point
	 * 
	 * @returns {Object} transaction - Transaction details object containing type, orderType, symbol, quantity, price, total, sellDate, transactionDate, and fees
	 */
	recordTransaction(orderRequest, selectedSlot) {
		let transaction = {
			type: orderRequest.orderType,
			orderType: orderRequest.action,
			symbol: orderRequest.stockSymbol,
			quantity: orderRequest.quantity,
			price: selectedSlot.close,
			total: selectedSlot.close * orderRequest.quantity,
			sellDate: selectedSlot.date,
			transactionDate: this.date,
			fees: 0
		};

		this.transaction.push(transaction);


		return transaction;
	}

}

export default Portfolio;
// module.exports = Portfolio;