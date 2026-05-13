
const cors = require('cors');
const express = require('express');
const config = require('./config');
const path = require('path');
const ip = require('ip');
const fs = require('fs');
const app = express();

const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const port = config.port;


const yfinanceStockRoutes = require('./paths/yfinancePaths.js');
const localSQLiteRoute = require('./paths/LocalSQLiteAuthPath.js')

app.use(cors({
	origin: true, 
	credentials: true
}));
app.use(express.json());

app.use(expressSanitizer());
app.use(session({
	secret: 'CM2020 ASP secret key trading game',
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
    	sameSite: 'lax' 
	}
}));

app.use('/api/yfinance', yfinanceStockRoutes);  
app.use('/account/localSQLite', localSQLiteRoute);

//https://create-react-app.dev/docs/deployment/ for more understanding
// Check if build directory exists (meaning the app has been built)
const buildPath = path.join(__dirname, '../../build');
if (fs.existsSync(buildPath)) {
	// Serve static files from the React build
	app.use(express.static(buildPath));

	// Handle React routing, return all requests to React app
	app.get('*', (req, res) => {
		res.sendFile(path.join(buildPath, 'index.html'));
	});
}

app.listen(port, '0.0.0.0', () => {
	console.log(`Backend Server running on port ${port}`);
	console.log(`Local: http://localhost:${port}`);
	console.log(`Network: http://${ip.address()}:${port}`);
	if (fs.existsSync(buildPath)) {
		console.log('Serving React build files');
	} else {
		console.log('Running in API-only mode');
	}
});