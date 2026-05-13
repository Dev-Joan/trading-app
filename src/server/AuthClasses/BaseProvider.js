import { validatePassword } from '../passwordValidation';

export class BaseProvider {
	async register(username, password) {
		throw new Error("Method not implemented");
	}

	async login(username, password) {
		throw new Error("Method not implemented");
	}

	checkPassword(password) { 
		let validation = validatePassword(password);
			if (!validation.isValid) { 
				//Loop through the possible errors, and throw the first one that is invalid. 
				for (var i in validation.errors) { 
					if (!i.valid) { 
						throw new Error(i.message);
					}
				}
				//This shouldn't run, but just incase will throw a generic error. 
				throw new Error('Invalid password, Please report.');
			} 
	}
}