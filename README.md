<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WanderTrove README</title>
</head>
<body>

<h1>WanderTrove</h1>
<p>WanderTrove is a travel management application that allows users to create, view, and manage their trips. Users can register, log in, create new trips, and add details about each trip, including multiple stop points. The application leverages MySQL for data storage.</p>

<h2>Table of Contents</h2>
<ul>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#technologies-used">Technologies Used</a></li>
    <li><a href="#license">License</a></li>
</ul>

<h2 id="installation">Installation</h2>

<h3>Prerequisites</h3>
<ul>
    <li>Node.js</li>
    <li>MySQL</li>
</ul>

<h3>Steps</h3>
<p>Clone the repository:</p>

<pre><code>sh
git clone https://github.com/vicduke/wandertrove.git
cd wandertrove
</code></pre>

<p>Install the dependencies:</p>

<pre><code>sh
npm install express express-session bcryptjs body-parser mysql2 express-validator dotenv
</code></pre>

<p>Set up the MySQL database:</p>
<ol>
    <li>Create a MySQL database named wandertrove.</li>
    <li>Run the following SQL commands to set up the necessary tables:</li>
</ol>

<pre><code>sql
CREATE DATABASE wandertrove;
USE wandertrove
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL
);

CREATE TABLE Locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tripName VARCHAR(255) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    notes TEXT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Stop_Points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stopName VARCHAR(255) NOT NULL,
    stopType VARCHAR(255) NOT NULL,
    trip_id INT,
    FOREIGN KEY (trip_id) REFERENCES Trips(id)
);
</code></pre>

<p>Create a .env file in the root directory and add your MySQL credentials:</p>

<pre><code>env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=wandertrove
SESSION_SECRET=your-session-secret
</code></pre>

<p>Start the server:</p>

<pre><code>sh
node server.js
</code></pre>

<p>Open your browser and navigate to <a href="http://localhost:3000">http://localhost:3000</a>.</p>

<h2 id="usage">Usage</h2>
<ul>
    <li>Register: Create a new account by providing an email, username, and password.</li>
    <li>Login: Log in with your registered username and password.</li>
    <li>Create Trip: Create a new trip with details like trip name, start date, end date, and notes.</li>
    <li>Add Stop Points: Add multiple stop points to your trip.</li>
    <li>View Trips: View a list of your trips and click on each trip to view detailed information.</li>
    <li>Explore: Explore published trips</li>
</ul>

<h2 id="technologies-used">Technologies Used</h2>
<h3>Backend:</h3>
<ul>
    <li>Node.js</li>
    <li>Express.js</li>
    <li>MySQL</li>
    <li>bcrypt.js for password hashing</li>
    <li>express-session for session management</li>
</ul>

<h3>Frontend:</h3>
<ul>
    <li>HTML </li>
    <li>CSS</li>
    <li>JavaScript</li>
</ul>

<h2 id="license">License</h2>
<p>This project is licensed under the MIT License.</p>

</body>
</html>