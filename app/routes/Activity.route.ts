import * as express from 'express';

import {ActivityController} from '../controllers/user/Activity.controller';

import {mustBeAuthenticated} from '../middlewares';

export const ActivityRoute: express.Router = express.Router()
    .use('/mine', mustBeAuthenticated)
    .get('/mine', ActivityController.mine);