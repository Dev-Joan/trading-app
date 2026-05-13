// AuthInfo.test.js
import authInfo from '../AuthInfo';
import Profile from '../Profile';

// Mock dependencies
jest.mock('../Profile', () => ({
	currentProfile: {
		name: 'Test User',
		email: 'test@example.com',
		settings: { theme: 'dark' }
	}
}));

jest.mock('../AuthClasses/AuthContext', () => ({
	useAuth: jest.fn()
}));

jest.mock('../config', () => ({
	port: 3005,
	baseUrl: 'http://localhost:3005/',
	apiBaseUrl: 'http://localhost:3005/api',
	gemeniApiKey: "mock-key",
	get gemeniApiUrl() {
		return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.gemeniApiKey}`;
	},
}));
// Mock fetch API
global.fetch = jest.fn();

describe('AuthInfo Class', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();

		// Default mock implementation for fetch
		global.fetch.mockImplementation(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve({ success: true })
			})
		);
	});

	describe('constructor', () => {
		test('should initialize with correct baseURL', () => {
			expect(authInfo.baseURL).toBe('http://localhost:3005/account/localSQLite');
		});
	});

	describe('buildURL', () => {
		test('should build URL without query parameters', () => {
			const url = authInfo.buildURL('/test');
			expect(url).toBe('http://localhost:3005/account/localSQLite/test');
		});

		test('should build URL with query parameters', () => {
			const url = authInfo.buildURL('/test', { id: 123, name: 'test' });
			expect(url).toBe('http://localhost:3005/account/localSQLite/test?id=123&name=test');
		});

		test('should ignore null or undefined parameters', () => {
			const url = authInfo.buildURL('/test', { id: 123, name: null, age: undefined, active: true });
			expect(url).toBe('http://localhost:3005/account/localSQLite/test?id=123&active=true');
		});
	});

	describe('fetchData', () => {
		test('should make POST request with correct headers and body', async () => {
			const mockData = { username: 'testuser', password: 'password123' };

			await authInfo.fetchData('http://test-url.com', mockData);

			expect(global.fetch).toHaveBeenCalledWith(
				'http://test-url.com',
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(mockData)
				}
			);
		});

		test('should return response data when request is successful', async () => {
			const mockResponseData = {
				success: true,
				user: { id: 1, username: 'testuser' }
			};

			global.fetch.mockImplementationOnce(() =>
				Promise.resolve({
					ok: true,
					json: () => Promise.resolve(mockResponseData)
				})
			);

			const result = await authInfo.fetchData('http://test-url.com');

			expect(result).toEqual(mockResponseData);
		});

		test('should throw error when fetch fails', async () => {
			global.fetch.mockImplementationOnce(() =>
				Promise.reject(new Error('Network error'))
			);

			await expect(authInfo.fetchData('http://test-url.com'))
				.rejects
				.toThrow('Network error');
		});

		test('should throw error when response is not ok', async () => {
			global.fetch.mockImplementationOnce(() =>
				Promise.resolve({
					ok: false,
					status: 401,
					json: () => Promise.resolve({ error: 'Unauthorized access' })
				})
			);

			await expect(authInfo.fetchData('http://test-url.com'))
				.rejects
				.toThrow('Unauthorized access');
		});

		test('should use default status message when error response has no message', async () => {
			global.fetch.mockImplementationOnce(() =>
				Promise.resolve({
					ok: false,
					status: 500,
					json: () => Promise.resolve({})
				})
			);

			await expect(authInfo.fetchData('http://test-url.com'))
				.rejects
				.toThrow('HTTP error! status: 500');
		});
	});

	describe('register', () => {
		test('should call fetchData with correct URL and data', async () => {
			// Spy on fetchData method
			const fetchDataSpy = jest.spyOn(authInfo, 'fetchData').mockResolvedValue({ success: true });

			const username = 'newuser';
			const password = 'password123';

			await authInfo.register(username, password);

			expect(fetchDataSpy).toHaveBeenCalledWith(
				'http://localhost:3005/account/localSQLite/register',
				{
					username,
					password,
					defaultProfile: Profile.currentProfile
				}
			);
		});

		test('should return response from fetchData', async () => {
			const mockResponse = {
				success: true,
				user: { id: 1, username: 'newuser' }
			};

			jest.spyOn(authInfo, 'fetchData').mockResolvedValue(mockResponse);

			const result = await authInfo.register('newuser', 'password123');

			expect(result).toEqual(mockResponse);
		});

		test('should propagate errors from fetchData', async () => {
			jest.spyOn(authInfo, 'fetchData')
				.mockRejectedValue(new Error('Registration failed'));

			await expect(authInfo.register('newuser', 'password123'))
				.rejects
				.toThrow('Registration failed');
		});
	});

	describe('login', () => {
		test('should call fetchData with correct URL and data', async () => {
			// Spy on fetchData method
			const fetchDataSpy = jest.spyOn(authInfo, 'fetchData').mockResolvedValue({ success: true });

			const username = 'existinguser';
			const password = 'password123';

			await authInfo.login(username, password);

			expect(fetchDataSpy).toHaveBeenCalledWith(
				'http://localhost:3005/account/localSQLite/login',
				{
					username,
					password
				}
			);
		});

		test('should return response from fetchData', async () => {
			const mockResponse = {
				success: true,
				token: 'jwt-token-here',
				user: { id: 1, username: 'existinguser' }
			};

			jest.spyOn(authInfo, 'fetchData').mockResolvedValue(mockResponse);

			const result = await authInfo.login('existinguser', 'password123');

			expect(result).toEqual(mockResponse);
		});

		test('should propagate errors from fetchData', async () => {
			jest.spyOn(authInfo, 'fetchData')
				.mockRejectedValue(new Error('Invalid credentials'));

			await expect(authInfo.login('wronguser', 'wrongpass'))
				.rejects
				.toThrow('Invalid credentials');
		});
	});

	describe('saveCurrentData', () => {
		test('should call fetchData with correct URL and profile data', async () => {
			// Spy on fetchData method
			const fetchDataSpy = jest.spyOn(authInfo, 'fetchData').mockResolvedValue({ success: true });

			await authInfo.saveCurrentData();

			expect(fetchDataSpy).toHaveBeenCalledWith(
				'http://localhost:3005/account/localSQLite/save',
				{
					profile: Profile.currentProfile
				}
			);
		});

		test('should return response from fetchData', async () => {
			const mockResponse = { success: true, message: 'Data saved successfully' };

			jest.spyOn(authInfo, 'fetchData').mockResolvedValue(mockResponse);

			const result = await authInfo.saveCurrentData();

			expect(result).toEqual(mockResponse);
		});

		test('should propagate errors from fetchData', async () => {
			jest.spyOn(authInfo, 'fetchData')
				.mockRejectedValue(new Error('Failed to save data'));

			await expect(authInfo.saveCurrentData())
				.rejects
				.toThrow('Failed to save data');
		});
	});
});