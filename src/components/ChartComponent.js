// ChartComponent.js

import React, { useEffect, useRef, useCallback } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import chartImage from '../assets/stock_picture_for_app2.jpeg';

export const ChartComponent = () => {

  return (
    <div className="chart-container">
      <img src={chartImage} alt="Stock Market Chart" />
    </div>
  );
};


//For some reason this is called 2x/sec, not sure why?
//Using code from https://tradingview.github.io/lightweight-charts/docs/series-types#candlestick
// Originated from https://www.tradingview.com/lightweight-charts/
//As well as https://github.com/tradingview/lightweight-charts
export const StockChartComponent = ({ data = [] }) => {
	const chartContainerRef = useRef(null);
	const chartRef = useRef(null);
	const seriesRef = useRef(null);
	const resizeObserverRef = useRef(null);

	const formatChartData = useCallback((rawData) => {
		if (!Array.isArray(rawData) || rawData.length < 2) return [];

		// Get first two valid dates to determine interval
		const firstTwoValidDates = rawData
			.filter(item => item && item.date)
			.slice(0, 2)
			.map(item => new Date(item.date));

		// Calculate time difference in minutes
		const timeDiffMinutes =
			(firstTwoValidDates[1] - firstTwoValidDates[0]) / (1000 * 60);

		// If difference is roughly an hour (allowing some flexibility)
		const isHourlyData = timeDiffMinutes >= 55 && timeDiffMinutes <= 65;

		const uniqueData = rawData.reduce((acc, current) => {
			if (current && current.date) {
				const timestamp = new Date(current.date);

				const timeKey = isHourlyData
					? Math.floor(timestamp.getTime() / 1000)  // Unix timestamp for hourly
					: timestamp.toISOString().split('T')[0];  // YYYY-MM-DD for daily

				acc[timeKey] = {
					time: timeKey,  // Unix timestamp or YYYY-MM-DD string
					open: Number(current.open),
					high: Number(current.high),
					low: Number(current.low),
					close: Number(current.close)
				};
			}
			return acc;
		}, {});

		return Object.values(uniqueData)
			.sort((a, b) =>
				typeof a.time === 'number'
					? a.time - b.time
					: new Date(a.time) - new Date(b.time)
			);
	}, []);

	const handleResize = useCallback(() => {
		if (chartContainerRef.current && chartRef.current) {
			const { width, height } = chartContainerRef.current.getBoundingClientRect();
			chartRef.current.applyOptions({
				width,
				height: height - 10
			});
			chartRef.current.timeScale().fitContent();
		}
	}, []); // Empty dependency array since it only uses refs

	// Set up chart and series
	useEffect(() => {
		if (!chartContainerRef.current) return;

		// Create chart instance
		const chart = createChart(chartContainerRef.current, {
			layout: {
				textColor: 'black',
				background: {
					type: 'solid',
					color: 'white'
				}
			},
			handleScale: {
				axisPressedMouseMove: true
			},
			handleScroll: {
				mouseWheel: true,
				pressedMouseMove: true
			},
			timeScale: {
				timeVisible: true,  // Show time in addition to dates
				secondsVisible: false  // Don't show seconds
			}
		});

		chartRef.current = chart;

		// Add candlestick series
		const candlestickSeries = chart.addSeries(CandlestickSeries, {
			upColor: '#26a69a',
			downColor: '#ef5350',
			borderVisible: false,
			wickUpColor: '#26a69a',
			wickDownColor: '#ef5350'
		});

		seriesRef.current = candlestickSeries;

		// Initial data setup
		if (data && data.length > 0) {
			const formattedData = formatChartData(data);
			candlestickSeries.setData(formattedData);
		}

		// Set up resize observer
		resizeObserverRef.current = new ResizeObserver(handleResize);
		resizeObserverRef.current.observe(chartContainerRef.current);

		// Initial size adjustment
		handleResize();

		// Cleanup function
		return () => {
			if (resizeObserverRef.current) {
				resizeObserverRef.current.disconnect();
			}
			chart.remove();
		};
	}, [data, formatChartData, handleResize]); //Need these or it complains, not actually neccesary, not sure why

	// Handle data updates in a separate useEffect
	useEffect(() => {
		if (seriesRef.current && data && data.length > 0) {
			const formattedData = formatChartData(data);
			seriesRef.current.setData(formattedData);
			if (chartRef.current) {
				chartRef.current.timeScale().fitContent();
			}
		}
	}, [data, formatChartData]);

	return (
		<div
			ref={chartContainerRef}
			className="w-full h-full"
			style={{ minHeight: '300px' }}
		/>
	);
};


// export default ChartComponent, StockChartComponent;
