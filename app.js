const express = require("express");
const path = require("path");

const {ExpressError} = require("./expressError");
const {itemRoutes} = require("./routes/items");

const app = express();

// parse the req body into JSON
app.use(express.json());

// serve static content
app.use(express.static("pages"));

app.use("/items", itemRoutes);

// home page
app.get("/", (req, res, next) => {
    try {
        return res.sendFile(path.join(__dirname, "index.html"));
    } catch (err) {
        return next(err);
    }
});

// handle 404 errors
app.use((req, res, next) => {
    const notFoundErr = new ExpressError("Not Found", 404);
    return next(notFoundErr);
});

// handle express errors
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong :'(";

    return res.status(status).json({
        error: { message, status }
    });
});

module.exports = { app };
