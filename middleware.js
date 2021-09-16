const {ExpressError} = require("./expressError");
const {items} = require("./fakeDb");

// checks if req body has the required keys
function checkItemDataExists(req, res, next) {
    try {
        if (!req.body.name)
            throw new ExpressError("No item name given", 400);
        if (!req.body.price)
            throw new ExpressError("No item price given", 400);
        return next();
    } catch (err) {
        return next(err);
    }
}

// checks if item exists with req param name
function checkItemNameExists(req, res, next) {
    try {
        const {name} = req.params;
        if (items.every(i => i.name !== name))
            throw new ExpressError(`No item named ${name} exists`, 400);
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {checkItemDataExists, checkItemNameExists};
