// Practice.js

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Card = ({ children, style }) => 
(
  <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', ...style }}>
    {children}
  </div>
);

const CardContent = ({ children }) => <div>{children}</div>;

const Button = ({ children, onClick, style }) => 
(
  <button onClick={onClick} style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: 'none', borderRadius: '5px', ...style }}>
    {children}
  </button>
);

const calculateTotalPortfolioValue = (portfolio, latestPrices) => 
{
  return portfolio.reduce((total, item) => 
  {
    const latestPrice = latestPrices[item.stock] || item.price;
    return total + item.amount * latestPrice;
  }, 0);
};

const Practice = () => 
{
  const [balance, setBalance] = useState(10000);                                        // starting balance
  const [portfolio, setPortfolio] = useState([]);                                       // portfolio
  const [currentStock, setCurrentStock] = useState('AAPL');
  const [stockData, setStockData] = useState([]);
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmounts, setSellAmounts] = useState({});                                   // tracking stock sells
  const [notification, setNotification] = useState("");
  const [notificationColor, setNotificationColor] = useState("red");
  const [transactions, setTransactions] = useState([]);                                 // to store transaction history
  const [latestPrices, setLatestPrices] = useState({});                                 // check for the latest stock price
  const [dayCount, setDayCount] = useState(31);                                         // counting days
  const [direction, setDirection] = useState(Math.random() > 0.5 ? 1 : -1);             // starting direction, random
  const [ticksRemaining, setTicksRemaining] = useState(Math.floor(Math.random() * 8));  // random ticks (0-7)


  useEffect(() => 
  {
    // starting stock price, will need to work on a better starting point.
    const initialPrice = 150;
    const initialData = Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i + 1}`,
      price: Math.max(initialPrice + Math.random() * 10 - 5, 1)
    }));
    setStockData(initialData);
    setLatestPrices({ ...latestPrices, [currentStock]: initialPrice });
  }, [currentStock]);

  useEffect(() => 
  {
    const interval = setInterval(() => 
    {
      setStockData((prevData) => 
      {
        const lastPrice = prevData[prevData.length - 1].price;
        const fluctuation = direction * lastPrice * (Math.random() * 0.05);                   // 5% price move for now, if needed adjust more(dont do without Juris :D)
        const newPrice = Math.max(lastPrice + fluctuation, 1);                                // for price to dont go below 1
        const newData = [...prevData.slice(1), { day: `Day ${dayCount}`, price: newPrice }];
        setLatestPrices((prevPrices) => ({ ...prevPrices, [currentStock]: newPrice }));
        return newData;
      });
      setDayCount((prevDay) => prevDay + 1);                                                   // this one responsible for day count increase

      // Manage direction changes
      if (ticksRemaining <= 1) 
      {
        setDirection(Math.random() > 0.5 ? 1 : -1);                                           // Randomly choose up or down
        setTicksRemaining(Math.floor(Math.random() * 8));                                     // Reset ticks (0-7)
      } else 
      {
        setTicksRemaining((prev) => prev - 1);                                                // Decrease remaining ticks, this will give wave pattern in moves
      }
    }, 5000);

    return () => clearInterval(interval); 
  }, [currentStock, ticksRemaining, direction]);

  const totalPortfolioValue = calculateTotalPortfolioValue(portfolio, latestPrices);
  const profitLoss = totalPortfolioValue + balance - 10000;

  const handleBuy = () => 
    {
    if (buyAmount <= 0) 
    {
      setNotification("Please enter a valid amount.");
      setNotificationColor("red");
      return;
    }
    const latestPrice = stockData[stockData.length - 1]?.price || 0;
    const cost = latestPrice * buyAmount;

    if (cost > balance) 
    {
      setNotification("Insufficient balance.");
      setNotificationColor("red");
    } else 
    {
      setBalance(balance - cost);
      const existingStock = portfolio.find(item => item.stock === currentStock);
      if (existingStock) 
      {
        existingStock.amount += buyAmount;
        setPortfolio([...portfolio]);
      } else 
      {
        setPortfolio([...portfolio, { stock: currentStock, amount: buyAmount, price: latestPrice }]);
      }
      const transaction = `Bought ${buyAmount} shares of ${currentStock} at $${latestPrice.toFixed(2)}`;
      setTransactions([transaction, ...transactions]);
      setNotification(`Successfully bought ${buyAmount} shares of ${currentStock}.`);
      setNotificationColor("green");
      setBuyAmount(0);
    }
  };

  const handleSell = (stock) => 
  {
    const sellAmount = sellAmounts[stock] || 0;
    if (sellAmount <= 0) 
    {
      setNotification("Please enter a valid amount.");
      setNotificationColor("red");
      return;
    }
    const latestPrice = stockData[stockData.length - 1]?.price || 0;
    const portfolioStock = portfolio.find(item => item.stock === stock);

    if (!portfolioStock || sellAmount > portfolioStock.amount) 
    {
      setNotification("You cannot sell more shares than you own.");
      setNotificationColor("red");
    } else 
    {
      portfolioStock.amount -= sellAmount;
      setBalance(balance + sellAmount * latestPrice);
      if (portfolioStock.amount === 0) 
      {
        setPortfolio(portfolio.filter(item => item.stock !== stock));
      } else 
      {
        setPortfolio([...portfolio]);
      }
      const transaction = `Sold ${sellAmount} shares of ${stock} at $${latestPrice.toFixed(2)}`;
      setTransactions([transaction, ...transactions]);
      setNotification(`Successfully sold ${sellAmount} shares of ${stock}.`);
      setNotificationColor("red");
      setSellAmounts({ ...sellAmounts, [stock]: 0 });                                               // reset stock input
    }
  };

  const handleSellAmountChange = (stock, amount) => 
  {
    setSellAmounts({ ...sellAmounts, [stock]: amount });
  };

  return (
    <div style={{ padding: '6rem 2rem', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Card style={{ width: '300px', padding: '1rem' }}>
          <CardContent>
            <h3>Account Metrics</h3>
            <p><strong>Total Portfolio Value:</strong> ${totalPortfolioValue.toFixed(2)}</p>
            <p><strong>Cash Balance:</strong> ${balance.toFixed(2)}</p>
            <p><strong>Profit/Loss:</strong> <span style={{ color: profitLoss >= 0 ? 'green' : 'red' }}>${profitLoss.toFixed(2)}</span></p>
          </CardContent>
        </Card>

        <Card style={{ width: '300px', padding: '1rem' }}>
          <CardContent>
            <h3>Buy Stock</h3>
            <div>
              <label htmlFor="stock">Select Stock:</label>
              <select id="stock" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)}>
                <option value="AAPL">Apple (AAPL)</option>
                <option value="MSFT">Microsoft (MSFT)</option>
                <option value="GOOGL">Google (GOOGL)</option>
                <option value="AMZN">Amazon (AMZN)</option>
                <option value="TSLA">Tesla (TSLA)</option>
                <option value="NVDA">NVIDIA (NVDA)</option>
                <option value="FB">Meta (FB)</option>
                <option value="NFLX">Netflix (NFLX)</option>
                <option value="BABA">Alibaba (BABA)</option>
                <option value="ORCL">Oracle (ORCL)</option>
                <option value="INTC">Intel (INTC)</option>
                <option value="CSCO">Cisco (CSCO)</option>
                <option value="ADBE">Adobe (ADBE)</option>
                <option value="IBM">IBM (IBM)</option>
              </select>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label htmlFor="amount">Amount to Buy:</label>
              <input
                id="amount"
                type="number"
                value={buyAmount}
                onChange={(e) => setBuyAmount(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>

            <Button onClick={handleBuy} style={{ marginTop: '1rem', background: 'green', color: 'white' }}>Buy</Button>
          </CardContent>
        </Card>

        <Card style={{ width: '400px', padding: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
          <CardContent>
            <h3>Portfolio</h3>
            {portfolio.length > 0 ? 
            (
              <ul>
                {portfolio.map((item, index) => 
                (
                  <li key={index}>
                    {item.amount} shares of {item.stock} at ${item.price.toFixed(2)}
                    <div style={{ marginTop: '0.5rem' }}>
                      <input
                        type="number"
                        placeholder="Amount to sell"
                        value={sellAmounts[item.stock] || 0}
                        onChange={(e) => handleSellAmountChange(item.stock, Number(e.target.value))}
                        style={{ width: '100px', marginRight: '0.5rem' }}
                      />
                      <Button onClick={() => handleSell(item.stock)} style={{ background: 'red', color: 'white' }}>Sell</Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Your portfolio is empty.</p>
            )}
          </CardContent>
        </Card>

        <Card style={{ width: '300px', padding: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
          <CardContent>
            <h3>Transaction History</h3>
            {transactions.length > 0 ? 
            (
              <ul>
                {transactions.map((transaction, index) => 
                (
                  <li key={index}>{transaction}</li>
                ))}
              </ul>
            ) : (
              <p>No transactions yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {notification && <p style={{ color: notificationColor, marginTop: '0.5rem' }}>{notification}</p>}

      <h2>{currentStock} Stock Prices</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={stockData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Practice;



