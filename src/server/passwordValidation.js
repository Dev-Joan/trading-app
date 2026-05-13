
let validatePassword = (password) => {
	let words = password.trim().split(' ');
	let hasNumber = /\d/.test(password);
	let hasUppercase = /[A-Z]/.test(password);
	let hasLeadingOrTrailingSpaces = password.trim() !== password;
	const REQUIRED_WORDS = 1; // In reaL product, 5+ words should be used, it is about equal to 13 characters, and the reccomended is 12 characters.
	let noRestrictionsMode = true;
	/*
	Avg comparison of characters to pasword
	2 words ≈ 6 random characters
	3 words ≈ 8 random characters
	4 words ≈ 11 random characters
	5 words ≈ 13 random characters
	6 words ≈ 15 random characters
	7 words ≈ 17 random characters
	8 words ≈ 19 random characters
	9 words ≈ 21 random characters
	10 words ≈ 23 random characters
	*/
	
	if (noRestrictionsMode) { 
		return {
			isValid: true,
			errors: []
		};
	}
	
	return {
		isValid: words.length >= REQUIRED_WORDS && hasNumber && hasUppercase && !hasLeadingOrTrailingSpaces,
		errors: [
			{ id: 'words', valid: words.length >= REQUIRED_WORDS, message: REQUIRED_WORDS +'+ words required in password (With spaces separating words)\nEX: "My 2 children are nice!" or "Bugs are super c00l"' },
			{ id: 'number', valid: hasNumber, message: 'At least 1 number' },
			{ id: 'uppercase', valid: hasUppercase, message: 'At least 1 uppercase letter' },
			{ id: 'Leading/Trailing spaces', valid: !hasLeadingOrTrailingSpaces, message: "Can't have a space at the beginning or end of the password" },
		],
	};
};

module.exports = { validatePassword };