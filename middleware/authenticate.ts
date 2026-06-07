import { Request, Response, NextFunction } from 'express';

function authenticate(req: Request, res: Response, next: NextFunction) {
    if (req.session.authentication) {
        next();
    } else {
        res.redirect('/login');
    }
}

export default authenticate;