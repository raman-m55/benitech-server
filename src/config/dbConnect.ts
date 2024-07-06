import mongoose from 'mongoose';

const dbConnect = () => {
  const mongodbUrl = process.env.MONGODB_URI;

  if (!mongodbUrl) {
    throw new Error('MONGODB_URL is not defined in the environment variables.');
  }

  mongoose
    .connect(mongodbUrl)
    .then(() => {
      console.log('Database connected');
    })
    .catch((error) => {
      console.error('Database connection error:', error.message);
    });
};

export default dbConnect;
