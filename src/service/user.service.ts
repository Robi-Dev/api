import UserModel, { UserDocument } from '../models/user.model';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { SessionDocument, SessionModel } from '../models/session.model';
import _ from 'lodash';

export async function createUser(input: any) {
  try {
    return await UserModel.create(input);
  } catch (e) {
    throw e;
  }
}

// find user by email services
export async function findUserByEmail(email: string) {
  try {
    return await UserModel.findOne({ email });
  } catch (e) {
    throw e;
  }
}

// validate user passowrd service
export async function validatePassword({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const user = await UserModel.findOne({ email });

  if (!user) return false;

  // compare passowrd
  const isMatch = await user.comparePassword(password);
  if (!isMatch) return false;

  return _.omit(user.toObject(), ['password']);
}

// get user service
export async function getUser(id: string) {
  try {
    // find user by is and rempove password
    return await UserModel.findById(id, { password: 0, __v: 0 }).lean();
  } catch (e) {
    throw e;
  }
}

// get all user service
export async function getAllUser() {
  try {
    return await UserModel.find(
      {},
      { password: 0, __v: 0, createdAt: 0, updatedAt: 0 },
    ).lean();
  } catch (e) {
    throw e;
  }
}

// find the userModel
export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

// update user service
export async function updateUser(query: any, update: any) {
  try {
    return await UserModel.findByIdAndUpdate(query, update, {
      new: true,
    });
  } catch (e) {
    throw e;
  }
}

// user logout service
export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>,
) {
  try {
    return await SessionModel.updateOne(query, update);
  } catch (e) {
    throw e;
  }
}
