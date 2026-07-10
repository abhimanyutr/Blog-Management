const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
    console.log("Inside JWT Middleware");

    try {
        const token = req.headers.authorization.slice(7);

        console.log("\nToken from Request:", token);

        const jwtVerification = jwt.verify(token, process.env.jwtKey);

        console.log("\nJWT Verification Result:\n", jwtVerification);

        req.userId = jwtVerification.userId;
        req.userName = jwtVerification.userName;
        req.userMail = jwtVerification.userMail;
        req.role = jwtVerification.role;

        next();

    } catch (err) {
        res.status(401).json({
            success: false,
            message: "Invalid Token",
            error: err.message
        });
    }
};

module.exports = jwtMiddleware;