import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import dbConnect from '../config/dbConnect';
import { authControllers } from './auth';
import cors from 'cors';
import { usersControllers } from './users';
import { currentUserMiddleware } from '../middlewares';
import cookieParser from 'cookie-parser'; // Importing cookie-parser
import { productController } from './products';
import morgan from 'morgan';

const PORT = process.env.PORT || 3000;

//config
const app = express();
dotenv.config();
dbConnect();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

//Middleware to check the jwt token. Add user information to requests
app.use(currentUserMiddleware);

//routes
app.use('/api/auth', authControllers);
app.use('/api/users', usersControllers);
app.use('/api/products', productController);

//start server
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
