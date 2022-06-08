const { User, Role } = require("../models");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    const users = await User.findAll({ include: Role });
    if (!users) return res.status(204).json({ message: "No users found" });
    res.json(users);
};

const editUser = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ my_message: "User ID required" });

    try {
        const user = await User.findOne({ where: { id: req.body.id } });
        if (!user) {
            return res
                .status(404)
                .json({ my_message: `User ID ${req.body.id} not found` });
        }
        if (req?.body?.password && req?.body?.password !== "") {
            const password = req.body.password;
            const hashedPwd = await bcrypt.hash(password, 10);
            user.password = hashedPwd;
        }
        if (req?.body?.username) user.username = req.body.username;

        if (req?.body?.roles) {
            const allRoles = await Role.findAll();
            try {
                await user.setRoles(
                    allRoles.filter((role) =>
                        req.body.roles.includes(role.value.toString())
                    )
                );
            } catch (error) {
                console.log(error);
            }
        }

        try {
            const result = await user.save();
            return res.json("username and/or passwor updated");
        } catch (error) {
            console.log("Problem saving user to db");
            return res.status(500).json(error);
        }
    } catch (error) {
        console.log(`User ID ${req.body.id} not found`);
        return res.status(500).json(error);
    }
};

const deleteUser = async (req, res) => {
    if (!req?.body?.id)
        return res.status(400).json({ message: "User ID required" });
    const user = await User.findOne({ where: { id: req.body.id } });
    if (!user) {
        return res
            .status(204)
            .json({ message: `User ID ${req.body.id} not found` });
    }
    const result = await user.destroy();
    res.json(result);
};

const getUser = async (req, res) => {
    if (!req?.params?.id)
        return res.status(400).json({ message: "User ID required" });
    const user = await User.findOne({
        where: { id: req.params.id },
        attributes: ["username", "id", "createdAt", "updatedAt"],
    });
    if (!user) {
        return res
            .status(204)
            .json({ message: `User ID ${req.params.id} not found` });
    }

    if (req?.checkOwnership) {
        if (Number.parseInt(req.user.id) !== Number.parseInt(req.params.id))
            return res.status(401).send("User is not an owner of the resource");
    }
    res.json(user);
};

module.exports = {
    getAllUsers,
    deleteUser,
    editUser,
    getUser,
};
