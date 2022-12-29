const jwt = require("jsonwebtoken")
const { isValidObjectId } = require('mongoose');
const userModel = require('../models/userModel');
//=============================== Authentication api ======================================================

const authentication = async function (req, res, next) {
    try {
        let token = req.headers.authorization

        if (!token) { return res.status(400).send({ status: false, msg: "Token is required" }); }

        let mainToken = token.split(" ").pop()

        jwt.verify(mainToken, "shopping", (err, decoded) => {
            if (err) {
                { return res.status(401).send({ status: false, meessage: err.message }) }
            } else {
                req.decoded = decoded
                next()
            }
        });
    }
    catch (err) {
        return res.status(500).send({ err: err.message })
    }
}

//=============================== Authorisation api ======================================================

const authorisation = async function (req, res, next) {
    try {
        let userIdfromParam = req.params.userId
        
        if (!isValidObjectId(userIdfromParam)) { return res.status(400).send({ status: false, message: " Enter a valid userId !" }) };

        const userByUserId = await userModel.findById(userIdfromParam)
        if (!userByUserId) { return res.status(404).send({ status: false, message: " User not found !" }) }
        req.userByUserId = userByUserId

        if (req.decoded.userId != userIdfromParam) { return res.status(403).send({ status: false, message: "Unauthorized access" }) }

        next()
    }
    catch (err) {
        return res.status(500).send({ err: err.message })
    }
}

module.exports = { authentication, authorisation }