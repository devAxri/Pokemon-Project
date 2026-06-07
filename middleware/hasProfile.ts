import { Request, Response, NextFunction } from 'express';

import * as databaseFunctions from '../database';

async function hasProfile(req: Request, res: Response, next: NextFunction) {
    if (req.session.authentication) {
        const email = req.session.authentication.email;
        const hasProfile = await databaseFunctions.hasProfile(email);
        if (hasProfile) {
            return next();
        }
        res.redirect('/setup');
    } else {
        res.redirect('/login');
    }

}

export default hasProfile;