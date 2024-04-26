process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");

let cheese = { name: "cheese", price: "3.35" };

beforeEach(function () {
  items.push(cheese);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ name: "cheese", price: "3.35" }]);
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${cheese.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ name: "cheese", price: "3.35" });
  });
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/bread`);
    expect(res.statusCode).toBe(404);
  });
});

describe("POST /items", () => {
  test("Adds a new item", async () => {
    const res = await request(app)
      .post("/items")
      .send({ name: "bread", price: "1.99" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ added: { name: "bread", price: "1.99" } });
    expect(items).toContainEqual({ name: "bread", price: "1.99" }); // Additional check to confirm item was added
  });
});

describe("PATCH /items/:name", () => {
  test("Updates an item", async () => {
    const res = await request(app)
      .patch("/items/cheese")
      .send({ name: "blue cheese", price: "4.00" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: { name: "blue cheese", price: "4.00" },
    });
  });

  test("Responds with 404 for updating non-existing item", async () => {
    const res = await request(app)
      .patch("/items/butter")
      .send({ name: "butter", price: "0.99" });
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /items/:name", () => {
  test("Deletes an item", async () => {
    const res = await request(app).delete(`/items/${cheese.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: `Deleted: ${cheese.name}` });
    expect(items).not.toContainEqual({ name: "cheese", price: "3.35" });
  });

  test("Responds with 404 for deleting non-existing item", async () => {
    const res = await request(app).delete("/items/butter");
    expect(res.statusCode).toBe(404);
  });
});
