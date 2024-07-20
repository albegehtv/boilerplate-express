require('dotenv').config();
let express = require('express');
let app = express();
var bodyParser = require('body-parser');

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Serve static assets from /public
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

// Route to return JSON with a dynamic message
app.get('/json', (req, res) => {
    let message = 'Hello json';
    if (process.env.MESSAGE_STYLE === 'uppercase') {
        message = message.toUpperCase();
    }
    res.json({ message });
});

// Route to return the current time
app.get('/now', (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({ time: req.time });
});

// Route to echo a word parameter
app.get('/:word/echo', (req, res) => {
    const { word } = req.params;
    res.json({ echo: word });
});

// Route to handle GET requests for /name and return a name based on query parameters
app.get('/name', (req, res) => {
    var { first: firstName, last: lastName } = req.query;
    res.json({ name: `${firstName} ${lastName}` });
});

// Route to handle POST requests for /name and return a name based on the request body
app.post('/name', (req, res) => {
    var string = req.body.first + ' ' + req.body.last;
    res.json({ name: string });
});

 module.exports = app;
