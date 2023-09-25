require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path')

//creating server app
const app = express()
const port = process.env.PORT || 3000

// connecting to db
require('./db/connection')

// enabling cors
app.use(cors());
//converting any json response to object
app.use(express.json());

// home route... just to test
app.get('/', (req, res) => {
  res.send('Hello from TRG App Backend!')
})

// routers
app.use("/api", require("./routes/commonRoutes"))


//serving static files
app.use('/static', express.static(path.join(__dirname, 'static')))

// starting server on port
app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})

