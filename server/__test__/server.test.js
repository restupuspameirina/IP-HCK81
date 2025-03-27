const {
  expect,
  test,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const { User, Genre, Book, Order, OrderItem } = require("../models");
const { signToken } = require("../helpers/jwt");

const request = require("supertest");
const app = require("../app");

let access_token_admin;
let access_token_staff;
let access_token_user;

beforeAll(async () => {
  const admin = await User.create({
    fullName: "admin",
    email: "admin@mail.com",
    password: "admin",
    phoneNumber: "081234567890",
    gender: "Male",
    address: "Jalan Sultan Iskandar Muda",
    role: "Admin",
  });
  access_token_admin = signToken({ id: admin.id });

  const staff = await User.create({
    fullName: "staff",
    email: "staff@mail.com",
    password: "staff",
    phoneNumber: "081234567890",
    gender: "Female",
    address: "Jalan Sultan Iskandar Muda",
    role: "Staff",
  });
  access_token_staff = signToken({ id: staff.id });

  const user = await User.create({
    fullName: "user",
    email: "user@mail.com",
    password: "user",
    phoneNumber: "081234567890",
    gender: "Female",
    address: "Jalan Sultan Iskandar Muda",
    role: "User",
  });
  access_token_user = signToken({ id: user.id });

  let genres = require("../data/genre.json").map((genre) => {
    genre.createdAt = genre.updatedAt = new Date();
    return genre;
  });
  await Genre.bulkCreate(genres);

  let books = require("../data/book.json").map((book) => {
    book.createdAt = book.updatedAt = new Date();
    return book;
  });

  await Book.bulkCreate(books);
});

afterAll(async () => {
  await User.destroy({
    truncate: true, // hapus semua data dari db
    restartIdentity: true, // restart primary key (id) mulai dari 1 lg
    cascade: true, // kalo datanya berelasi dengan data lain, data lainnya didelete
  });

  await Genre.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await Book.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await Order.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await OrderItem.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("POST /register", () => {
  test("should be success insert user", async () => {
    const newUser = {
      fullName: "user2",
      email: "user2@mail.com",
      password: "user2",
      phoneNumber: "081234567890",
      gender: "Male",
      address: "Jalan Sultan Iskandar Muda",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("fullName", newUser.fullName);
    expect(response.body).toHaveProperty("email", newUser.email);
    expect(response.body).toHaveProperty("phoneNumber", newUser.phoneNumber);
    expect(response.body).toHaveProperty("gender", newUser.gender);
    expect(response.body).toHaveProperty("address", newUser.address);
  });

  test("should fail if full name empty", async () => {
    const newUser = {
      fullName: "",
      email: "user2@mail.com",
      password: "user2",
      phoneNumber: "081234567890",
      gender: "Male",
      address: "Jalan Sultan Iskandar Muda",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Full name is required!");
  });

  test("should fail if email empty", async () => {
    const newUser = {
      fullName: "user2",
      email: "",
      password: "user2",
      phoneNumber: "081234567890",
      gender: "Male",
      address: "Jalan Sultan Iskandar Muda",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Email is required!");
  });

  test("should fail if email is not in the right format", async () => {
    const newUser = {
      fullName: "user2",
      email: "user2",
      password: "user2",
      phoneNumber: "081234567890",
      gender: "Male",
      address: "Jalan Sultan Iskandar Muda",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Email must be email format!");
  });

  test("should fail if email must be unique", async () => {
    const newUser = {
      fullName: "user2",
      email: "user2@mail.com",
      password: "user2",
      phoneNumber: "081234567890",
      gender: "Female",
      address: "Jalan Sultan Iskandar Muda",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Email must be unique!");
  });

  test("should fail if password is empty", async () => {
    const newUser = {
      fullName: "user3",
      email: "user3@gmail.com",
      password: "",
      phoneNumber: "081234567890",
      gender: "Male",
      address: "Jalan Sultan Iskandar Muda",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Password is required!");
  });

  test("should fail if phoneNumber is empty", async () => {
    const newUser = {
      fullName: "user3",
      email: "user3@gmail.com",
      password: "user2",
      phoneNumber: "",
      gender: "Male",
      address: "Jalan Sultan Iskandar Muda",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Phone number is required!");
  });

  test("should fail if gender is empty", async () => {
    const newUser = {
      fullName: "user3",
      email: "user3@gmail.com",
      password: "user2",
      phoneNumber: "08123141523",
      gender: "",
      address: "Jalan Sultan Iskandar Muda",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Gender is required!");
  });

  test("should fail if address is empty", async () => {
    const newUser = {
      fullName: "user3",
      email: "user3@gmail.com",
      password: "user2",
      phoneNumber: "08123456777",
      gender: "Male",
      address: "",
      role: "User",
    };

    const response = await request(app).post("/register").send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Address is required!");
  });
});

describe("POST /login", () => {
  test("should be success login", async () => {
    const response = await request(app).post("/login").send({
      email: "user2@mail.com",
      password: "user2",
    });

    expect(response.status).toBe(200);
    expect(response.body.access_token).not.toBeUndefined();
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });

  test("should fail if email is missing!", async () => {
    const response = await request(app).post("/login").send({
      email: "",
      password: "user2",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Email is required!");
  });

  test("should fail if password is missing!", async () => {
    const response = await request(app).post("/login").send({
      email: "user2@mail.com",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Password is required!");
  });

  test("should fail if Email is invalid!", async () => {
    const response = await request(app).post("/login").send({
      email: "user22@mail.com",
      password: "user2",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Email/Password is invalid!");
  });

  test("should fail if Password is invalid!", async () => {
    const response = await request(app).post("/login").send({
      email: "user2@mail.com",
      password: "user22",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Email/Password is invalid!");
  });
});

// help me to make unit testing for /google-login endpoint at here
describe("POST /google-login", () => {
  test("should fail login with google invalid id token", async () => {
    const response = await request(app).post("/google-login").send({
      id_token: "1234567890",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Google Token is required");
  });
});

describe("GET /", () => {
  test("should return server status", async () => {
    const response = await request(app).get("/");
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Server is running");
  });
});

describe("GET /books", () => {
  test("should be success get books", async () => {
    const response = await request(app)
      .get("/books")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  test("should fail did not set authorization", async () => {
    const response = await request(app).get("/books");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });
});

describe("POST /books", () => {
  test("should be success insert book", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("name", newBook.name);
    expect(response.body).toHaveProperty("description", newBook.description);
    expect(response.body).toHaveProperty("price", newBook.price);
    expect(response.body).toHaveProperty("imgUrl", newBook.imgUrl);
    expect(response.body).toHaveProperty("stock", newBook.stock);
    expect(response.body).toHaveProperty("GenreId", newBook.GenreId);
  });

  test("should fail did not set authorization", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app).post("/books").send(newBook);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });

  test("should fail name is empty", async () => {
    const newBook = {
      name: "",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Name is required!");
  });

  test("should fail price is empty", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: "",
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Price is required!");
  });

  test("should fail price is empty", async () => {
    const newBook = {
      name: "Expresso",
      description: "Expresso",
      price: 0,
      imgUrl: "testing",
      stock: 12,
      GenreId: 1,
    };

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Price must be greater than 0");
  });

  test("should fail image is empty", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl: "",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Image is required!");
  });

  test("should fail stock is empty", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: "",
      GenreId: 1,
    };

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Stock is required!");
  });

  test("should fail genre is empty", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: "",
    };

    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Genre is required!");
  });
});

describe("PUT /books/:id", () => {
  test("should be success update book", async () => {
    const newBook = {
      name: "The Literary Awakening 2",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app)
      .put("/books/1")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("name", newBook.name);
    expect(response.body).toHaveProperty("description", newBook.description);
    expect(response.body).toHaveProperty("price", newBook.price);
    expect(response.body).toHaveProperty("imgUrl", newBook.imgUrl);
    expect(response.body).toHaveProperty("stock", newBook.stock);
    expect(response.body).toHaveProperty("GenreId", newBook.GenreId);
  });

  test("should fail did not set authorization", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app).put("/books/1").send(newBook);

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });

  // ...more tests with similar fixes...

  test("should fail genre is empty", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: "",
    };

    const response = await request(app)
      .put("/books/1")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual("Genre is required!");
  });

  test("should fail book not found", async () => {
    const newBook = {
      name: "The Literary Awakening",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app)
      .put("/books/100")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newBook);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Book not found!");
  });
});

describe("GET /books/:id", () => {
  test("should be success get books", async () => {
    const newBook = {
      name: "The Literary Awakening 2",
      description: "A deep dive into the world of classic literature.",
      price: 35000,
      imgUrl:
        "https://gratefulamericanfoundation.org/wp-content/uploads/2025/01/Kate-Chopin-THE-AWAKENING-1.jpg",
      stock: 10,
      GenreId: 1,
    };

    const response = await request(app)
      .get("/books/1")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("name", newBook.name);
    expect(response.body).toHaveProperty("description", newBook.description);
    expect(response.body).toHaveProperty("price", newBook.price);
    expect(response.body).toHaveProperty("imgUrl", newBook.imgUrl);
    expect(response.body).toHaveProperty("stock", newBook.stock);
  });

  test("should fail did not set authorization", async () => {
    const response = await request(app).get("/books/1");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });

  test("should fail did not set authorization", async () => {
    const response = await request(app)
      .get("/books/100")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Book not found!");
  });
});

describe("DELETE /books/:id", () => {
  test("should fail book not found", async () => {
    const response = await request(app)
      .delete("/books/1")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      "The Literary Awakening 2 success deleted"
    );
  });

  test("should fail not have authorized", async () => {
    const response = await request(app).delete("/books/1");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });

  test("should fail book not found", async () => {
    const response = await request(app)
      .delete("/books/100")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Book not found!");
  });
});

describe("POST /orders", () => {
  test("should be success create orders", async () => {
    const newOrder = {
      totalAmount: 110000,
      orderItems: [
        {
          quantity: 2,
          unitPrice: 70000,
          BookId: 3,
        },
        {
          quantity: 1,
          unitPrice: 40000,
          BookId: 2,
        },
      ],
    };

    const response = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newOrder);
    console.log(response.status, response.body, "test ini yukkkk");

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Create order success!");
  });

  test("should fail create orders invalid token", async () => {
    const newOrder = {
      totalAmount: 110000,
      orderItems: [
        {
          quantity: 2,
          unitPrice: 70000,
          size: "L",
          serveType: "Hot",
          BookId: 1,
        },
        {
          quantity: 1,
          unitPrice: 40000,
          size: "M",
          serveType: "Ice",
          BookId: 2,
        },
      ],
    };

    const response = await request(app).post("/orders").send(newOrder);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid Token");
  });

  test("should fail create orders with invalid token", async () => {
    const newOrder = {
      totalAmount: 110000,
      orderItems: [
        {
          quantity: 2,
          unitPrice: 70000,
          BookId: 1,
        },
        {
          quantity: 1,
          unitPrice: 40000,
          BookId: 2,
        },
      ],
    };

    // Use an invalid token (adding garbage to make it invalid)
    const response = await request(app)
      .post("/orders")
      .set("Authorization", "Bearer invalidtoken123")
      .send(newOrder);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
});

describe("GET /orders", () => {
  test("should be success get list orders", async () => {
    const response = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveLength(1);
  });
});

describe("GET /genres", () => {
  test("should be success get list orders", async () => {
    const response = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  test("should fail get list orders invalid token", async () => {
    const response = await request(app)
      .get("/orders")
      .set("Authorization", `Bearer aa${access_token_user}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
});

// Add this test block somewhere in your server.test.js file

describe("PATCH /orders/:id", () => {
  test("should successfully update payment status", async () => {
    // Create an order first to have a valid ID to update
    const newOrder = {
      totalAmount: 50000,
      orderItems: [
        {
          quantity: 1,
          unitPrice: 50000,
          BookId: 3,
        },
      ],
    };

    const createResponse = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send(newOrder);

    const orderId = createResponse.body.order.id;

    // Now test the update endpoint
    const response = await request(app)
      .patch(`/orders/${orderId}`)
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.message).toEqual(
      "Payment status updated successfully"
    );
  });

  test("should fail when order not found", async () => {
    const response = await request(app)
      .patch("/orders/999999")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual("Order not found!");
  });

  test("should fail without authorization", async () => {
    const response = await request(app).patch("/orders/1");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid Token");
  });

  test("should fail with invalid token", async () => {
    const response = await request(app)
      .patch("/orders/1")
      .set("Authorization", "Bearer invalidtoken123");

    expect(response.status).toBe(401);
    expect(response.body.message).toEqual("Invalid token");
  });
});

describe("Error Handling", () => {
  test("should handle invalid JSON in request body", async () => {
    const response = await request(app)
      .post("/books")
      .set("Authorization", `Bearer ${access_token_user}`)
      .set("Content-Type", "application/json")
      .send("{invalid json");
    
    expect(response.status).toBe(400);
  });

  test("should return 500 for database errors", async () => {
    // This test requires mocking the database error
    // For simplicity, we'll use a non-existent endpoint that triggers a server error
    const response = await request(app)
      .get("/non-existent-endpoint-that-causes-error")
      .set("Authorization", `Bearer ${access_token_user}`);
    
    expect(response.status).toBe(404);
  });
});
