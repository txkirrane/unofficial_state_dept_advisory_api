// Function to get data from the State Dept.
const {parse} = require("rss-to-json")

/**
 * Uses the `rss-to-json` library to retrieve the State Dept's
 * RSS feed, and then convert it to JSON
 * 
 * @returns {Promise} Converted data, or an error message
 */
const getAdvisories = () => parse(process.env.STATE_DEPT_RSS_URL)

/**
 * Quick method that converts minutes to milliseconds
 * 
 * @param {int} minutes Minutes to convert into milliseconds
 * @returns {int} milliseconds
 */
const toMilliseconds = (minutes) => (minutes * 60000)

// Expose nessecary methods
module.exports = {
    getAdvisories,
    toMilliseconds
}