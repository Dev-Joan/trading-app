// Portfolio.js

// importing dependencies
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import styled from "styled-components";

// Responsive Portfolio Wrapper
const PortfolioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #1e2a47, #312055);

  @media (max-width: 1024px) 
  {
    flex-direction: column;
    height: auto;
    padding-bottom: 50px;
  }
`;

// Sidebar (Stock Holdings) should be responsive now
const Sidebar = styled.div`
  width: 250px;
  height: calc(100vh - 3cm);
  background: #222;
  color: white;
  padding: 20px;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 3cm;

  @media (max-width: 768px) 
  {
    position: relative;
    width: 100%;
    height: auto;
    padding: 15px;
    text-align: center;
  }
`;

// Responsive Main Content Section
const MainContent = styled.div`
  flex-grow: 1;
  margin-left: 260px;
  padding: 20px;
  padding-top: 3cm;

  @media (max-width: 768px) 
  {
    margin-left: 0;
    padding: 10px;
  }
`;

// Adjusted Portfolio Overview 
const OverviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
  margin-left: -200px; /* Moves it left by 10cm (~100px)  adjust more if need later*/

  @media (max-width: 1024px) 
  {
    margin-left: -50px; /* Adjust for medium screens  need to test this one*/
  }

  @media (max-width: 768px) 
  {
    align-items: center;
    margin-left: 0; /* Centers it on smaller screens this also need to be tested on a small screen */
  }
`;

