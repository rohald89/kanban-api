require('dotenv').config();
require('express-async-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const boardRouter = require('./routes/boardRoutes');
const columnRouter = require('./routes/columnRoutes');
const taskRouter = require('./routes/taskRoutes');

const { notFound, globalErrorHandler } = require('./middleware/errorHandling');
const corsOptions = require('./config/corsOptions');
const connectToDB = require('./config/dbConnection');

connectToDB();

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/boards', boardRouter)
app.use('/api/columns', columnRouter)
app.use('/api/tasks', taskRouter)

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
