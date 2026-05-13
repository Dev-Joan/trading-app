import { SqliteAuthProvider } from './SQLiteAuthProvider';

let currentProvider = new SqliteAuthProvider(); // Default to offline

export const AuthService = {
	setProvider: (provider) => {
		currentProvider = provider;
	},

	register: async (username, password) => {
		return currentProvider.register(username, password);
	},

	login: async (username, password) => {
		return currentProvider.login(username, password);
	},
};