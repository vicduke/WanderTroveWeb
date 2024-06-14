<h1>WanderTrove</h1>
<br>
WanderTrove is a travel management application that allows users to create, view, and manage their trips. Users can register, log in, create new trips, and add details about each trip, including multiple stop points. The application leverages MySQL for data storage and uses date-fns for date formatting.
Table of Contents
Installation
Usage
API Endpoints
Technologies Used
License
Installation
Prerequisites
Node.js
MySQL
Steps
Clone the repository:

sh
Copy code
git clone https://github.com/your-username/wandertrove.git
cd wandertrove
Install the dependencies:

sh
Copy code
npm install
Set up the MySQL database:

Create a MySQL database named wandertrove.
Run the following SQL commands to set up the necessary tables:
sql
Copy code
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
Create a .env file in the root directory and add your MySQL credentials:

env
Copy code
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=wandertrove
SESSION_SECRET=your-session-secret
Start the server:

sh
Copy code
npm start
Open your browser and navigate to http://localhost:3000.

Usage
Register: Create a new account by providing an email, username, and password.
Login: Log in with your registered username and password.
Create Trip: Create a new trip with details like trip name, start date, end date, and notes.
Add Stop Points: Add multiple stop points to your trip.
View Trips: View a list of your trips and click on each trip to view detailed information.
API Endpoints
User Endpoints
Register a new user:

URL: /register
Method: POST
Body:
json
Copy code
{
  "email": "user@example.com",
  "username": "username",
  "password": "password",
  "full_name": "Full Name"
}
Login:

URL: /login
Method: POST
Body:
json
Copy code
{
  "username": "username",
  "password": "password"
}
Logout:

URL: /logout
Method: POST
Trip Endpoints
Save a trip:

URL: /saveTrip
Method: POST
Body:
json
Copy code
{
  "tripName": "Trip to Paris",
  "startDate": "2024-06-05T21:00:00.000Z",
  "endDate": "2024-06-10T21:00:00.000Z",
  "location": "Paris",
  "notes": "A trip to Paris",
  "stopPoints": [
    {
      "stopName": "Eiffel Tower",
      "stopType": "Sightseeing"
    }
  ]
}
Get user trips:

URL: /getUserTrips
Method: GET
Get trip details:

URL: /getTripDetails
Method: GET
Query Parameter: id (trip ID)
Technologies Used
Backend:

Node.js
Express.js
MySQL
bcrypt.js for password hashing
express-session for session management
Frontend:

HTML, CSS, JavaScript
date-fns for date formatting
License
This project is licensed under the MIT License.
