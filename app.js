import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bcrypt from 'bcrypt';
import { router } from './routes.js';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT;
app.use(router);
app.use(express.json());

// DB/API Connection
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017')
.then(() => {
    console.log('DB Connected');
    app.listen(PORT, () => {
        console.log(`API run on port: ${PORT}`);
    });
})
.catch((err) => console.log(err));


