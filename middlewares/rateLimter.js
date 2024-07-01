const { createClient } = require("redis");

const rateLimiter = (options) => {
    const { windowSizeInSeconds, maxRequests } = options;
    const client = createClient();

    client.on("error", (err) => {
        console.error("[Redis]: ", err);
    });

    let isConnected = false;
    const connectClient = async () => {
        if (!isConnected) {
            await client.connect();
            isConnected = true;
        };
    };

    return async (req, res, next) => {
        await connectClient();

        const userIp = req.ip;
        const path = req.route.path;
        const combinedKeys = `${userIp}:${path}`;

        try {
            const pipeline = client.multi();
            pipeline.incr(combinedKeys);
            pipeline.expire(combinedKeys, windowSizeInSeconds);
            const replies = await pipeline.exec();

            const requestCount = replies[0];
            if (requestCount > maxRequests) {
                res
                    .status(429)
                    .send(`
                        Rate limit exceeded. Try again in ${windowSizeInSeconds} seconds
                    `);
            } else {
                next();
            };
        } catch (error) {
            console.error("[Redis]: Error in middleware", error);
            res.status(500).send("Server error");
        };
    };
};

module.exports = rateLimiter;
