const express = require('express');

const database = require('./models/mongoose');
const router = require('./routes/index');
const middleware = require('./middlewares/index');

// APP
const app = express();

// MIDDLEWARES
middleware(app);

// DB Setup
database();

// ROUTER
router(app);

// LISTEN
app.listen(process.env.PORT || 8081);
