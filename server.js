require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

//creating server app
const app = express();
app.use(cookieParser());

const port = process.env.PORT || 3000
// enabling cors
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3001', 'http://localhost:3000'] // Adjust to match your client's origin
}));

// connecting to db
require('./db/connection')

//converting any json response to object
app.use(express.json());

// For saving resumes
app.use("/files", express.static("files"));

// home route... just to test
app.get('/', (req, res) => {
  return res.send({msg:"Hello from Trg Backend!"})
})

// routers
app.use("/api", require("./routes/commonRoutes"))
app.use("/payment", require("./routes/paymentRoutes"))

//serving static files
app.use('/static', express.static(path.join(__dirname, 'static')))

// starting server on port
app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

