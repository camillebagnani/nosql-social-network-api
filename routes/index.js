const router = require('express').Router();
const apiRoutes = require('./api');

// Middleware for the initial entrance to the API routes
router.use('/api', apiRoutes);

// Error handling sends a body that says 'Wrong route!'
router.use((req, res) => res.send('Wrong route!'));

module.exports = router;