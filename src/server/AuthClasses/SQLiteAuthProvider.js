import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { BaseProvider } from './BaseProvider';

const BCRYPT_COUNT = 13;

//https://www.npmjs.com/package/sqlite for docs
export class SqliteAuthProvider extends BaseProvider {
	constructor() {
		super();
		this.dbPromise = open({
			filename: './users.db',
			driver: sqlite3.Database,
		});
		this.initializeDatabase();
	}

	async initializeDatabase() {
		let db = await this.dbPromise;
		await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        passwordHash TEXT
      )
    `);
	}

	async register(username, password) {
		this.checkPassword(password);
		let db = await this.dbPromise;
		try {
			await db.run(
				'INSERT INTO users (username, passwordHash) VALUES (?, ?)',
				username,
				await bcrypt.hash(password, BCRYPT_COUNT)
			);
		} catch (error) {
			if (error.code === 'SQLITE_CONSTRAINT') {
				throw new Error('Username already exists');
			}
			throw error;
		}
	}

	async login(username, password) {
		this.checkPassword(password);
		let db = await this.dbPromise;
		let user = await db.get('SELECT * FROM users WHERE username = ?', username);
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new Error('Invalid credentials');
		}
		return user;
	}
}