import passport from 'passport';

import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET as string;
const loginStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const token = jwt.sign(
        {
          user: user._id,
        },
        JWT_SECRET,
        { expiresIn: '1h' },
      );

      return done(null, token);
    } catch (error) {
      return done(error);
    }
  },
);

// jwt strategy
const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },

  async (payload, done) => {
    try {
      const user = await UserModel.findById(payload.user, { password: 0 });
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  },
);

passport.use(loginStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const isLoggedIn = passport.authenticate('jwt', { session: false });
