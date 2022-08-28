/**
 * Unofficial REST API for the U.S. State Dept.'s travel advisories.
 * 
 * @author Thomas Kirrane
 */

// Import and set up dotenv for environment variables
require('dotenv').config()

/**
 * State dept. data retrieval / processing
 * 
 * @todo This could potentially be moved to it's own file
 */

// Import actions from file
const { getAdvisories, toMilliseconds } = require("./actions")

// The following methods and variable set up caching for the converted RSS feed

// Variable to hold the cached feed
let data = undefined

// Method to retrieve the RSS feed and save it
const updateData = () => getAdvisories()
    .then((parsedData) => data = parsedData)
    .catch(console.error)

// Interval to keep the data current
updateData() // This ensures it runs on start
setInterval(() => {
    updateData()
}, toMilliseconds(process.env.STATE_DEPT_RSS_REFRESH_FREQUENCY ?? 1))

/**
 * Express server setup
 */

// Import express and create a new instance
const express = require("express")
const server = express()

// Establish a rate limit
const rateLimit = require("express-rate-limit")
server.use(rateLimit({
    windowMs: toMilliseconds(process.env.API_RATE_LIMIT_TIME ?? 10),
    max: (process.env.API_RATE_LIMIT_COUNT ?? 100),
    standardHeaders: true,
    legacyHeaders: false
}))

// Register api route
server.get('/', (req, res) => {

    // Check to see if there is cached data
    return data ?

        // Cached data is present, send to client
        res.status(200).json(data) :

        // Cached data is not present, get it and send to client.
        updateData().then(() => res.status(200).json(data))
})

// Set server to listen on desired port
const port = process.env.API_PORT ?? 9000
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})