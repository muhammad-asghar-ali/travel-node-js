import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { connect } from './db.js'
import userRoutes from './routes/user.route.js'
import pinRoutes from './routes/pin.route.js'

dotenv.config()
const app = express()

app.use(morgan("tiny"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

connect()

app.use('/api/users', userRoutes)
app.use('/api/pins', pinRoutes)

app.use((err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Internal server error"
    const stack = process.env.NODE_ENV === "dev" ? err.stack : null

    res.status(status).json({
        message,
        stack
    })
})

const port = process.env.PORT || 4001

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})