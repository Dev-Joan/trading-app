import Profile from './Profile';
const config = require('./config');


class AuthInfo { 

	constructor() {
		this.baseURL = config.baseUrl + "account/localSQLite";		
	}


	async register(username, password) { 
		
		let url = this.buildURL('/register');
		
		let defaultProfile = Profile.currentProfile;	

		return this.fetchData(url, { username, password, defaultProfile });
	}

	async login(username, password) {
		let url = this.buildURL('/login');
		return this.fetchData(url, { username, password });
	}

	async saveCurrentData() {
		let url = this.buildURL('/save');
		let profile = Profile.currentProfile;		
		return this.fetchData(url, { profile });
	}


	/**
	 * Utility method to build URL with query parameters
	 * @param {string} endpoint - API endpoint
	 * @param {Object} params - Query parameters
	 * @returns {string} Full URL with query parameters
	 */
	buildURL(endpoint, params = {}) {
		let url = `${this.baseURL}${endpoint}`;
		let queryParts = [];

		for (let key in params) {
			let value = params[key];

			if (value !== undefined && value !== null) {
				let queryPart = key + '=' + value;
				queryParts.push(queryPart);
			}
		}

		let queryString = '';
		if (queryParts.length > 0) {
			queryString = queryParts.join('&');
			url = url + '?' + queryString;
		}

		return url;
	}
	
	/**
	 * Generic fetch method with error handling
	 * @param {string} url - Full URL to fetch
	 * @returns {Promise<Object>} Response data
	 */
	async fetchData(url, data = {}) {		
		let responseData;
		try {
			let response = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data)
			});
			responseData = await response.json();

			if (!response.ok) {
				await console.log(responseData.error);
				
				throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
			}
		} catch (error) {
			console.error(`API fetch error: ${error.message}`);
			throw error;
		}
		return await responseData
	}
}

//Apparently ESLing error if you don't give it a name when you return it?
const authInfo = new AuthInfo();
export default authInfo;