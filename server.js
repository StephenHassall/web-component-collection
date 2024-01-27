/**
 * Simple server code to run examples in browser.
 * Point you browser to http://localhost:3000
 */
// Get express node module
import express from 'express';

// Create server
const server = express();

// Create and add the static public HTML middleware module
server.use(express.static('./'));

// Start server on port 3000
server.listen(3000);

// Log ready
console.log('Ready');
