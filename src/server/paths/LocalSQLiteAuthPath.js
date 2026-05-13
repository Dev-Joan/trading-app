
const { validatePassword } = require('../passwordValidation');
const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const bcrypt = require('bcrypt');

const router = express.Router();

// Table versions and their schemas
const TABLE_VERSIONS = {
	1: `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS schema_version (
            table_name TEXT PRIMARY KEY,
            version INTEGER NOT NULL
        );
    `,
	2: `
        ALTER TABLE users ADD COLUMN last_login DATETIME;
    `,
	3: `
        ALTER TABLE users ADD COLUMN profile JSON;
    `,
	4: `
		-- Create a temporary table with collation to lowercase usernames
		CREATE TABLE users_new (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE NOT NULL COLLATE NOCASE,
			password TEXT NOT NULL,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			last_login DATETIME,
			profile JSON
		);
		
		-- Copy data from the old table to the new table
		INSERT INTO users_new SELECT * FROM users;
		
		-- Drop the old table
		DROP TABLE users;
		
		-- Rename the new table to the original name
		ALTER TABLE users_new RENAME TO users;
	`,
	// Add future versions here
};

const CURRENT_VERSION = 4; // Update this when adding new versions, could use TABLE_VERSIONS.length(), but it is likely better to be explicit about this. 
const BCRYPT_COUNT = 13; // Update this when needed

/**
 *  Checks to make sure the user is logged in
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function isAuthenticated(req, res, next) {
	if (req.session && req.session.userId) {
		return next();
	}
	res.redirect('/');
}

// Database initialization
async function initializeDb() {
	const dbPath = path.join(__dirname, '..', '..', 'data', 'users.db');

	// Ensure the data directory exists
	const dataDir = path.dirname(dbPath);
	require('fs').mkdirSync(dataDir, { recursive: true });

	const db = await open({
		filename: dbPath,
		driver: sqlite3.Database
	});

	await ensureTableVersion(db);
	return db;
}

async function getCurrentTableVersion(db) {
	try {
		// Try to get current version
		const result = await db.get(
			'SELECT version FROM schema_version WHERE table_name = ?',
			['users']
		);
		return result ? result.version : 0;
	} catch (error) {
		// If table doesn't exist, return 0
		return 0;
	}
}

async function updateTableVersion(db, version) {
	await db.run(
		`INSERT OR REPLACE INTO schema_version (table_name, version) 
         VALUES (?, ?)`,
		['users', version]
	);
}

async function ensureTableVersion(db) {
	const currentVersion = await getCurrentTableVersion(db);

	if (currentVersion < 0) {
		throw new Error(`Database version ${currentVersion} is negative. This shouldn't happen, you broke it. `);
	}

	if (currentVersion > CURRENT_VERSION) {
		throw new Error(`Database version ${currentVersion} is newer than supported version ${CURRENT_VERSION}`);
	}

	if (currentVersion < CURRENT_VERSION) {
		// Begin transaction for schema updates
		await db.run('BEGIN TRANSACTION');

		try {
			// Apply each version update sequentially
			for (let v = currentVersion + 1; v <= CURRENT_VERSION; v++) {
				if (!TABLE_VERSIONS[v]) {
					throw new Error(`Missing migration for version ${v}`);
				}

				console.log(`Upgrading database to version ${v}`);
				await db.exec(TABLE_VERSIONS[v]);
			}

			// Update the schema version
			await updateTableVersion(db, CURRENT_VERSION);
			await db.run('COMMIT');

			console.log(`Database successfully upgraded to version ${CURRENT_VERSION}`);
		} catch (error) {
			await db.run('ROLLBACK');
			throw new Error(`Failed to upgrade database: ${error.message}`);
		}
	}
}

// Check if a username already exists
async function isUsernameTaken(db, username) {
	const user = await db.get('SELECT username FROM users WHERE LOWER(username) = LOWER(?)', username);
	return user !== undefined;
}

// Create a default Profile
async function createDefaultProfile(db, profile) {
	if (await isUsernameTaken(db, "default")) {
		const user = await db.get(
			'SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
			["default"]
		);
		return user.id;
	}

	let hashedPassword = await bcrypt.hash("default", BCRYPT_COUNT );
	let result = await db.run(
		'INSERT INTO users (username, password, profile) VALUES (?, ?, ?)',
		["default", hashedPassword, JSON.stringify(profile)]
	);
	return result.lastID
}

/**
 * Register User
 */
