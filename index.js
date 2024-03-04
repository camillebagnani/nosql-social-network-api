const express = require('express');
// Variable to hold the connection
const db = require('./config/connection');
const routes = require('./routes');

// PORT is either saved PORT in .env or 3001 locally
const PORT = process.env.PORT || 3001;
// Initialize instance of Express
const app = express();

// Used when receiving data as a form in a POST method
app.use(express.urlencoded({ extended: true}));
// Used when receiving JSON objects from a POST method
app.use(express.json());
// Middleware to use the routes
app.use(routes);

// Once Mongoose is connected, it will start the server
db.once('open', () => {
    // Start the Express server
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`)
    })
})