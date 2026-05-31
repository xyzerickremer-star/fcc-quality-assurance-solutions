require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');

const fccTestingRoutes  = require('./routes/fcctesting.js');
// test-runner is required lazily only for local NODE_ENV=test runs.
const userRoutes        = require('./routes/api.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
userRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Start our server and tests locally only. Vercel imports and uses the exported app.
function startServer() {
  const portNum = process.env.PORT || 3000;
  const listener = app.listen(portNum, function () {
    const actualPort = listener.address() && listener.address().port ? listener.address().port : portNum;
    console.log('Listening on port ' + actualPort);
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          require('./test-runner').run();
        } catch (e) {
          console.log('Tests are not valid:');
          console.error(e);
        }
      }, 1500);
    }
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app; // For testing
