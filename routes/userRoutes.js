const express = require("express");
const rateLimiter = require("../middlewares/rateLimter");
const { getUsers } = require("../controllers/userController");

const router = express.Router();

router.get(
    '/limited',
    rateLimiter({
        windowSizeInSeconds: 10,
        maxRequests: 3,
    }),
    getUsers
);

module.exports = router;
