process.env.NODE_ENV = "test";

const request = require("supertest");

const {app} = require("../app");
const {items} = require("../fakeDb");

const candy = {name: "candy", price: 1.42};

beforeEach(() => {
    items.push(candy);
});

afterEach(() => {
    items.length = 0;
});

describe("get items", () => {
    test("all items", async () => {
        const resp = await request(app).get("/items");

        expect(resp.statusCode).toBe(200);
        expect(resp.body[0]).toEqual(expect.objectContaining({
            name: candy.name, price: candy.price
        }));
    });

    test("named item", async () => {
        const resp = await request(app).get(`/items/${candy.name}`);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            name: candy.name, price: candy.price
        }));
    });

    test("invalid item name", async () => {
        const resp = await request(app).get("/items/askgljag");

        expect(resp.statusCode).toBe(400);
    });
});

describe("post item", () => {
    test("add new item", async () => {
        const data = {name: "eggs", price: 1.29};
        const resp = await request(app).post("/items").send(data);

        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual(expect.objectContaining({
            added: expect.objectContaining({name: data.name, price: data.price})
        }));
    });

    test("missing item data", async () => {
        const resp = await request(app).post("/items");

        expect(resp.statusCode).toBe(400);
    });
});

describe("patch item", () => {
    test("update item", async () => {
        const data = {name: "eggs", price: 1.29};
        const resp = await request(app).patch(`/items/${candy.name}`).send(data);

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            updated: expect.objectContaining({name: data.name, price: data.price})
        }));
    });

    test("missing item data", async () => {
        const resp = await request(app).patch(`/items/${candy.name}`);

        expect(resp.statusCode).toBe(400);
    });

    test("invalid item name", async () => {
        const resp = await request(app).patch("/items/aksgjs");

        expect(resp.statusCode).toBe(400);
    });
});

describe("delete item", () => {
    test("removes item", async () => {
        const resp = await request(app).delete(`/items/${candy.name}`);

        expect(resp.statusCode).toBe(200);
        expect(items.length).toBe(0);
    });

    test("invalid item name", async () => {
        const resp = await request(app).delete("/items/aksgjs");

        expect(resp.statusCode).toBe(400);
    });
});
