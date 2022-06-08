const express = require("express");
const router = express.Router();
const likesController = require("../../controllers/likesController");
const verifyJWT = require("../../middleware/verifyJWT");

router.post("/", verifyJWT, likesController.toggleLike);
module.exports = router;
