const connectToMongo = require('./db');
const express = require('express')
connectToMongo();

const app = express()
var cors = require('cors')

 
app.use(cors())
const port = 5000

app.use(express.json());
//avalable routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})