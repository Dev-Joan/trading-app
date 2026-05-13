const port = 3005;


module.exports = {
	port,
	baseUrl: process.env.NODE_ENV === 'production'
		? '/'
		: `http://localhost:${port}/`,
	apiBaseUrl: process.env.NODE_ENV === 'production' //This is needed as using baseURL inside this object is not feasible in a good manor.
		? '/api'
		: `http://localhost:${port}/api`, 
	//Gemeni AI API credentials
	gemeniApiKey: "AIzaSyDRYXDsmqLAlLIeKb7MNDybPKqH60jPkr8",
	get gemeniApiUrl() {
		return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.gemeniApiKey}`;
	},
};