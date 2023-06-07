import { Express, Request, Response } from 'express';
import {
  createUserHandler,
  getAllUserHandler,
  getUserHandler,
  updateUserHandler,
  UserLogIn,
  UserLogOut,
} from '../controller/user.controller';
import { authLocal, isLoggedIn } from '../middleware/auth.passport';
import { validateLogin } from '../middleware/signin.validate';
import validateUser from '../middleware/signUp.validate';

function userRoute(app: Express) {
  // health check
  app.get('/api/v1/user/health', (req: Request, res: Response) => {
    return res.status(200).send({
      message: 'OK',
    });
  });
  // Sign Up User
  app.post('/api/v1/user/signup', validateUser, createUserHandler);

  // Login user
  app.post('/api/v1/user/session', validateLogin, authLocal, UserLogIn);

  // // get user seesion
  // app.get('/api/v1/user/session', getSessionHandler)

  // get user self
  app.get('/api/v1/user/self', isLoggedIn, getUserHandler);

  // get all user for admin
  app.get('/api/v1/admin/users', isLoggedIn, getAllUserHandler);

  // update user self profile
  app.put('/api/v1/user/self', updateUserHandler);

  // user logout
  app.delete('/api/v1/user/session', isLoggedIn, UserLogOut);
}

export default userRoute;
