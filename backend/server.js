const path = require('path')
const express = require('express')
const colors = require('colors')

// This will look for .env in backend first, then root
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')

const port = process.env.PORT || 5000



connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`server started on ${port}`))
