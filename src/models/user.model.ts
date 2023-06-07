import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends mongoose.Document {
  _id: string
  status: {
    isHold: boolean
    isSuspended: boolean
  }
  fullName: {
    firstName: string
    lastName: string
  }
  email: string
  password: string
  role: {
    isCustomer: boolean
    isSubscriber: boolean
    isAdmin: boolean
    isFreelancer: boolean
  }
  createdAt: Date
  updatedAt: Date

  comparePassword(candidatePassword: string): Promise<boolean>
}

export const userSchema = new mongoose.Schema(
  {
    status: {
      isHold: { type: Boolean, default: false },
      isSuspended: { type: Boolean, default: false },
    },
    fullName: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      isCustomer: Boolean,
      isFreelancer: Boolean,
      isAdmin: Boolean,
      isSubscriber: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  let user = this as unknown as UserDocument;

  const SALT_NUMBER = config.get<number>('saltWorker');

  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_NUMBER);
  const hash = await bcrypt.hashSync(user.password, salt);

  user.password = hash;
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<Boolean> {
  const user = this as UserDocument;
  const isMatch = await bcrypt
    .compare(candidatePassword, user.password)
    .catch((e) => false);
  return isMatch;
};

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
