# Email System

This project is the backend for an email client system. It provides APIs for user management, email management, and folder management.

## Features

- User registration and login
- Profile management
- Admin management of users
- Composing and sending emails to one or more recipients
- Sending emails to multiple recipients at once
- Saving drafts of emails for later editing
- Organizing emails into folders
- Marking emails as read or unread
- Flagging emails as important
- Moving emails to trash and recovering them
- Replying to emails and replying to all recipients
- Forwarding emails

## Setup

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/email-system.git
   cd email-system
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```plaintext
   PORT=3000
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=email-system
   DB_PASSWORD=123
   DB_PORT=5432
   JWT_SECRET=your_secret_key
   ```

4. Set up the PostgreSQL database:
   - Create a new database named `email-system`.
   - Run the SQL script to create the necessary tables:
     ```sh
     psql -U your_db_user -d email-system -f database.sql
     ```

### Running the Server

Start the server:
```sh
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### User Routes

1. **User Registration (Sign Up)**
   - **Endpoint:** `POST /signup`
   - **Request Body:**
     ```json
     {
       "firstName": "John",
       "secondName": "Doe",
       "username": "johndoe",
       "password": "password123"
     }
     ```

2. **User Login (Sign In)**
   - **Endpoint:** `POST /login`
   - **Request Body:**
     ```json
     {
       "email": "johndoe@swar.com",
       "password": "password123"
     }
     ```

3. **Get Profile**
   - **Endpoint:** `GET /profile`
   - **Headers:** `Authorization: Bearer <token>`

4. **Update Profile**
   - **Endpoint:** `PUT /profile`
   - **Headers:** `Authorization: Bearer <token>`
   - **Request Body:**
     ```json
     {
       "firstName": "Jane",
       "secondName": "Doe",
       "password": "newpassword123"
     }
     ```

5. **Get Users (Admin)**
   - **Endpoint:** `GET /admin/users`
   - **Headers:** `Authorization: Bearer <token>`

6. **Update User Details (Admin)**
   - **Endpoint:** `PUT /admin/users/:id`
   - **Headers:** `Authorization: Bearer <token>`
   - **Request Body:**
     ```json
     {
       "firstName": "Jane",
       "secondName": "Doe",
       "role": "user",
       "password": "newpassword123"
     }
     ```

7. **Update User Name (Admin)**
   - **Endpoint:** `PUT /admin/users/:id/name`
   - **Headers:** `Authorization: Bearer <token>`
   - **Request Body:**
     ```json
     {
       "firstName": "Jane",
       "secondName": "Doe"
     }
     ```

8. **Update User Role (Admin)**
   - **Endpoint:** `PUT /admin/users/:id/role`
   - **Headers:** `Authorization: Bearer <token>`
   - **Request Body:**
     ```json
     {
       "role": "admin"
     }
     ```

9. **Update User Password (Admin)**
   - **Endpoint:** `PUT /admin/users/:id/password`
   - **Headers:** `Authorization: Bearer <token>`
   - **Request Body:**
     ```json
     {
       "password": "newpassword123"
     }
     ```

10. **Delete User (Admin)**
    - **Endpoint:** `DELETE /admin/users/:id`
    - **Headers:** `Authorization: Bearer <token>`

### Email Routes

1. **Send Email**
   - **Endpoint:** `POST /send`
   - **Headers:** `Authorization: Bearer <token>`
   - **Request Body:**
     ```json
     {
       "receiverIds": [2],
       "subject": "Hello",
       "body": "This is a test email.",
       "cc": "cc@example.com"
     }
     ```

2. **Save Draft**
   - **Endpoint:** `POST /draft`
   - **Headers:** `Authorization: Bearer <token>`
   - **Request Body:**
     ```json
     {
       "receiverIds": [2],
       "subject": "Draft Subject",
       "body": "This is a draft email.",
       "cc": "cc@example.com"
     }
     ```

3. **Get Inbox Emails**
   - **Endpoint:** `GET /inbox`
   - **Headers:** `Authorization: Bearer <token>`

4. **Get Sent Emails**
   - **Endpoint:** `GET /sent`
   - **Headers:** `Authorization: Bearer <token>`

5. **Mark Email as Read**
   - **Endpoint:** `PUT /read/:id`
   - **Headers:** `Authorization: Bearer <token>`

6. **Mark Email as Unread**
   - **Endpoint:** `PUT /unread/:id`
   - **Headers:** `Authorization: Bearer <token>`

7. **Move Email to Trash**
   - **Endpoint:** `PUT /trash/:id`
   - **Headers:** `Authorization: Bearer <token>`

8. **Recover Email from Trash**
   - **Endpoint:** `PUT /recover/:id`
   - **Headers:** `Authorization: Bearer <token>`

9. **Get Trash Emails**
   - **Endpoint:** `GET /trash`
   - **Headers:** `Authorization: Bearer <token>`

10. **Move Email to Folder**
    - **Endpoint:** `PUT /move/:emailId/folder/:folderId`
    - **Headers:** `Authorization: Bearer <token>`

11. **Reply to Email**
    - **Endpoint:** `POST /reply/:id`
    - **Headers:** `Authorization: Bearer <token>`
    - **Request Body:**
      ```json
      {
        "body": "This is a reply."
      }
      ```

12. **Reply All to Email**
    - **Endpoint:** `POST /reply-all/:id`
    - **Headers:** `Authorization: Bearer <token>`
    - **Request Body:**
      ```json
      {
        "body": "This is a reply to all."
      }
      ```

13. **Forward Email**
    - **Endpoint:** `POST /forward/:id`
    - **Headers:** `Authorization: Bearer <token>`
    - **Request Body:**
      ```json
      {
        "receiverIds": [3],
        "body": "This is a forwarded email."
      }
      ```

14. **Flag Email as Important**
    - **Endpoint:** `PUT /important/:id`
    - **Headers:** `Authorization: Bearer <token>`

15. **Create Folder**
    - **Endpoint:** `POST /folders`
    - **Headers:** `Authorization: Bearer <token>`
    - **Request Body:**
      ```json
      {
        "name": "New Folder"
      }
      ```

16. **Rename Folder**
    - **Method:** `PUT`
    - **URL:** `http://localhost:<port>/folders/:id`
    - **Headers:**
      ```json
      {
        "Authorization": "Bearer <token>"
      }
      ```
    - **Body (JSON):**
      ```json
      {
        "newName": "Renamed Folder"
      }
      ```

17. **Delete Folder**
    - **Method:** `DELETE`
    - **URL:** `http://localhost:<port>/folders/:id`
    - **Headers:**
      ```json
      {
        "Authorization": "Bearer <token>"
      }
      ```

## Testing with Postman

1. **Open Postman**: Open the Postman application.
2. **Create a New Request**: Click on "New" and select "Request".
3. **Set the Request Method and URL**: Set the request method (GET, POST, PUT, DELETE) and enter the URL (e.g., `http://localhost:3000/signup`).
4. **Set Headers**: If the endpoint requires authentication, add the `Authorization` header with the value `Bearer <token>`.
5. **Set Request Body**: For POST and PUT requests, set the request body to the appropriate JSON format.
6. **Send the Request**: Click on "Send" to send the request and view the response.

By following these steps, you can test each API endpoint in Postman to ensure that all updates are working correctly.