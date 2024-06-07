document.addEventListener("DOMContentLoaded", function() {
    // Script for home page
    const text = "Your No. 1 trip planner!";
    const descriptionElement = document.querySelector(".description");
    let index = 0;

    if (descriptionElement) {
        function typeText() {
            if (index < text.length) {
                descriptionElement.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 100);
            } else {
                descriptionElement.style.borderRight = 'none';
            }
        }
        typeText();
    }

    // Script for registering, logging in, and logging out a user
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutForm = document.getElementById('logout-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const username = formData.get('username');
            const password = formData.get('password');
            const email = formData.get('email');
            const full_name = formData.get('full_name');
            try {
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password, email, full_name })
                });
                if (response.ok) {
                    alert('Registration successful');
                } else {
                    alert('Registration failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                if (response.ok) {
                    alert('Login successful');
                    window.location.href = '/homepage.html';
                } else {
                    alert('Invalid username or password');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    if (logoutForm) {
        logoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/logout', {
                    method: 'POST'
                });
                if (response.ok) {
                    alert('Logout successful');
                } else {
                    alert('Logout failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }

    // Script for adding a trip
    const tripForm = document.getElementById('tripForm');
    const stopPointsDiv = document.getElementById('stopPoints');

    if (tripForm) {
        tripForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(tripForm);
            const stopPoints = [];

            stopPointsDiv.querySelectorAll('.stop-point').forEach(stopPoint => {
                stopPoints.push({
                    stopName: stopPoint.querySelector('input[name="stopPointName[]"]').value,
                    stopType: stopPoint.querySelector('input[name="stopPointType[]"]').value
                });
            });

            const data = {
                tripName: formData.get('tripName'),
                startDate: formData.get('startDate'),
                endDate: formData.get('endDate'),
                location: formData.get('location'),
                notes: formData.get('notes'),
                stopPoints: stopPoints
            };

            try {
                const response = await fetch('/saveTrip', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Trip saved!');
                } else {
                    alert('Failed to save trip');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
//adding and deleting a stop point
    const addStopPointBtn = document.querySelector('.add-stop-points-btn');
    const deleteStopPointBtn = document.querySelector('.delete-stop-points-btn');

    if (addStopPointBtn) {
        addStopPointBtn.addEventListener('click', addStopPoint);
    }

    if (deleteStopPointBtn) {
        deleteStopPointBtn.addEventListener('click', deleteStopPoint);
    }

    function addStopPoint() {
        const stopPointDiv = document.createElement('div');
        stopPointDiv.classList.add('stop-point');
        stopPointDiv.innerHTML = `
            <input type="checkbox" class="stop-point-checkbox">
            <input type="text" name="stopPointName[]" placeholder="Stop Point Name" required>
            <input type="text" name="stopPointType[]" placeholder="Type (fuel, food, sleep)" required>
        `;
        stopPointsDiv.appendChild(stopPointDiv);
    }

    function deleteStopPoint() {
        const checkboxes = document.querySelectorAll('.stop-point-checkbox');
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const stopPointDiv = checkbox.parentElement;
                stopPointsDiv.removeChild(stopPointDiv);
            }
        });
    }

    // Check if the current page is the profile page
    if (window.location.pathname.endsWith('profile.html')) {
        // Fetch logged in user's full name
        fetchFullName();
    }

    // Check if the current page is the trips page page
    if (window.location.pathname.endsWith('trips.html')) {
        fetchUserTrips();
    }

    window.openTrip = function(tripId) {
        window.location.href = `/detailtrip.html?id=${tripId}`;
        }

    if (window.location.pathname.endsWith('detailtrip.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const tripId = urlParams.get('id');
        fetchTripDetails(tripId);
    }
});

// Script for navigating to trip page
function goToAddTripPage() {
    window.location.href = 'newtrip.html';
}

function fetchFullName() {
    // Make AJAX request to fetch the user's full name and email from the server
    fetch('/get-fullname')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Display the user's full name on the dashboard
            displayFullName(data.fullName, data.useremail);
        })
        .catch(error => {
            console.error('Error fetching user full name:', error);
        });
}

function displayFullName(fullName, useremail) {
    const fullNameElement = document.getElementById('user-fullname');
    const useremailelement = document.getElementById('user-email');
    if (fullNameElement) {
        fullNameElement.textContent = fullName;
    } else {
        console.error('Element with id "user-fullname" not found');
    }
    if (useremailelement) {
        useremailelement.textContent = useremail;
    } else {
        console.error('Element with id "user-email" not found');
    }
}

function fetchUserTrips() {
    fetch('/getUserTrips')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(trips => {
            displayTrips(trips);
        })
        .catch(error => {
            console.error('Error fetching trips:', error);
        });
}

function displayTrips(trips) {
    const tripsList = document.getElementById('tripsList');
    tripsList.innerHTML = ''; // Clear any existing content

    if (trips.length === 0) {
        tripsList.innerHTML = '<p>No trips found.</p>';
        return;
    }

    trips.forEach(trip => {
        const tripElement = document.createElement('div');
        tripElement.classList.add('trip-item');
        tripElement.innerHTML = `
            <h3>${trip.tripName}</h3>
            <p><strong>Start Date:</strong> ${trip.startDate}</p>
            <p><strong>End Date:</strong> ${trip.endDate}</p>
            <button onclick="openTrip(${trip.trip_id})">View Trip</button>
        `;
        tripsList.appendChild(tripElement);
    });
}

function fetchTripDetails(tripId) {
    fetch(`/getTripDetails?id=${tripId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(trip => {
            displayTripDetails(trip);
        })
        .catch(error => {
            console.error('Error fetching trip details:', error);
        });
}

function displayTripDetails(trip) {
    document.getElementById('tripName').textContent = trip.tripName;
    document.getElementById('startDate').textContent = trip.startDate;
    document.getElementById('endDate').textContent = trip.endDate;
    document.getElementById('location').textContent = trip.location;
    document.getElementById('notes').textContent = trip.notes;

    const stopPointsList = document.getElementById('stopPointsList');
    stopPointsList.innerHTML = ''; // Clear any existing content

    if (trip.stopPoints.length === 0) {
        stopPointsList.innerHTML = '<p>No stop points found.</p>';
        return;
    }else{trip.stopPoints.forEach(stopPoint => {
        const stopPointElement = document.createElement('div');
        stopPointElement.classList.add('stop-point-item');
        stopPointElement.innerHTML = `
            <p><strong>Stop Name:</strong> ${stopPoint.stopName}</p>
            <p><strong>Stop Type:</strong> ${stopPoint.stopType}</p>
        `;
        stopPointsList.appendChild(stopPointElement);
    });
    }
}