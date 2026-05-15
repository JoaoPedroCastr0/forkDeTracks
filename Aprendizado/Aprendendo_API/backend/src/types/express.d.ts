/* eslint-disable no-unused-vars */

import 'express';
import { SessionUser } from './auth';

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser;
  }
}
