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

