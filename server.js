const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { check, validationResult } = require('express-validator');
const app = express();

// Configure session middleware
app.use(session({
    secret: 'qwertyasdfg1234',
    resave: false,
    saveUninitialized: true
}));

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '@Nesh2005',
    database: 'wandertrove'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

// Serve static files from the default directory
app.use(express.static(__dirname));

// Set up middleware to parse incoming JSON data
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Define a User representation for clarity
const User = {
    tableName: 'Users', 
    createUser: function(newUser, callback) {
        connection.query('INSERT INTO ' + this.tableName + ' SET ?', newUser, callback);
    },  
    getUserByEmail: function(email, callback) {
        connection.query('SELECT * FROM ' + this.tableName + ' WHERE email = ?', email, callback);
    },
    getUserByUsername: function(username, callback) {
        connection.query('SELECT * FROM ' + this.tableName + ' WHERE username = ?', username, callback);
    }
};

// Define a Trips representation
const Trips = {
    tableName: 'Trips',
    createTrips: function(newTrip, callback) {
        connection.query('INSERT INTO ' + this.tableName + ' SET ?', newTrip, callback);
    }
};

// Define a Locations representation
const Locations = {
    tableName: 'Locations',
    checkLocationExists: function(location, callback) {
        connection.query('SELECT * FROM ' + this.tableName + ' WHERE location = ?', [location.location], (err, results) => {
            if (err) return callback(err);
            callback(null, results.length > 0);
        });
    },
    addLocation: function(newLocation, callback) {
        connection.query('INSERT INTO ' + this.tableName + ' SET ?', newLocation, callback);
    }
};

// Define a Stop_Points representation
const Stop_Points = {
    tableName: 'Stop_Points',
    createStopPoint: function(newStopPoint, callback) {
        connection.query('INSERT INTO ' + this.tableName + ' SET ?', newStopPoint, callback);
    }
};

// Define routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Registration route
app.post('/register', [
    // Validate email and username fields
    check('email').isEmail(),
    check('username').isAlphanumeric().withMessage('Username must be alphanumeric'),

    // Custom validation to check if email and username are unique
    check('email').custom(async (value) => {
        const user = await User.getUserByEmail(value);
        if (user) {
            throw new Error('Email already exists');
        }
    }),
    check('username').custom(async (value) => {
        const user = await User.getUserByUsername(value);
        if (user) {
            throw new Error('Username already exists');
        }
    }),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Create a new user object
    const newUser = {
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        fullname: req.body.full_name
    };

    // Insert user into MySQL
    User.createUser(newUser, (error, results, fields) => {
        if (error) {
          console.error('Error inserting user: ' + error.message);
          return res.status(500).json({ error: error.message });
        }
        console.log('Inserted a new user with id ' + results.insertId);
        res.status(201).json(newUser);
      });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Retrieve user from database
    connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            res.status(401).send('Invalid username or password');
        } else {
            const user = results[0];
            // Compare passwords
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    // Store user in session
                    req.session.user = user;
                    res.send('Login successful');
                } else {
                    res.status(401).send('Invalid username or password');
                }
            });
        }
    });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logout successful');
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.redirect('/index.html'); // Redirect to the login page
    }
};

// Route to get the user's full  and email
app.get('/get-fullname',isAuthenticated , (req, res) => {
    if (req.session.user && req.session.user.full_name) {
        res.json({ fullName: req.session.user.full_name, useremail: req.session.user.email });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

//route to save a trip
app.post('/saveTrip', isAuthenticated,async (req,res) => {
    const newTrip = {
                tripName: req.body.tripName,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                notes: req.body.notes
    };

    const newLocation = {
        location:req.body.location
    };

    const newStopPoint = req.body.stopPoints;

    try {
        // Insert new trip
        const tripResults = await new Promise((resolve, reject) => {
            Trips.createTrips(newTrip, (error, results) => {
                if (error) return reject(error);
                console.log('Inserted a new trip with id ' + results.insertId);
                resolve(results);
            });
        });

        // Check if location exists and add it if it doesn't
        const locationExists = await new Promise((resolve, reject) => {
            Locations.checkLocationExists(newLocation, (err, exists) => {
                if (err) return reject(err);
                resolve(exists);
            });
        });

        if (!locationExists) {
            await new Promise((resolve, reject) => {
                Locations.addLocation(newLocation, (err, results) => {
                    if (err) return reject(err);
                    console.log('Inserted a new location with id ' + results.insertId);
                    resolve(results);
                });
            });
        } else {
            console.log('Location already exists');
        }

        // Insert new stop point
        const stopPointResults = await new Promise((resolve, reject) => {
            Stop_Points.createStopPoint(newStopPoint, (error, results) => {
                if (error) return reject(error);
                console.log('Inserted a new stopPoint with id ' + results.insertId);
                resolve(results);
            });
        });

        // If all operations succeed, send a unified response
        res.status(201).json({ message: 'Trip saved successfully!' });

    } catch (error) {
        console.error('Error processing request: ' + error.message);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});