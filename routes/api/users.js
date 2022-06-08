const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/usersController");
const ROLES_LIST = require("../../config/roles_list");
const verifyJWT = require("../../middleware/verifyJWT");
const verifyRoles = require("../../middleware/verifyRoles");

router
    .route("/")
    .get(verifyJWT, verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)
    .delete(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin),
        usersController.deleteUser
    )
    .put(verifyJWT, verifyRoles(ROLES_LIST.Admin), usersController.editUser);

router
    .route("/:id")
    .get(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Owner),
        usersController.getUser
    );

module.exports = router;
