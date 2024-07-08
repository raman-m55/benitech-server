import express from 'express';
import dotenv from 'dotenv';
import dbConnect from '../config/dbConnect';
import { authControllers } from './auth';
import cors from 'cors';
import { usersControllers } from './users';
import { currentUserMiddleware } from '../middlewares';
import cookieParser from 'cookie-parser'; // Importing cookie-parser
import { productController } from './products';
import morgan from 'morgan';
import { categoryControllers } from './category';
import { blogControllers } from './blog';

const PORT = process.env.PORT || 3000;

//config
const app = express();
dotenv.config();
dbConnect();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Enable set cookie
  allowedHeaders: 'Content-Type,Authorization',
};

//middleware
app.use(cors(corsOptions));
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
app.use('/api/categories', categoryControllers);
app.use('/api/blogs', blogControllers);

//start server
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
