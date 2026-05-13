import Portfolio from "./Portfolio";
// const Portfolio = require('./Portfolio');

/**
 * Profile class
 * 
 */
class Profile {

	static currentProfile = null;
	constructor() {		
		let defaultProfile = new Portfolio();
		defaultProfile.addCash(1000);
		this.portfolios = [defaultProfile];//List of portfolios/saves
		this.currentSave = 0;
		this.calendarDeadlines = [];
		this.calendarNotes = null;
		this.calendarReminders = [];
		this.enrolledCourses = [];
		this.learningActivity = null;
	}

	static fromJSON(json) {
		let profile = new Profile();
		let data;
		try {
			data = JSON.parse(json);
		} catch (error) {
			//Invalid Json
			return profile;
		}	

		//If no Json, just return the default
		if (!data) { 
			return profile;
		}

		let { portfolios, ...rest } = data;

		Object.assign(profile, rest);

		if (portfolios) {			
			profile.portfolios = portfolios.map(p => Portfolio.fromJSON(p));
		}

		return profile;
	}


	// Calendar Deadlines
	setCalendarDeadlines(deadlines) {
		this.calendarDeadlines = deadlines;
		localStorage.setItem('calendar_deadlines', JSON.stringify(deadlines));
	}

	getCalendarDeadlines() {
		const stored = localStorage.getItem('calendar_deadlines');
		return stored ? JSON.parse(stored) : null;
	}

	// Calendar Notes
	setCalendarNotes(notes) {
		this.calendarNotes = notes;
		localStorage.setItem('calendar_notes', notes);
	}

	getCalendarNotes() {
		return localStorage.getItem('calendar_notes');
	}

	// Calendar Reminders
	setCalendarReminders(reminders) {
		this.calendarReminders = reminders;
		localStorage.setItem('calendar_reminders', JSON.stringify(reminders));
	}

	getCalendarReminders() {
		const stored = localStorage.getItem('calendar_reminders');
		return stored ? JSON.parse(stored) : null;
	}

	// Enrolled Courses
	setEnrolledCourses(courses) {
		this.enrolledCourses = courses;
		localStorage.setItem('enrolledCourses', JSON.stringify(courses));
	}

	getEnrolledCourses() {
		const stored = localStorage.getItem('enrolledCourses');
		return stored ? JSON.parse(stored) : null;
	}

	// Learning Activity
	setLearningActivity(activity) {
		this.learningActivity = activity;
		localStorage.setItem('learningActivity', JSON.stringify(activity));
	}

	getLearningActivity() {
		const stored = localStorage.getItem('learningActivity');
		return stored ? JSON.parse(stored) : null;
	}

	toString() { }//Makes a string of the portfolio
	// toJson() {
	// 	return {
	// 		portfolios: this.portfolios.map(p => p.toJSON()), // Assuming Portfolio has toJSON()
	// 		currentSave: this.currentSave,
	// 		calendarDeadlines: this.calendarDeadlines,
	// 		calendarNotes: this.calendarNotes,
	// 		calendarReminders: this.calendarReminders,
	// 		enrolledCourses: this.enrolledCourses,
	// 		learningActivity: this.learningActivity
	// 	};

	// }//Makes a Json of the portfolio

	test() { 
		console.log("This worked!");
		
	}

}

// module.exports = Profile;
export default Profile; 