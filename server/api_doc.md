Bookstore API Documentation
Endpoints

List of available endpoints:

Authentication

POST /register
POST /login
POST /google-login
Authenticated Routes

GET /books
POST /books
PUT /books/:id
GET /books/:id
DELETE /books/:id
GET /genres
GET /orders
PATCH /orders/:id
POST /orders
 

1. POST /register

Description:

Register a new user
Request:

body:

{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "gender": "string",
  "address": "string"
}
Response (201 - Created):


{
  "fullName": "string",
  "email": "string",
  "phoneNumber": "string",
  "gender": "string",
  "address": "string"
}
Response (400 - Bad Request):


{
  "message": "Validation errors"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

2. POST /login

Description:

Login into the system and get an access token
Request:

body:

{
  "email": "string",
  "password": "string"
}
Response (200 - OK):


{
  "access_token": "string",
  "UserId": "number",
  "role": "string"
}
Response (400 - Bad Request):


{
  "message": "Email is required!"
}
OR
{
  "message": "Password is required!"
}
Response (401 - Unauthorized):


{
  "message": "Email/Password is invalid!"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

3. POST /google-login

Description:

Login using Google account
Request:

body:

{
  "googleToken": "string"
}
Response (200 - OK):


{
  "access_token": "string",
  "user": {
    "fullName": "string",
    "role": "string"
  }
}
Response (400 - Bad Request):


{
  "message": "Google Token is required"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

4. GET /books (Authenticated)

Description:

Get all books with recommendations based on order history
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
Response (200 - OK):


{
  "books": [
    {
      "id": 1,
      "name": "string",
      "description": "string",
      "price": 0,
      "imgUrl": "string",
      "stock": 0,
      "GenreId": 0,
      "Genre": {
        "id": 0,
        "name": "string"
      }
    }
  ],
  "result": [
    {
      "name": "string",
      "description": "string",
      "price": 0,
      "imgUrl": "string",
      "stock": 0,
      "GenreId": 0
    }
  ]
}
Response (401 - Unauthorized):


{
  "message": "Invalid token"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

5. POST /books (Authenticated)

Description:

Create a new book
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
body:

{
  "name": "string",
  "description": "string",
  "price": 0,
  "imgUrl": "string",
  "stock": 0,
  "GenreId": 0
}
Response (201 - Created):


{
  "id": 0,
  "name": "string",
  "description": "string",
  "price": 0,
  "imgUrl": "string",
  "stock": 0,
  "GenreId": 0
}
Response (401 - Unauthorized):


{
  "message": "Invalid token"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

6. PUT /books/:id (Authenticated)

Description:

Update a book by ID
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
params:

{
  "id": "number (required)"
}
body:

{
  "name": "string",
  "description": "string",
  "price": 0,
  "imgUrl": "string",
  "stock": 0,
  "GenreId": 0
}
Response (200 - OK):


{
  "id": 0,
  "name": "string",
  "description": "string",
  "price": 0,
  "imgUrl": "string",
  "stock": 0,
  "GenreId": 0
}
Response (404 - Not Found):


{
  "message": "Book not found!"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

7. GET /books/:id (Authenticated)

Description:

Get book details by ID
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
params:

{
  "id": "number (required)"
}
Response (200 - OK):


{
  "id": 0,
  "name": "string",
  "description": "string",
  "price": 0,
  "imgUrl": "string",
  "stock": 0,
  "GenreId": 0,
  "Genre": {
    "id": 0,
    "name": "string"
  }
}
Response (404 - Not Found):


{
  "message": "Book not found!"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

8. DELETE /books/:id (Authenticated)

Description:

Delete a book by ID
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
params:

{
  "id": "number (required)"
}
Response (200 - OK):


{
  "message": "<book_name> success deleted"
}
Response (404 - Not Found):


{
  "message": "Book not found!"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

9. GET /genres (Authenticated)

Description:

Get all genres
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
Response (200 - OK):


[
  {
    "id": 0,
    "name": "string"
  }
]
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

10. POST /orders (Authenticated)

Description:

Create a new order
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
body:

{
  "totalAmount": 0,
  "orderItems": [
    {
      "quantity": 0,
      "unitPrice": 0,
      "BookId": 0
    }
  ]
}
Response (201 - Created):


{
  "message": "Create order success!",
  "midtransToken": "string",
  "order": {
    "id": 0,
    "codeOrder": "string",
    "totalAmount": 0,
    "UserId": 0,
    "midtransToken": "string"
  }
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

11. PATCH /orders/:id (Authenticated)

Description:

Update order payment status
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
params:

{
  "id": "number (required)"
}
Response (200 - OK):


{
  "message": "Payment status updated successfully"
}
Response (404 - Not Found):


{
  "message": "Order not found!"
}
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}

12. GET /orders (Authenticated)

Description:

Get all user's orders
Request:

headers:

{
  "Authorization": "Bearer <access_token>"
}
Response (200 - OK):


[
  {
    "id": 0,
    "codeOrder": "string",
    "totalAmount": 0,
    "UserId": 0,
    "paymentStatus": "string",
    "midtransToken": "string"
  }
]
Response (500 - Internal Server Error):


{
  "message": "Internal Server Error"
}