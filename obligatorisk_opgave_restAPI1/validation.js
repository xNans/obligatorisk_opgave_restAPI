const Joi = require('joi');
const jwt = require('jsonwebtoken');


// funktion til validering af registrering
const registerValidation = (data) => {
    const schema = Joi.object({
        userName: Joi.string().min(8).max(50).required(),
        email: Joi.string().min(10).max(50).required(),
        password: Joi.string().min(6).max(50).required(),
    });

    return schema.validate(data);
};

// validering af login
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(10).max(50).required(),
        password: Joi.string().min(6).max(50).required(),
    });

    return schema.validate(data);
};


// Funktion  til verificering af token (JWT)
const verifyToken = (req, res, next) => {
    const token = req.header("auth-token");
    if(!token) return res.status(400).json({ error: "Ingen adgang" })

    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();

    } catch {
        res.status(400).json({ error: "Ugyldig token" });
    }
}

module.exports = {registerValidation, loginValidation, verifyToken}