router.post('/register', async (req, res) => {	
	try {
		let { username, password, defaultProfile } = req.body;
		
		username = req.sanitize(username).toLowerCase();

		if (!username || !password) {
			return res.status(400).json({ error: 'Username and password are required' });
		}

		if (!validatePassword(password).isValid) {
			return res.status(409).json({ error: 'Password not valid' });
		}


		var hashedPassword = await bcrypt.hash(password, BCRYPT_COUNT);

		const db = await initializeDb();

		if (await isUsernameTaken(db, username)) {
			return res.status(409).json({ error: 'Username already exists' });
		}

		const result = await db.run(
			'INSERT INTO users (username, password, profile) VALUES (?, ?, ?)',
			[username, hashedPassword, JSON.stringify(defaultProfile)]
		);

		res.status(201).json({
			message: 'User registered successfully',
			userId: result.lastID
		});

	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

/**
 * Login User
 */
router.post('/login', async (req, res) => {
	try {
		let { username, password } = req.body;
		username = req.sanitize(username).toLowerCase();

		if (!username || !password) {
			return res.status(400).json({ error: 'Username and password are required' });
		}
		

		if (!validatePassword(password).isValid) {
			return res.status(409).json({ error: 'Password not valid' });
		}

		const db = await initializeDb();

		const user = await db.get(
			'SELECT * FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
			[username]
		);

		if (!user) {
			return res.status(401).json({ error: 'Non existing User' });
		}

		var match = await bcrypt.compare(password, user.password);
		if (!match) {
			console.log("Passwords don't match");

			//Passwords don't match
			return res.status(401).json({ error: 'In-valid Password' });
		}


		// Update last_login if we're on version 2 or higher
		if (await getCurrentTableVersion(db) >= 2) {
			await db.run(
				'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
				[user.id]
			);
		}


		req.session.userId = user.id;
		req.session.userName = user.username;		
		req.session.profile = user.profile;
		
		req.session.save(err => {
			if (err) {
				console.error('Session save error:', err);
				return res.status(500).json({ error: 'Session error' });
			}

			res.json({
				message: 'Login successful',
				userId: user.id,
				profile: user.profile
			});
		});

	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});


/**
 * Saves game Data
 * In a non grader environment, would use isAuthenticated to actually make sure users were logged in. 
 */
router.post('/save', async (req, res) => {
	let { profile } = req.body;
	console.log("Trying to save profile:", profile);
	
	const db = await initializeDb();
	if (!req.session || !req.session.userId) {
		//User is not logged in
		
		//We pretend User is logged in from now. This will be overwritten by the login feature, so is fine to jsut set it like this
		req.session.userId =  await createDefaultProfile(db, profile);
		req.session.userName = "default";
		req.session.profile = profile;

		await new Promise((resolve, reject) => {
			req.session.save(err => {
				if (err) reject(err);					
				else {
					resolve();
				}
			});
		});

	}

	let userId = req.session.userId;


	const user = await db.get(
		'SELECT * FROM users WHERE id = ? LIMIT 1',
		[userId]
	);

	if (!user) {
		//This shouldn't be able to run here
		return res.status(401).json({ error: 'Non existing User' });
	}

	await db.run(
		'UPDATE users SET profile = ? WHERE id = ?',
		[JSON.stringify(profile), user.id]
	);

	console.log("Updated profile");
	
	res.json({
		message: 'Login successful',
		userId: user.id,
		profile: user.profile
	});

	
});


module.exports = router;