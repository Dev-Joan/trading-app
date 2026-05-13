// TimeFrameContext.js
import React, { createContext, useState, useContext } from 'react';

const TimeFrameContext = createContext(null);

const TIME_FRAMES = {
	'1h': { unit: 'hours', value: 1 },
	'1d': { unit: 'days', value: 1 },
	'1wk': { unit: 'days', value: 7 },
	'1mo': { unit: 'months', value: 1 }
};

export const TimeFrameProvider = ({ children }) => {
	const [selectedTimeFrame, setSelectedTimeFrame] = useState('1d');

	return (
		<TimeFrameContext.Provider value={{
			selectedTimeFrame,
			setSelectedTimeFrame,
			TIME_FRAMES
		}}>
			{children}
		</TimeFrameContext.Provider>
	);
};

export const useTimeFrame = () => useContext(TimeFrameContext);