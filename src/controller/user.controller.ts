import { Request, Response } from 'express'
import { UserDocument } from '../models/user.model'

import {
  createUser,
  findUserByEmail,
  getAllUser,
  getUser,
  updateUser,
} from '../service/user.service'
import logger from '../utils/logger'
// create user controller function
export async function createUserHandler(req: Request, res: Response) {
  try {
    // check user
    const user = await findUserByEmail(req.body.email)
    if (user) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const newUser = await createUser(req.body)
    res.status(201).json({
      message: 'Successfully created user',
    })
  } catch (e: any) {
    res.status(500).send(e)
  }
}
// login user
export const UserLogIn = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: 'Login successful',
      token: req.user,
    })
  } catch {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
}

// Logout the user function
export const UserLogOut = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    req.logout()
    res.status(200).json({
      message: 'Logout successful',
      token: null,
    })
  } catch {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
}

//get UserHandler function
export async function getUserHandler(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user._id // get user id from passport
  try {
    const user = await getUser(userId)
    res.status(200).json({
      message: 'Successfully fetched user',
      data: user,
    })
  } catch (e: any) {
    res.status(500).send(e)
  }
}

// get all user controller function
export async function getAllUserHandler(req: Request, res: Response) {
  try {
    const users = await getAllUser()
    if (users.length === 0) {
      return res.status(404).json({
        message: 'No user found',
      })
    }

    res.status(200).json({
      message: 'Successfully fetched all users',
      data: users,
    })
  } catch (e: any) {
    res.status(500).send({
      message: 'Internal server error',
      error: e.message,
    })
  }
}

// update UserHandler function
export async function updateUserHandler(req: Request, res: Response) {
  //@ts-ignore
  const userID = req.user._id as string

  try {
    const user = await updateUser(userID, req.body)
    res.status(200).json({
      message: 'Successfully update user',
    })
  } catch (e: any) {
    res.status(500).send(e)
  }
}
