export { sessionCheck };

function sessionCheck(req, res, next) {
    if (!req.session) {
        res.status(401);
        return;
    } else {
        next();
    }
};