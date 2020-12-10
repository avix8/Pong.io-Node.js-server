const express = require('express')
const app = express()
// const bodyParser = require("body-parser");
const cors = require('cors')
// const morgan = require("morgan")

// const avatarRoutes = require("./api/avatars");

// app.use(morgan('dev'))

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(cors())

// app.use('/uploads', express.static('uploads'))
// app.use("/avatar", avatarRoutes);

module.exports = app
