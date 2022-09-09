require('dotenv').config();
require('express-async-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 5000

const boardRouter = require('./routes/boardRoutes');

const { notFound, globalErrorHandler } = require('./middleware/errorHandling');
const corsOptions = require('./config/corsOptions');
const connectToDB = require('./config/dbConnection');
const { default: mongoose } = require('mongoose');

connectToDB();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));

app.get('/', (req, res) => res.json({ message: "Welcome to the Kanban API"}))

app.use('/api/boards', boardRouter)

app.use(notFound);
app.use(globalErrorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})

mongoose.connection.on('error', err => {
    console.log(err)
})