// Styled Table for Key Stock Metrics (Scrollable on Mobile, atleast i hope so)
const StockTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
  font-size: 14px;
  background-color: #1e2a47;
  color: white;
  border-radius: 10px;
  overflow: hidden;

  th, td 
  {
    padding: 10px;
    text-align: center;
  }

  th 
  {
    background-color: #273c75;
  }

  tr:nth-child(even) 
  {
    background-color: #2c3e50;
  }

  tr:hover 
  {
    background-color: #34495e;
  }

  @media (max-width: 768px) 
  {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

// Responsive Market Overview
const MarketOverviewContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: auto;
  min-height: 270px; /* Reduced height */
  max-height: 400px; /* Prevents it from being too large */
  background: #1b1b2f;
  padding: 10px;
  border-radius: 10px;
  color: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px; /* Adds space below */

  @media (max-width: 1024px) 
  {
    max-width: 400px;
    min-height: 260px;
  }

  @media (max-width: 768px) 
  {
    max-width: 100%;
    min-height: 250px;
    margin: 0 auto 15px auto;
  }

  @media (max-width: 480px) 
  {
    max-width: 100%;
    padding: 15px;
    min-height: 230px;
  }
`;

// Responsive Market Stats
const MarketStat = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 15px;
  
  span:first-child 
  {
    font-weight: bold;
    color: #00d4ff;
  }

  span:last-child 
  {
    font-weight: bold;
  }

  @media (max-width: 768px) 
  {
    font-size: 14px;
    padding: 8px 0;
  }
`;

//Fake Market Data (in future we can replace with real API)
const marketData = 
{
  indices: 
  [
    { name: "S&P 500", value: 4950, change: 1.2 },
    { name: "NASDAQ", value: 15600, change: -0.8 },
    { name: "Dow Jones", value: 38800, change: 0.5 },
  ],
  topGainers: 
  [
    { name: "TSLA", change: "+5.2%" },
    { name: "NVDA", change: "+4.8%" },
    { name: "META", change: "+3.9%" },
  ],
  topLosers: 
  [
    { name: "AAPL", change: "-2.1%" },
    { name: "GOOGL", change: "-1.9%" },
    { name: "NFLX", change: "-1.7%" },
  ],
};

const Portfolio = () => 
  {
  const [portfolio, setPortfolio] = useState([
    { ticker: "AAPL", quantity: 10, price: 175, change: 2.5, marketCap: "2.8T", peRatio: 28, high52: 190, low52: 130, beta: 1.2, dividendYield: 0.6, eps: 6.5, roe: 35.4 },
    { ticker: "GOOGL", quantity: 5, price: 2800, change: -1.2, marketCap: "1.7T", peRatio: 25, high52: 2900, low52: 2200, beta: 1.1, dividendYield: 0, eps: 5.2, roe: 29.1 },
    { ticker: "TSLA", quantity: 8, price: 900, change: 3.1, marketCap: "800B", peRatio: 60, high52: 1200, low52: 600, beta: 2.0, dividendYield: 0, eps: 4.0, roe: 14.7 },
    { ticker: "MSFT", quantity: 7, price: 320, change: 1.8, marketCap: "2.5T", peRatio: 32, high52: 350, low52: 270, beta: 0.9, dividendYield: 0.8, eps: 9.2, roe: 45.8 },
    { ticker: "AMZN", quantity: 4, price: 3450, change: -0.9, marketCap: "1.6T", peRatio: 35, high52: 3700, low52: 2900, beta: 1.3, dividendYield: 0, eps: 3.8, roe: 17.5 },
    { ticker: "NVDA", quantity: 6, price: 450, change: 2.0, marketCap: "1.2T", peRatio: 50, high52: 500, low52: 350, beta: 1.8, dividendYield: 0.5, eps: 10.5, roe: 40.2 },
    { ticker: "META", quantity: 3, price: 375, change: 1.5, marketCap: "1.1T", peRatio: 30, high52: 400, low52: 290, beta: 1.4, dividendYield: 0, eps: 8.3, roe: 36.7 },
    { ticker: "NFLX", quantity: 2, price: 450, change: 0.7, marketCap: "250B", peRatio: 42, high52: 500, low52: 320, beta: 1.7, dividendYield: 0, eps: 6.9, roe: 21.9 },
    { ticker: "AMD", quantity: 9, price: 120, change: -0.4, marketCap: "190B", peRatio: 38, high52: 140, low52: 90, beta: 1.5, dividendYield: 0.3, eps: 4.6, roe: 18.4 },
  ]);

  // Simulated live price updates, for now they are random, need some adjustments
  useEffect(() => 
  {
    const interval = setInterval(() => 
    {
      setPortfolio((prevPortfolio) =>
        prevPortfolio.map((stock) => 
        ({
          ...stock,
          price: stock.price + (Math.random() * 10 - 5),
          change: parseFloat((Math.random() * 4 - 2).toFixed(2)),
        }))
      );
    }, 5000); // Update every 5 seconds but probably will need more to dont get annoying 

    return () => clearInterval(interval);
  }, []);

  // Portfolio distribution for Pie Chart
  const pieData = portfolio.map((stock) => 
  ({
    name: stock.ticker,
    value: stock.quantity * stock.price,
  }));

  // Chart colors
  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF", "#D32F2F", "#1976D2", "#388E3C", "#F57C00"];

  return (
    <PortfolioWrapper>
      {/* Fixed Sidebar for Stock Holdings */}
      <Sidebar>
        <h2 className="text-xl font-semibold mb-4">Stock Holdings</h2>
        <div className="flex flex-col space-y-4">
          {portfolio.map((stock, index) => 
          (
            <div key={index} className="p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-bold">{stock.ticker}</h3>
              <p className="text-sm">Qty: {stock.quantity}</p>
              <p className="text-sm">Price: ${stock.price.toFixed(2)}</p>
              <p className={`text-sm font-semibold ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                Change: {stock.change}%
              </p>
            </div>
          ))}
        </div>
      </Sidebar>

       {/* Right Content Section */}
       <MainContent>
        <h1 className="text-3xl font-bold">Your Portfolio</h1>

        {/* Left-Aligned Portfolio Overview Section */}
        <OverviewSection>
          <h2 className="text-xl font-semibold">Portfolio Overview</h2>
          <div style={{ width: "400px", marginTop: "10px" }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => 
                  (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </OverviewSection>
        
         {/* Right-Side Market Overview Section */}
         <div style={{ position: "absolute", top: "10%", right: "5%", width: "450px" }}>
          <h2 className="text-xl font-semibold">Market Overview</h2>
          <MarketOverviewContainer>
            {marketData.indices.map((index, idx) => 
            (
              <MarketStat key={idx}>
                <span>{index.name}</span>
                <span style={{ color: index.change >= 0 ? "limegreen" : "red" }}>
                  {index.value} ({index.change}%)
                </span>
              </MarketStat>
            ))}

            <h3 className="text-md font-semibold mt-3">Top Gainers</h3>
            {marketData.topGainers.map((stock, idx) => 
            (
              <MarketStat key={idx}>
                <span>{stock.name}</span>
                <span style={{ color: "limegreen" }}>{stock.change}</span>
              </MarketStat>
            ))}

            <h3 className="text-md font-semibold mt-3">Top Losers</h3>
            {marketData.topLosers.map((stock, idx) => 
            (
              <MarketStat key={idx}>
                <span>{stock.name}</span>
                <span style={{ color: "red" }}>{stock.change}</span>
              </MarketStat>
            ))}
          </MarketOverviewContainer>
        </div>

        {/* Stock Metrics Table */}
        <div className="p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Key Stock Metrics</h3>
        <StockTable>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Market Cap</th>
              <th>P/E Ratio</th>
              <th>52W High</th>
              <th>52W Low</th>
              <th>Beta</th>
              <th>Dividend Yield (%)</th>
              <th>EPS</th>
              <th>ROE (%)</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock, index) => 
            (
              <tr key={index}>
                <td>{stock.ticker}</td>
                <td>{stock.marketCap}</td>
                <td>{stock.peRatio}</td>
                <td>${stock.high52}</td>
                <td>${stock.low52}</td>
                <td>{stock.beta}</td>
                <td>{stock.dividendYield}</td>
                <td>{stock.eps}</td>
                <td>{stock.roe}%</td>
              </tr>
            ))}
          </tbody>
        </StockTable>
      </div>
    </MainContent>
  </PortfolioWrapper>
  );
};

export default Portfolio;
