import { Request, Response, NextFunction } from 'express';

function authenticateRegister(req: Request, res: Response, next: NextFunction) {
    if (!req.session.authentication) {
        next();
    } else {
        res.redirect('/home');
    }
}

export default authenticateRegister;