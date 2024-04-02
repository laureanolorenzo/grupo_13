function loggedInMiddleware(req, res, next) {
    if (req.session.userLoggedIn) {
        res.locals.userLoggedIn = req.session.userLoggedIn;
        
    }
    next();
}

module.exports = loggedInMiddleware;