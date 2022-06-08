const { User, Role } = require("../models");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({
        where: { refreshToken },
        include: Role,
    });
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username)
                return res.sendStatus(403);
            const roles = foundUser.Roles.map((role) => role.value);
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        id: foundUser.id,
                        roles: roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10s" }
            );
            res.json({
                roles,
                accessToken,
                user: foundUser.username,
                id: foundUser.id,
            });
        }
    );
};

module.exports = { handleRefreshToken };
