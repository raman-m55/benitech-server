import mongoose from 'mongoose';

const validateMongoDbId = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid MongoDB ID');
  }
};

export default validateMongoDbId;
