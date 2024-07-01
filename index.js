const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use("/users", userRoutes);

app.get('/', (req, res) => {
    res.send("Hello there!");
});

app.listen(3000, () => {
    console.log("[Server]: Running at port 3000!");
});
