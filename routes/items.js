const express = require("express");

const {items} = require("../fakeDb");
const middleware = require("../middleware");

const router = new express.Router();

// get all items
router.get("/", (req, res, next) => {
    try {
        return res.status(200).json(items);
    } catch (err) {
        return next(err);
    }
});

// get an item by name
router.get("/:name", middleware.checkItemNameExists, (req, res, next) => {
    try {
        const {name} = req.params;
        const item = items.find(i => i.name === name);
        return res.status(200).json(item);
    } catch (err) {
        return next(err);
    }
});

// update an item
router.patch("/:name", [middleware.checkItemDataExists, middleware.checkItemNameExists], (req, res, next) => {
    try {
        const item = items.find(i => i.name === req.params.name);
        const {name, price} = req.body;
        item.name = name; item.price = price;
        return res.status(200).json({updated: {name, price}});
    } catch (err) {
        return next(err);
    }
});

// delete an item
router.delete("/:name", middleware.checkItemNameExists, (req, res, next) => {
    try {
        const {name} = req.params;
        const idx = items.indexOf(i => i.name === name);
        items.splice(idx, 1);
        return res.status(200).json({message: "Deleted"});
    } catch (err) {
        return next(err);
    }
});

// add a new item
router.post("/", middleware.checkItemDataExists, (req, res, next) => {
    try {
        const {name, price} = req.body;
        items.push({name, price});
        return res.status(201).json({added: {name, price}});
    } catch (err) {
        return next(err);
    }
});

module.exports = {itemRoutes: router};
