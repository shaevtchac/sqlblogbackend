const ROLES_LIST = require("../config/roles_list");

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        let userAllowedByOwnership = false;
        if (!req?.user?.roles) return res.status(401).send("missing roles");
        const rolesArray = [...allowedRoles];

        if (rolesArray.includes(ROLES_LIST.Owner)) {
            rolesArray.splice(rolesArray.indexOf(ROLES_LIST.Owner), 1);
            userAllowedByOwnership = true;
        }
        const userIsAllowedByRole = req.user.roles
            .map((role) => rolesArray.includes(role))
            .find((val) => val === true);
        if (userIsAllowedByRole) {
            next();
        } else if (userAllowedByOwnership) {
            req.checkOwnership = true;
            next();
        } else {
            return res
                .status(401)
                .send("User is not authorized to access this resource.");
        }
    };
};

module.exports = verifyRoles;
