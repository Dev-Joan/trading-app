// Trade.js

import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import * as S from '../styles/TradeStyles';
import { StockChartComponent } from "../components/ChartComponent"; 
import stockInfo from '../server/StockInfo';
import { useCallback } from 'react';
import Profile from '../server/Profile';
import DayInfo from '../components/DayInfo';
import { useTimeFrame } from '../components/TimeFrameContext';
import { useAuth } from '../server/AuthClasses/AuthContext';



const calculateMarketTimeLeft = () => {
  const now = new Date();
  const marketClose = new Date();
  marketClose.setHours(16, 0, 0); // we assume that market closes at 4PM

  if (now > marketClose) {
    return "Market Closed";
  }

  const diff = marketClose - now;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m left`;
};

const indicators = [
  'Moving Average (MA)',
  'Relative Strength Index (RSI)',
  'Exponential Moving Average (EMA)',
  'Bollinger Bands',
  'MACD',
  'Stochastic Oscillator',
  'Volume Weighted Average Price (VWAP)',
  'Ichimoku Cloud',
  'Fibonacci Retracement',
  'Parabolic SAR'
];


const Trade = () => {
	const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
	const [selectedIndicator, setSelectedIndicator] = useState('');
	const [addedIndicators, setAddedIndicators] = useState([]);
	const [selectedChartStyle, setSelectedChartStyle] = useState('line');
	const [selectedStock, setSelectedStock] = useState(null);
	const [selectedStockSymbol, setSelectedStockSymbol] = useState(null);
	const [orderType, setOrderType] = useState('limit');
	const [price, setPrice] = useState('');
	const [quantity, setQuantity] = useState('');
	const [marketTimeLeft, setMarketTimeLeft] = useState(calculateMarketTimeLeft());
	const [marketStatus, setMarketStatus] = useState('Open'); 
	const [dailyPL, setDailyPL] = useState(1250.75); 
	const [currency, setCurrency] = useState('USD');
	const [notifications, setNotifications] = useState([
	'Order placed successfully',
	'Stock price updated',
	]);
	const [showNotifications, setShowNotifications] = useState(false);
	const [theme, setTheme] = useState('dark');
	const [stockList, setStockList] = useState([]);
	const [stockData, setStockData] = useState([]);

	const { isAuthenticated, portfolio } = useAuth();
	const { selectedTimeFrame, setSelectedTimeFrame } = useTimeFrame();
	
		let [validation, setValidation] = useState(null);


	useEffect(() => {
		const fetchStocks = async () => {
			const stocks = await stockInfo.getAvailableStocks();
			setStockList(stocks);
		};
		fetchStocks();
	}, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleAddIndicator = () => {
    if (selectedIndicator && !addedIndicators.includes(selectedIndicator)) {
      setAddedIndicators([...addedIndicators, selectedIndicator]);
    }
	};

	
	const getStockPrice = (symbol, startDate, endDate, interval = '1d') => {
		return stockInfo.getFullStockInfo(symbol, startDate, endDate, interval);
	};
	
	const updateChart = useCallback(() => {
		
		if (!selectedStockSymbol || !portfolio?.date) return;

		let endDate = new Date(portfolio.date);
		let startDate = new Date(endDate); 


		switch (selectedTimeFrame) { 
			case '1h': startDate.setDate(startDate.getDate() - 14);	break;
			case '1d': startDate.setMonth(startDate.getMonth() - 1); break;
			case '1wk': startDate.setMonth(startDate.getMonth() - 3); break;
			case '1mo': startDate.setMonth(startDate.getMonth() - 12); break;
			default:
		}

		// Format dates to YYYY-MM-DD
		let formattedEndDate = endDate.toISOString().split('T')[0];
		let formattedStartDate = startDate.toISOString().split('T')[0];

		getStockPrice(selectedStockSymbol, formattedStartDate, formattedEndDate, selectedTimeFrame)
			.then(result => {
				setStockData(result.values);
			})
			.catch(error => {
				console.log("Error:", error);//Not sure what to do if an error
			});
	}, [selectedStockSymbol, selectedTimeFrame, portfolio?.date]);

	useEffect(() => {
		if (selectedStockSymbol) {
			updateChart();
		}
	}, [selectedStockSymbol, updateChart]);

	const handleStockClick = (stock) => {
		setSelectedStock(stock.full === selectedStock ? null : stock.full);
		setSelectedStockSymbol(stock.symbol === selectedStockSymbol ? null : stock.symbol);
	};
	
	const handleOrderClick = (isBuying=false) => {
		
		if (!isAuthenticated) {
			alert("Please Sign In first");
			return;		
		}
		
		if (!selectedStockSymbol) {
			alert('Please select a stock first');
			return;
		}
		const orderData = {
			stockSymbol: selectedStockSymbol,
			orderType: orderType,
			price: Number(price),
			quantity: Number(quantity),
			action: isBuying ? 'buy' : 'sell', 
			timeFrame: selectedTimeFrame
		};

		Profile.currentProfile?.portfolios[0].stockModification(orderData)
			.then(result => {
				console.log("Order submitted!", result);
				// setValidation(result);
			})
			.catch(error => {
				console.error("Error:", error);//Not sure what to do if an error
				// setValidation(error);
			});
	};

  const calculateTotal = () => {
    const total = price && quantity ? (parseFloat(price) * parseInt(quantity)).toFixed(2) : '0.00';
    return `$${total}`;
  };

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date().toLocaleTimeString());
  }, 1000);

	return () => {
		clearInterval(interval);
	}
}, [])

  return (
	  <div>
		  <DayInfo />
		  
		  
      <S.HorizontalBar>
      <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>Account: #123456789</div>
          <div style={{ marginLeft: '15px', fontSize: '1rem', color: 'white' }}>{currentTime}</div>
          <div style={{ marginLeft: '15px', color: marketStatus === 'Open' ? 'green' : 'red' }}>
            Market: {marketStatus}
          </div>

          <div style={{ marginLeft: '15px', color: 'white', fontSize: '0.9rem' }}>
            <strong>Time Left:</strong> {marketTimeLeft}
          </div>
        </div>

        <div style={{ color: dailyPL >= 0 ? 'green' : 'red', fontSize: '1rem', marginLeft: '10px' }}>
          Day’s P&L: ${dailyPL.toFixed(2)}
        </div>

        <div>
          Currency:
          <S.TimeFrameSelector value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </S.TimeFrameSelector>
        </div>

        <div>
          Time Frame:
          <S.TimeFrameSelector
            value={selectedTimeFrame}
            onChange={(e) => setSelectedTimeFrame(e.target.value)}
          >
            <option value="1h">1H</option>
            <option value="1d">1D</option>
            <option value="1wk">1 Week</option>
            <option value="1mo">1 Month</option>
          </S.TimeFrameSelector>
        </div>

        <div>
          Chart Style:
          <S.TimeFrameSelector
            value={selectedChartStyle}
            onChange={(e) => setSelectedChartStyle(e.target.value)}
          >
            <option value="line">Line</option>
            <option value="candle">Candle</option>
            <option value="bar">Bar</option>
          </S.TimeFrameSelector>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          Indicator:
          <S.TimeFrameSelector
            value={selectedIndicator}
            onChange={(e) => setSelectedIndicator(e.target.value)}
          >
            <option value="">Select Indicator</option>
            {['MA', 'RSI', 'EMA', 'MACD', 'Bollinger Bands', 'Stochastic Oscillator', 'VWAP', 'Ichimoku Cloud', 'Fibonacci Retracement', 'Parabolic SAR'].map((indicator, index) => (
              <option key={index} value={indicator}>{indicator}</option>
            ))}
          </S.TimeFrameSelector>
          <S.AddButton onClick={handleAddIndicator} disabled={!selectedIndicator}>
            Add
          </S.AddButton>
        </div>

        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowNotifications(!showNotifications)}>
          <Bell color="white" size={24} />
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '30px',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.5)'
            }}>
              {notifications.map((note, index) => (
                <div key={index} style={{ padding: '5px 0' }}>{note}</div>
              ))}
            </div>
          )}
        </div>

        <button onClick={toggleTheme} style={{
          padding: '5px 10px',
          background: 'none',
          border: '1px solid white',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer'
        }}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

      </S.HorizontalBar>
		  <S.LeftWindow>
			  
	
			  
	<hr style={{ borderColor: 'rgba(255, 255, 255, 0.3' }} />
  <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255, 255, 255, 0.3)', paddingBottom: '5px' }}>
    Account Info
  </div>
  <div>Option Buying Power: <strong>$200,000.00</strong></div>
  <div>Forex Buying Power: <strong>$10,000.00</strong></div>
  <div>Net Liq & Day Trades: <strong>$200,000.00</strong></div>
  <div>Cash & Sweep Vehicles: <strong>$200,000.00</strong></div>
  <hr style={{ borderColor: 'rgba(255, 255, 255, 0.3' }} />

  <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255, 255, 255, 0.3)', paddingBottom: '5px' }}>
    Live News
  </div>
  <div>14:47:00 - Here coming news stream...</div>
  <div>14:47:00 - Here coming news streams...</div>
  <div>14:47:00 - Here coming news stream...</div>
  <div>14:47:00 - Here coming news stream...</div>
  <hr style={{ borderColor: 'rgba(255, 255, 255, 0.3' }} />

  <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255, 255, 255, 0.3)', paddingBottom: '5px' }}>
    Tradable Stocks
  </div>
  <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {stockList.map((stock, index) => (
        <S.StockListItem
          key={index}
          selected={selectedStock === stock}
          onClick={() => handleStockClick(stock)}
        >
          {stock.full}
        </S.StockListItem>
      ))}
    </ul>
  </div>
</S.LeftWindow>

<S.RightWindow>
  <h2>Order Form</h2>
  <form>
    <S.FormLabel htmlFor="orderType">Order Type</S.FormLabel>
    <S.SelectField id="orderType" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
      <option value="limit">Limit</option>
      <option value="market">Market</option>
    </S.SelectField>

    <S.FormLabel htmlFor="price">Price (USD)</S.FormLabel>
    <S.InputField
      type="number"
      id="price"
      placeholder="Enter price"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
    />

    <S.FormLabel htmlFor="quantity">Quantity</S.FormLabel>
    <S.InputField
      type="number"
      id="quantity"
      placeholder="Enter quantity"
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
    />

    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
      <S.Button type="button" onClick={() => handleOrderClick(true)}>Buy</S.Button>
	<S.Button $sell type="button" onClick={() => handleOrderClick(false)}>Sell</S.Button>
    </div>
  </form>

  <S.SummaryContainer>
    <h3>Order Summary</h3>
    <S.SummaryRow>
      <S.SummaryText>Stock:</S.SummaryText>
      <S.SummaryText>{selectedStock || 'Select a stock'}</S.SummaryText>
    </S.SummaryRow>
    <S.SummaryRow>
      <S.SummaryText>Order Type:</S.SummaryText>
      <S.SummaryText>{orderType.charAt(0).toUpperCase() + orderType.slice(1)}</S.SummaryText>
    </S.SummaryRow>
    <S.SummaryRow>
      <S.SummaryText>Price per Share:</S.SummaryText>
      <S.SummaryText>${price || '0.00'}</S.SummaryText>
    </S.SummaryRow>
    <S.SummaryRow>
      <S.SummaryText>Quantity:</S.SummaryText>
      <S.SummaryText>{quantity || '0'}</S.SummaryText>
    </S.SummaryRow>
    <S.SummaryRow>
      <S.SummaryText>Total Value:</S.SummaryText>
      <S.SummaryText>{calculateTotal()}</S.SummaryText>
    </S.SummaryRow>
			  </S.SummaryContainer>
			  
			  {validation && (
				  <div className="password-rules" style={{ color: 'red' }}>
					  {validation}
				  </div>
			  )}
</S.RightWindow>

<S.CenterContainer>
			  <S.TopWindow>Chart Area
				  
				  <StockChartComponent data={stockData} />
				  
  </S.TopWindow>
  
  <S.BottomWindow>Order Area</S.BottomWindow>
</S.CenterContainer>

    </div>
  );
};

export default Trade;