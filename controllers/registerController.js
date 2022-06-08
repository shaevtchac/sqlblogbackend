const { User, Role } = require("../models");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res
            .status(400)
            .json({ message: "Username and password are required." });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ where: { username } });
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);
        //create and store the new user
        const newUser = await User.create({
            username,
            password: hashedPwd,
        });

        //adding user role by default
        const userRole = await Role.findOne({ where: { name: "User" } });
        await userRole.addUser(newUser);

        res.status(201).json({ success: `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { handleNewUser };
