# User Management System

## Overview
The User Management System is a web application that allows users to manage a list of users through a simple interface. It provides functionalities to add, update, delete, and search for users. The application is built using Node.js for the backend and JavaScript for the frontend.

## Features
- **User CRUD Operations**: Create, Read, Update, and Delete user records.
- **Search Functionality**: Search for users by first name, last name, email, or ID.
- **Pagination**: Navigate through user records with pagination (limited to 1000 users per request).
- **Logging**: Logs GET requests for user searches to a log file for monitoring purposes.
- **CORS Support**: Allows cross-origin requests for frontend integration.

## Technologies Used
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Frontend**: HTML, CSS, JavaScript

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/user-management-system.git
   cd user-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Ensure you have MongoDB installed and running on your local machine.
   - Create a database named `tester`.

4. Start the server:
   ```bash
   node index.js
   ```

5. Access the application:
   - Open your browser and navigate to `http://localhost:8000`.

## API Endpoints
- **GET /api/users**: Fetch all users.
- **GET /api/user/:id**: Fetch a user by ID.
- **POST /api/user**: Create a new user.
- **PATCH /api/user/:id**: Update a user by ID.
- **DELETE /api/user/:id**: Delete a user by ID.
- **GET /search**: Search for users based on query parameters.

## Usage
- To add a user, fill out the form and submit.
- To edit a user, click the "Edit" button next to the user in the list.
- To delete a user, click the "Delete" button next to the user and confirm the action.
- Use the search bar to find users by name or email.

## Logging
All GET requests to the `/search` endpoint are logged in `log.txt` for monitoring purposes.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.