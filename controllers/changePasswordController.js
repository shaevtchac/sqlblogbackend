const { User } = require("../models");
const bcrypt = require("bcrypt");

const handleChangePassword = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const { oldPwd, newPwd } = req.body;
    if (!oldPwd || !newPwd)
        return res
            .status(400)
            .json({ message: "Old and new passwords are required." });

    const foundUser = await User.findOne({
        where: { refreshToken },
    });
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(oldPwd, foundUser.password);
    if (match) {
        try {
            const hashedPwd = await bcrypt.hash(newPwd, 10);
            // Saving new hashed password with current user
            foundUser.password = hashedPwd;
            const result = await foundUser.save();

            res.status(201).send("new password set");
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        res.sendStatus(401);
    }
};

module.exports = { handleChangePassword };
