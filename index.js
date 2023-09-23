const express = require('express')
require('dotenv').config()
const path = require('path')

//creating server app
const app = express()
const port = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hello from TRG App Backend!')
})


//for any static files, image, css, js
app.use('/static', express.static(path.join(__dirname, 'static')))

// starting server on port
app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})