// DayInfo.js
import React, { useState, useEffect, useCallback } from 'react';
import * as S from '../styles/TradeStyles';
import { useAuth } from '../server/AuthClasses/AuthContext';
import Profile from '../server/Profile';
import { useTimeFrame } from './TimeFrameContext';

const DayInfo = () => {
	const { isAuthenticated, portfolio } = useAuth();

	const [incrementTimeFrame, setIncrementTimeFrame] = useState('1sec');
	const [continuosIncrement, setContinuosIncrement] = useState(false);
	const { selectedTimeFrame, TIME_FRAMES } = useTimeFrame();

	// Function to add time frames
	const addTimeFrame = useCallback((quantity) => {
		if (!isAuthenticated) return;
		try {
			Profile.currentProfile?.portfolios[0].incrementDate(TIME_FRAMES[selectedTimeFrame], quantity);			
		} catch (error) {
			console.log("Like how?");
			
		}
	}, [selectedTimeFrame, isAuthenticated, TIME_FRAMES]);

	useEffect(() => {
		let intervalContIncr;

		if (continuosIncrement && incrementTimeFrame) {
			intervalContIncr = setInterval(() => {
				addTimeFrame(1);
			}, (parseFloat(incrementTimeFrame) * 1000));
		}

		return () => {
			if (intervalContIncr) {
				clearInterval(intervalContIncr);
			}
		};
	}, [continuosIncrement, incrementTimeFrame, addTimeFrame]);

	return (
		<S.HorizontalBar style={{ top: ' 10% ' }}>
			{/* This is for the Day Info Stuff, it shows the Current Date, and increment */}
			{/* This is purely to add another item to the list bar to move everything more inward */}
			<hr style={{ borderColor: 'rgba(255, 255, 255, 0.3' }} />
			<div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(255, 255, 255, 0.3)', paddingBottom: '5px' }}>
				Day Info
			</div>
			<div>Current Date: <strong>{portfolio?.date.toLocaleString(undefined, {
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})}</strong></div>

			{/* Adds the automatic increment */}
			<div>
				Increment every
				<S.TimeFrameSelector
					value={incrementTimeFrame}
					onChange={(e) => setIncrementTimeFrame(e.target.value)}>
						<option value="0.5">0.5</option>
						<option value="1">1</option>
						<option value="5">5</option>
						<option value="10">10</option>
						<option value="20">20</option>
						<option value="30">30</option>
						<option value="60">60</option>
				</S.TimeFrameSelector> sec
				<input
					type="checkbox"
					checked={continuosIncrement}
					onChange={(e) => setContinuosIncrement(e.target.checked)}
					disabled={!isAuthenticated}
					style={{ marginLeft: '10px' }}
				/>
			</div>

			{/* Adds the manual increment */}
			<div>Add 1  Time Frame:
				<S.AddButton onClick={() => addTimeFrame(1)} disabled={continuosIncrement || !isAuthenticated}>
					Add
				</S.AddButton></div>
			<div>Add 5  Time Frame:
				<S.AddButton onClick={() => addTimeFrame(5)} disabled={continuosIncrement || !isAuthenticated}>
					Add
				</S.AddButton></div>
			<div>Add 10 Time Frame:
				<S.AddButton onClick={() => addTimeFrame(10)} disabled={continuosIncrement || !isAuthenticated}>
					Add
				</S.AddButton>
			</div>

			{/* This is purely to add another item to the list bar to move everything more inward */}
			<hr style={{ borderColor: 'rgba(255, 255, 255, 0.3' }} />

		</S.HorizontalBar>
	);
};

export default DayInfo;