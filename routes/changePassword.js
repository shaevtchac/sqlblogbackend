const express = require("express");
const router = express.Router();
const changePasswordController = require("../controllers/changePasswordController");
const verifyJWT = require("../middleware/verifyJWT");

router.post("/", verifyJWT, changePasswordController.handleChangePassword);

module.exports = router;
