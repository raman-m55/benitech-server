import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false,
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    cart: {
      type: Array,
      default: [],
    },

    address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    isBlocked: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },

    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetExpires: Date,

    twoFactorCode: Number,

    twoFactorExpiry: Date,
  },
  {
    timestamps: true,
  }
);

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSaltSync(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.isPasswordMatched = async function (enterPassword: string) {
//   return await bcrypt.compare(enterPassword, this.password);
// };

// userSchema.method.createPasswordResetToken = async function() {

// }

const UserModel = mongoose.model('User', userSchema);
export default UserModel;
