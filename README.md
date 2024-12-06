# Email Client Backend

This is the backend for an email client system built with Node.js, Express, and PostgreSQL. It provides APIs for user authentication, email management, and folder management.

## Features

- User registration and login
- JWT-based authentication
- Admin-specific routes for user management
- Email sending, receiving, and management
- Folder creation, renaming, and deletion
- Error handling for JSON parsing

## Technologies Used

- Node.js
- Express
- PostgreSQL
- JWT (JSON Web Token)
- bcrypt.js (for password hashing)
- dotenv (for environment variables)

## Getting Started

### Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running
- Mosquitto MQTT broker (optional, if using MQTT)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/email-client-backend.git
   cd email-client-backend
   ```

## API Endpoints

### User Routes

1. **User Registration (Sign Up)**
   - `POST /signup`

2. **User Login (Sign In)**
   - `POST /login`

3. **Get Users (Admin)**
   - `GET /admin/users`

4. **Update User Details (Admin)**
   - `PUT /admin/users/:id`

5. **Update User Name (Admin)**
   - `PUT /admin/users/:id/name`

6. **Update User Role (Admin)**
   - `PUT /admin/users/:id/role`

7. **Update User Password (Admin)**
   - `PUT /admin/users/:id/password`

8. **Delete User (Admin)**
   - `DELETE /admin/users/:id`

9. **Update Profile**
   - `PUT /profile`

10. **Get Profile**
    - `GET /profile`

### Email Routes

1. **Send Email**
   - `POST /send`

2. **Get Inbox Emails**
   - `GET /inbox`

3. **Get Sent Emails**
   - `GET /sent`

4. **Mark Email as Read**
   - `PUT /read/:id`

5. **Move Email to Trash**
   - `PUT /trash/:id`

6. **Recover Email**
   - `PUT /recover/:id`

7. **Get Trash Emails**
   - `GET /trash`

8. **Move Email to Folder**
   - `PUT /move/:emailId/folder/:folderId`

9. **Reply to Email**
   - `POST /reply/:id`

10. **Reply All to Email**
    - `POST /reply-all/:id`

11. **Create Folder**
    - `POST /folders`

12. **Rename Folder**
    - `PUT /folders/:id`

13. **Delete Folder**
    - `DELETE /folders/:id`

## Testing API in Postman

### User Routes

1. **User Registration (Sign Up)**
   - **Method:** `POST`
   - **URL:** `http://localhost:<port>/signup`
   - **Body (JSON):**
     ```json
     {
       "firstName": "John",
       "secondName": "Doe",
       "username": "johndoe",
       "password": "password123"
     }
     ```

2. **User Login (Sign In)**
   - **Method:** `POST`
   - **URL:** `http://localhost:<port>/login`
   - **Body (JSON):**
     ```json
     {
       "email": "johndoe@swar.com",
       "password": "password123"
     }
     ```

3. **Get Users (Admin)**
   - **Method:** `GET`
   - **URL:** `http://localhost:<port>/admin/users`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

4. **Update User Details (Admin)**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/admin/users/:id`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```
   - **Body (JSON):**
     ```json
     {
       "firstName": "Jane",
       "secondName": "Doe",
       "role": "admin"
     }
     ```

5. **Update User Name (Admin)**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/admin/users/:id/name`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```
   - **Body (JSON):**
     ```json
     {
       "firstName": "Jane",
       "secondName": "Doe"
     }
     ```

6. **Update User Role (Admin)**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/admin/users/:id/role`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```
   - **Body (JSON):**
     ```json
     {
       "role": "admin"
     }
     ```

7. **Update User Password (Admin)**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/admin/users/:id/password`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```
   - **Body (JSON):**
     ```json
     {
       "password": "newpassword123"
     }
     ```

8. **Delete User (Admin)**
   - **Method:** `DELETE`
   - **URL:** `http://localhost:<port>/admin/users/:id`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

9. **Update Profile**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/profile`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```
   - **Body (JSON):**
     ```json
     {
       "firstName": "John",
       "secondName": "Doe",
       "password": "newpassword123"
     }
     ```

10. **Get Profile**
    - **Method:** `GET`
    - **URL:** `http://localhost:<port>/profile`
    - **Headers:**
      ```json
      {
        "Authorization": "Bearer <token>"
      }
      ```

### Email Routes

1. **Send Email**
   - **Method:** `POST`
   - **URL:** `http://localhost:<port>/send`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```
   - **Body (JSON):**
     ```json
     {
       "receiverIds": [2],
       "subject": "Hello",
       "body": "This is a test email.",
       "cc": "cc@example.com"
     }
     ```

2. **Get Inbox Emails**
   - **Method:** `GET`
   - **URL:** `http://localhost:<port>/inbox`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

3. **Get Sent Emails**
   - **Method:** `GET`
   - **URL:** `http://localhost:<port>/sent`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

4. **Mark Email as Read**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/read/:id`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

5. **Move Email to Trash**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/trash/:id`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

6. **Recover Email**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/recover/:id`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

7. **Get Trash Emails**
   - **Method:** `GET`
   - **URL:** `http://localhost:<port>/trash`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

8. **Move Email to Folder**
   - **Method:** `PUT`
   - **URL:** `http://localhost:<port>/move/:emailId/folder/:folderId`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```

9. **Reply to Email**
   - **Method:** `POST`
   - **URL:** `http://localhost:<port>/reply/:id`
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <token>"
     }
     ```
   - **Body (JSON):**
     ```json
     {
       "body": "This is a reply."
     }
     ```

10. **Reply All to Email**
    - **Method:** `POST`
    - **URL:** `http://localhost:<port>/reply-all/:id`
    - **Headers:**
      ```json
      {
        "Authorization": "Bearer <token>"
      }
      ```
    - **Body (JSON):**
      ```json
      {
        "body": "This is a reply to all."
      }
      ```

11. **Create Folder**
    - **Method:** `POST`
    - **URL:** `http://localhost:<port>/folders`
    - **Headers:**
      ```json
      {
        "Authorization": "Bearer <token>"
      }
      ```
    - **Body (JSON):**
      ```json
      {
        "name": "New Folder"
      }
      ```

12. **Rename Folder**
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

13. **Delete Folder**
    - **Method:** `DELETE`
    - **URL:** `http://localhost:<port>/folders/:id`
    - **Headers:**
      ```json
      {
        "Authorization": "Bearer <token>"
      }
      ```