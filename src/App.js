//App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import Trade from './pages/Trade';
import Subscribe from './pages/Subscribe';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './server/AuthClasses/AuthContext';
import { TimeFrameProvider } from './components/TimeFrameContext';

function App() {
	return (
		<AuthProvider>
			<TimeFrameProvider>
			<Router>
			<GlobalStyles />
			<Navbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/learn" element={<Learn />} />
				<Route path="/practice" element={<Practice />} />
				<Route path="/trade" element={<Trade />} />
				<Route path="/subscribe" element={<Subscribe />} />
				<Route path="/portfolio" element={<Portfolio />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
				</Router>
			</TimeFrameProvider>
		</AuthProvider>
  );
}

export default App;
